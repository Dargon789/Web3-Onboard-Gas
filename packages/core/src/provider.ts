import { BehaviorSubject, fromEventPattern, Observable } from 'rxjs'
import { filter, takeUntil, take, share, switchMap } from 'rxjs/operators'
import partition from 'lodash.partition'
import { providers, utils } from 'ethers'
import type {
  EthSignMessageRequest,
  PersonalSignMessageRequest,
  EIP712Request_v4,
  EIP712Request,
  SubstrateProvider
} from '@subwallet-connect/common'
import { weiToEth } from '@subwallet-connect/common'
import { disconnectWallet$, qrModalConnect$, uriConnect$ } from './streams.js'
import { updateAccount, updateWallet } from './store/actions.js'
import { validEnsChain } from './utils.js';
import disconnect from './disconnect.js';
import { state } from './store/index.js';
import { getBNMulitChainSdk } from './services.js'
import { configuration } from './configuration.js'
import { getBalanceSubstrate } from './utils.js';
import BN from 'bn.js';


import type {
  ChainId,
  EIP1102Request,
  EIP1193Provider,
  ProviderAccounts,
  Chain,
  AccountsListener,
  ChainListener,
  SelectAccountsRequest
} from '@subwallet-connect/common'

import type {
  Account,
  Address,
  Balances,
  Ens, ModalQrConnect, WalletConnectState,
  WalletPermission,
  WalletState
} from './types.js'

import type { Uns } from '@subwallet-connect/unstoppable-resolution'
import { updateSecondaryTokens } from './update-balances'


export const ethersProviders: {
  [key: string]: providers.StaticJsonRpcProvider
} = {}

export function getProvider(chain: Chain): providers.StaticJsonRpcProvider {
  if (!chain) return null

  if (!ethersProviders[chain.rpcUrl]) {
    ethersProviders[chain.rpcUrl] = new providers.StaticJsonRpcProvider(
        chain.providerConnectionInfo && chain.providerConnectionInfo.url
            ? chain.providerConnectionInfo
            : chain.rpcUrl
    )
  }

  return ethersProviders[chain.rpcUrl]
}

export async function requestAccounts(
    provider: EIP1193Provider
): Promise<WalletConnectState> {
  const args = { method: 'eth_requestAccounts' } as EIP1102Request
  const address = await provider.request(args)
  return ({ address })
}

export function selectAccounts(
    provider: EIP1193Provider
): Promise<ProviderAccounts> {
  const args = { method: 'eth_selectAccounts' } as SelectAccountsRequest
  return provider.request(args)
}

export function getChainId(provider: EIP1193Provider): Promise<string> {
  return provider.request({ method: 'eth_chainId' }) as Promise<string>
}




export function listenAccountsChanged(args: {
  provider: EIP1193Provider | SubstrateProvider
  disconnected$: Observable<Pick<WalletState, 'label' | 'type'>>,
  type : 'evm'|'substrate'
}): Observable<ProviderAccounts> {
  const { provider, disconnected$, type } = args

  const addHandler = (handler: AccountsListener) => {
    provider.on('accountsChanged', handler)
  }

  const removeHandler = (handler: AccountsListener) => {
    provider.removeListener('accountsChanged', handler)
  }

  return fromEventPattern<ProviderAccounts>(addHandler, removeHandler).pipe(
      takeUntil(disconnected$)
  )
}

export function listenChainChanged(args: {
  provider: EIP1193Provider | SubstrateProvider
  disconnected$: Observable<Pick<WalletState, 'label' | 'type'>>
  type : 'evm' | 'substrate'
}): Observable<ChainId> {
  const { provider, disconnected$, type } = args
  const addHandler = (handler: ChainListener) => {
    provider.on('chainChanged', handler)
  }
  const removeHandler = (handler: ChainListener) => {
    provider.removeListener('chainChanged', handler)
  }

  return fromEventPattern<ChainId>(addHandler, removeHandler).pipe(
       takeUntil(disconnected$)
  )
}

export function listenUriChange(args: {
  provider: EIP1193Provider | SubstrateProvider
  uriConnect$: BehaviorSubject<string>
}): () => void {
  const { provider, uriConnect$ } = args

  const handler = (uri : string) => {
    uriConnect$.next(uri)
  }

  provider.on('uriChanged', handler);


  const removeHandler = () => {
    provider.removeListener('uriChanged', handler)
  }

  return removeHandler

}

export function listenStateModal(args: {
  provider: EIP1193Provider | SubstrateProvider
  qrModalConnect$: BehaviorSubject<ModalQrConnect>
}) : () => void {
  const { provider, qrModalConnect$ } = args;

  const handler = (state : boolean)=>{
    qrModalConnect$.next({ ...qrModalConnect$.value, isOpen : state })
  };


    provider.on('qrModalState', handler)

  const removeHandler = () => {
    provider.removeListener('qrModalState', handler)
  }

  return removeHandler
}


export function trackWallet(
    provider: EIP1193Provider | SubstrateProvider,
    label: WalletState['label'],
    type : 'evm' | 'substrate'
): void {

  const disconnected$ = disconnectWallet$.pipe(
      filter(wallet => wallet.label === label && wallet.type === type),
      take(1)
  )

  const accountsChanged$ = listenAccountsChanged({
    type,
    provider,
    disconnected$
  }).pipe(share())

  // when account changed, set it to first account and subscribe to events
  accountsChanged$.subscribe(async (addressList_) => {

    if (!addressList_ && addressList_.length <= 0) {
      disconnect({ label, type })
      return
    }
    // sync accounts with internal state
    // in the case of an account has been manually disconnected;
    const addressList = addressList_ .filter((a) => {
      return type === 'evm' ? a.toLowerCase().startsWith('0x') : !a.toLowerCase().startsWith('0x')
    })
    try {
      await syncWalletConnectedAccounts(label, type)
    } catch (error) {
      console.warn(
          'Web3Onboard: Error whilst trying to sync connected accounts:',
          error
      )
    }

    // no address, then no account connected, so disconnect wallet
    // this could happen if user locks wallet,
    // or if disconnects app from wallet
    if (!addressList && addressList.length <= 0) {
      await disconnect({ label, type })
      return;
    }

    const { wallets } = state.get()
    const walletFinded  = wallets
      .find(wallet => wallet.label === label && wallet.type === type)

    if(!walletFinded) {
      await disconnect({ label, type });
      return;
    }
    const { accounts  } = walletFinded;

    const [existingAccounts] = partition(
        accounts,
        account => addressList.find(
          ( address ) => address.includes(account.address)
        )
    )

    const newAccounts = addressList.filter(
      (address) =>
        !existingAccounts.find((account) => address.includes(account.address)
      ))

    // update accounts without ens/uns and balance first
    updateWallet(label, type, {
      accounts: existingAccounts.concat(newAccounts.map((address) => {
        let uns : Uns | null = null;
        let address_ = null;
        const inf = address.split('_');
        (inf.length === 2) && ( uns = { name: inf[1] });
        address_ = inf[0];

        return ({ address : address_, ens: null, uns, balance: null })
    }))
    })

    // if not existing account and notifications,
    // then subscribe to transaction events
    if (state.get().notify.enabled
      && !( existingAccounts && existingAccounts.length > 0 )) {
      const sdk = await getBNMulitChainSdk()

      if (sdk) {
        const wallet = state
            .get()
            .wallets.find(wallet =>
            wallet.label === label && wallet.type === type)
        try {
          addressList.forEach((address) => {
            sdk.subscribe({
              id: address,
              chainId: wallet.chains[0].id,
              type: 'account'
            })
          })

        } catch (error) {
          // unsupported network for transaction events
        }
      }
    }
  })

  // also when accounts change, update Balance and ENS/UNS
  accountsChanged$
      .pipe(
          switchMap(async (addressList_) => {

            if (!addressList_ && addressList_.length <= 0) {
              return
            }


            const addressList = addressList_ .filter((a) => {
              return type === 'evm' ? a.toLowerCase().startsWith('0x') : !a.toLowerCase().startsWith('0x')
            })

            if (!addressList && addressList.length <= 0) {
              return
            }

            const { wallets, chains } = state.get()

            const primaryWallet = wallets.find(
              wallet => wallet.label === label && wallet.type === type)
            const { chains: walletChains, accounts } = primaryWallet

            const [connectedWalletChain] = walletChains

            const chain = chains.find(
                ({ namespace, id }) =>
                    namespace === 'evm' && id === connectedWalletChain.id
            )

            return await Promise.all(addressList.map((address) => {
              const balanceProm =   getBalance(
                address, chain, primaryWallet.type
              )
              const secondaryTokenBal =  updateSecondaryTokens(
                primaryWallet,
                address,
                chain
              )
              const account =
                accounts.find(account => account.address === address)

              const ensChain = chains.find(
                ({ id }) => id === validEnsChain(connectedWalletChain.id)
              )

              const ensProm =
                account && account.ens
                  ? Promise.resolve(account.ens)
                  : ensChain
                    ? getEns(address, ensChain)
                    : Promise.resolve(null)

              const unsProm =
                account && account.uns
                  ? Promise.resolve(account.uns)
                  : getUns(address, chain)

              return Promise.all([
                Promise.resolve(address),
                balanceProm,
                ensProm,
                unsProm,
                secondaryTokenBal
              ])
            }))

          })
      )
      .subscribe( responds => {
        if (!responds) return;

        responds.forEach((res) => {
          const [address, balance, ens, uns, secondaryTokens] = res
          updateAccount(label, address, { balance, ens, uns, secondaryTokens })
        })

      })


  const chainChanged$ = listenChainChanged(
      { provider, disconnected$, type }).pipe(
      share()
  )

  // Update chain on wallet when chainId changed
  chainChanged$.subscribe(async chainId => {
    const { wallets } = state.get()
    const { chains, accounts } = wallets.find(wallet =>
      wallet.label === label && wallet.type === type)
    const [connectedWalletChain] = chains

    if (chainId === connectedWalletChain.id) return

    if (state.get().notify.enabled) {
      const sdk = await getBNMulitChainSdk()

      if (sdk) {
        const wallet = state
            .get()
            .wallets.find(wallet =>
            wallet.label === label && wallet.type === type)

        // Unsubscribe with timeout of 60 seconds
        // to allow for any currently inflight transactions
        wallet.accounts.forEach(({ address }) => {
          sdk.unsubscribe({
            id: address,
            chainId: wallet.chains[0].id,
            timeout: 60000
          })
        })

        // resubscribe for new chainId
        wallet.accounts.forEach(({ address }) => {
          try {
            sdk.subscribe({
              id: address,
              chainId: chainId,
              type: 'account'
            })
          } catch (error) {
            // unsupported network for transaction events
          }
        })
      }
    }

    const resetAccounts = accounts.map(
        ({ address }) =>
            ({
              address,
              ens: null,
              uns: null,
              balance: null
            } as Account)
    )

    updateWallet(label, type, {
      chains: [{ namespace: 'evm', id: chainId }],
      accounts: resetAccounts
    })
  })

  // when chain changes get ens/uns and balance for each account for wallet
  chainChanged$
      .pipe(
          switchMap(async chainId => {
            const { wallets, chains } = state.get()
            const primaryWallet = wallets.find(wallet =>
              wallet.label === label && wallet.type === type)
            const { accounts } = primaryWallet

            const chain = chains.find(
                ({ namespace, id }) => namespace === 'evm' && id === chainId
            )

            return Promise.all(
                accounts.map(async ({ address }, index) => {
                  const balanceProm
                      = getBalance(address, chain, primaryWallet.type)

                  const secondaryTokenBal = updateSecondaryTokens(
                      primaryWallet,
                      address,
                      chain
                  )
                  const ensChain = chains.find(
                      ({ id }) => id === validEnsChain(chainId)
                  )

                  const ensProm = ensChain
                      ? getEns(address, ensChain)
                      : Promise.resolve(null)

                  const unsProm = validEnsChain(chainId)
                      ? getUns(address, ensChain)
                      : Promise.resolve(null)

                  const [ ens, uns, secondaryTokens]
                      = await Promise.all([
                    ensProm,
                    unsProm,
                    secondaryTokenBal
                  ])
                  const balance = index === 0 ?
                      await balanceProm : { [chain.token] : null }

                  return {
                    address,
                    balance,
                    ens,
                    uns,
                    secondaryTokens
                  }
                })
            )
          })
      )
      .subscribe(updatedAccounts => {
        updatedAccounts &&
        updateWallet(label, type,  { accounts: updatedAccounts })
      })

  disconnected$.subscribe(async () => {
    if( type  === 'substrate') { await (provider as SubstrateProvider).disconnect()
    } else {
      (provider as EIP1193Provider).disconnect
      && (provider as EIP1193Provider).disconnect()
    }
  })
}

export async function getEns(
    address: Address,
    chain: Chain
): Promise<Ens | null> {
  // chain we don't recognize and don't have a rpcUrl for requests
  if (!chain) return null

  const provider = getProvider(chain)

  try {
    const name = await provider.lookupAddress(address)
    let ens = null

    if (name) {
      const resolver = await provider.getResolver(name)

      if (resolver) {
        const [contentHash, avatar] = await Promise.all([
          resolver.getContentHash(),
          resolver.getAvatar()
        ])

        const getText = resolver.getText.bind(resolver)

        ens = {
          name,
          avatar,
          contentHash,
          getText
        }
      }
    }

    return ens
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getUns(
    address: Address,
    chain: Chain
): Promise<Uns | null> {
  const { unstoppableResolution } = configuration

  // check if address is valid ETH address before attempting to resolve
  // chain we don't recognize and don't have a rpcUrl for requests
  if (!unstoppableResolution || !utils.isAddress(address) || !chain) return null

  try {
    return await unstoppableResolution(address)
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getBalance(
    address: string,
    chain: Chain,
    type : 'evm' | 'substrate'
): Promise<Balances | null> {
  // chain we don't recognize and don't have a rpcUrl for requests
  if (!chain) return null

  const { wallets } = state.get()

  try {
    const wallet = wallets.find(wallet => !!wallet.provider);
    const provider = wallet.provider
    if( type === 'evm'){
      const balanceHex =  await ( provider as  EIP1193Provider) .request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      })
      return balanceHex ? { [  chain.token || 'ETH']: weiToEth(balanceHex) } : null
    }else if( type === 'substrate'){
      try{

        const balancedData = await getBalanceSubstrate(
            { url : chain.blockExplorerUrl, data : { address : address }
            }
        )

        return {
          [chain.token] : parseFloat(new BN(balancedData).div(
              new BN(10 ** chain.decimal)).toString()).toString(10)
        }

      }catch(e){
        console.log(( e as Error).message)
        return {
          [chain.token] : '0'
        }
      }
    }

  } catch (error) {
    console.error(error)
    return null
  }
}

export function switchChain(
    provider: EIP1193Provider ,
    chainId: ChainId
): Promise<unknown> {

  return provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId }]
  })
}

export function addNewChain(
    provider: EIP1193Provider,
    chain: Chain
): Promise<unknown> {
  return provider.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: chain.id,
        chainName: chain.label,
        nativeCurrency: {
          name: chain.label,
          symbol: chain.token,
          decimals: 18
        },
        rpcUrls: [chain.publicRpcUrl || chain.rpcUrl],
        blockExplorerUrls: chain.blockExplorerUrl
            ? [chain.blockExplorerUrl]
            : undefined
      }
    ]
  })
}

export function updateChainRPC(
    provider: EIP1193Provider,
    chain: Chain,
    rpcUrl: string
): Promise<unknown> {
  return provider.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: chain.id,
        chainName: chain.label,
        nativeCurrency: {
          name: chain.label,
          symbol: chain.token,
          decimals: 18
        },
        rpcUrls: [rpcUrl],
        blockExplorerUrls: chain.blockExplorerUrl
            ? [chain.blockExplorerUrl]
            : undefined
      }
    ]
  })
}

export async function getPermissions(
    provider: EIP1193Provider
): Promise<WalletPermission[]> {
  try {

    const permissions = (await provider.request({
      method: 'wallet_getPermissions'
    })) as WalletPermission[]

    return Array.isArray(permissions) ? permissions : []
  } catch (error) {
    return []
  }
}

export async function signPersonalSignMessageRequest(
    provider : EIP1193Provider
) : Promise<string> {
  const { wallets } = state.get();
  return provider.request({
    method: 'personal_sign',
    params: ['hello, Im from subwallet connect', wallets[0].accounts[0].address]
  } as PersonalSignMessageRequest)
}

export async function signEthSignMessageRequest(
    provider : EIP1193Provider
) : Promise<string> {
  const { wallets } = state.get();

  return provider.request({
    method: 'eth_sign',
    params: [wallets[0].accounts[0].address, 'hello']
  } as EthSignMessageRequest)
}


export async function signTypedDataMessageRequest(
    provider : EIP1193Provider
) : Promise<string>{
  const { wallets, chains } = state.get();
  return provider.request({
    method: 'eth_signTypedData',
    params: [wallets[0].accounts[0].address,  {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' }
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' }
        ]
      },
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId : parseInt(chains[0].id, 16),
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
      },
      message: {
        from: {
          name: 'John Doe',
          wallet: wallets[0].accounts[0].address
        },
        to: {
          name: 'Alice',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
        },
        contents: 'Hello'
      }
    }]
  } as EIP712Request)
}


export async function signTypedData_v4MessageRequest(
    provider : EIP1193Provider
) : Promise<string>{
  const { wallets } = state.get();
  return provider.request({
    method: 'eth_signTypedData_v4',
    params: [wallets[0].accounts[0].address,  {
      domain: {
        chainId : 1,
        name: 'Ether Mail',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        version: '1'
      },
      message: {
        contents: 'Hello',
        from: {
          name: 'Cow',
          wallets: [
            wallets[0].accounts[0].address,
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF'
          ]
        },
        to: [
          {
            name: 'Alice',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000'
            ]
          }
        ]
      },
      primaryType: 'Mail',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ],
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' }
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' }
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' }
        ]
      }
    }]
  } as EIP712Request_v4)
}


export async function syncWalletConnectedAccounts(
    label: WalletState['label'],
    type: WalletState['type']
): Promise<void> {
  const wallet = state.get().wallets.find(
    wallet => wallet.label === label && wallet.type === type)
  const permissions = wallet.type === 'evm' ? await getPermissions((wallet.provider) as EIP1193Provider) : []
  const accountsPermissions = permissions.find(
      ({ parentCapability }) => parentCapability === 'eth_accounts'
  )

  if (accountsPermissions) {
    const { value: connectedAccounts } = accountsPermissions.caveats.find(
        ({ type }) => type === 'restrictReturnedAccounts'
    ) || { value: null }

    if (connectedAccounts) {
      const syncedAccounts = wallet.accounts.filter(({ address }) =>
          connectedAccounts.includes(address)
      )

      updateWallet(
        wallet.label,
        wallet.type,
        { ...wallet, accounts: syncedAccounts }
      )
    }
  }
}

export const enable = async (
    provider : SubstrateProvider
)
    : Promise<WalletConnectState> => {

    const accounts = await provider.enable();

    return accounts;
}

export const signDummy = async (wallet : WalletState) => {
  const signer = wallet?.signer;
  if (signer && signer.signRaw) {
    return  await (wallet.provider as SubstrateProvider).signDummy(wallet.accounts[0].address, 'Hello Im from subWallet', signer);
  }else{
    return await  (wallet.provider as SubstrateProvider).signDummy(wallet.accounts[0].address, 'Hello Im from subWallet', undefined);
  }
}




