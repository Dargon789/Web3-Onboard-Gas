import {
  Chain,
  Platform,
  ProviderRpcError,
  ProviderRpcErrorCode,
  SubstrateProvider,
  WalletInit,
  WalletInterfaceSubstrate
} from '@subwallet_connect/common'
import {Ledger} from "@polkadot/hw-ledger";
import type {BigNumber} from 'ethers'

import type {Account, Asset, ScanAccountsOptions} from '@subwallet_connect/hw-common'
import {Subject} from 'rxjs';
import {RequestArguments} from '@walletconnect/ethereum-provider/dist/types/types.js';
import {isArray} from "@shapeshiftoss/hdwallet-core";


const DEFAULT_PATH = "44'/354'/0'/0/0"

const DEFAULT_BASE_PATHS = [
    {
        label: 'Polkadot',
        value: DEFAULT_PATH
    }
]

const assets = [
    {
        label: 'POLKADOT'
    }
]

const ERROR_BUSY: ErrorCode = 'busy'
const ERROR_PAIRING: ErrorCode = 'pairing'
const ERROOR_CHOICEPOLKADOT : ErrorCode = 'choice'

const errorMessages = {
    [ERROR_BUSY]: `Your Ledger is currently connected to another application.
  Please close any other browser tabs or applications that may be connected to your device and try again.`,
    [ERROR_PAIRING]:
        'There was an error pairing the device. Please disconnect and reconnect the device and try again.',
    [ERROOR_CHOICEPOLKADOT] :
        'Please Ready Polkadot application in your Ledger hardwallet'

}

type ErrorCode = 'busy' | 'pairing' | 'choice'

const methodList = [
  'polkadot_signMessage',
  'polkadot_requestAccounts',
  'polkadot_transaction'
]
function ledgerPolkadot({
         filter,
         containerElement,
         consecutiveEmptyAccountThreshold
         }: {
    filter?: Platform[]
    containerElement?: string
    /**
     * A number that defines the amount of consecutive empty addresses displayed
     * within the Account Select modal. Default is 5
     */
    consecutiveEmptyAccountThreshold?: number
} = {}): WalletInit {
    const getIcon = async () => (await import('./icon.js')).default

    return ({ device }) => {
        let accounts: Account[] | undefined

        const filtered =
            Array.isArray(filter) &&
            (filter.includes(device.type) || filter.includes(device.os.name))

        if (filtered) return null

        return {
            type: 'substrate',
            label: 'Ledger',
            getIcon,
            getInterface: async ({ EventEmitter, chains }) : Promise<WalletInterfaceSubstrate> =>  {

                const { accountSelect } = await import(
                    '@subwallet_connect/hw-common')

                const eventEmitter = new EventEmitter();
                const consecutiveEmptyAccounts = consecutiveEmptyAccountThreshold || 10;

                let currentChain: Chain = chains[0];
                const chainDefault = 'polkadot';

              const  stringToUint8Array = (str : string) => {
                const  buffer = new ArrayBuffer(str.length);
                const view = new Uint8Array(buffer);

                return view.map((value, index) => {
                  return   str.charCodeAt(index);
                });
              }

              const getPath = (accountIdx : number) => {
                return DEFAULT_BASE_PATHS[0].value.replace("'/0'", `'/${accountIdx}'`)
              }

                class LedgerPolkadot  implements SubstrateProvider{

                    // @ts-ignore
                    public emit: typeof EventEmitter['emit']
                    //
                    private ledger :Ledger | undefined
                    // @ts-ignore
                    public on: typeof EventEmitter['on']
                    // @ts-ignore
                    public removeListener: typeof EventEmitter['removeListener']

                    private disconnected$: InstanceType<typeof Subject>


                  constructor() {
                    this.emit = eventEmitter.emit.bind(eventEmitter)
                    this.on = eventEmitter.on.bind(eventEmitter)
                    this.removeListener = eventEmitter.removeListener.bind(eventEmitter)

                    this.disconnected$ = new Subject()

                  }

                   async getAccount  ({ accountIdx, asset }: {
                    accountIdx: number
                    asset: Asset
                  }): Promise<Account | undefined> {

                    let address = ''
                    try{
                      const account= await this.ledger?.getAddress(false, accountIdx, 0);
                      if(!account){
                        return ;
                      }
                      address = account.address
                    }catch (e){
                      throw new ProviderRpcError({
                        code: 4001,
                        message: errorMessages[ERROOR_CHOICEPOLKADOT]
                      })
                    }
                     return {
                       address,
                       derivationPath : getPath(accountIdx),
                       balance: {
                         asset: asset.label || 'DOT',
                         value: 0 as unknown  as BigNumber
                       }
                     }
                  }
                     getAllAccounts = async ({ asset
                     }: {
                        derivationPath : string
                        asset: Asset
                    }) => {
                        try {
                            let index = 0
                            let zeroBalanceAccounts = 0
                            const accounts = []

                            // Iterates until a 0 balance account is found
                            // Then adds 4 more 0 balance accounts to the array
                            while (zeroBalanceAccounts < consecutiveEmptyAccounts) {
                                const acc = await this.getAccount({
                                  accountIdx: index,
                                  asset
                                })
                                if (
                                  acc
                                ) {
                                    zeroBalanceAccounts++
                                    accounts.push(acc)
                                } else {
                                    accounts.push(acc)
                                    // Reset the number of 0 balance accounts
                                    zeroBalanceAccounts = 0
                                }

                                index++
                            }

                            return accounts
                        } catch (error) {
                            throw new Error(
                              (error as { message: { message: string } }).message.message
                            )
                        }
                    }
                     scanAccounts = async ({
                            derivationPath,
                            chainId,
                            asset
                        }: ScanAccountsOptions): Promise<Account[]> => {
                        currentChain = chains.find(({ id }) => id === chainId) || currentChain

                        const accountResult = ( (await this.getAllAccounts({ asset, derivationPath }))?.filter((account) => account ) || []) as Account[]

                        return accountResult;
                    }
                     chainFilter = chains.filter( chain => chain.namespace === 'substrate')


                     getAccounts = async () => {
                        accounts = await accountSelect({
                            basePaths: DEFAULT_BASE_PATHS,
                            assets,
                            chains : [this.chainFilter[0]],
                            scanAccounts : this.scanAccounts,
                            containerElement
                        })
                        if (!accounts) throw new Error('No accounts were found')
                        if (accounts.length) {
                            eventEmitter.emit('accountsChanged', [accounts[0].address])
                        }

                        return accounts
                    }

                     signMessage = async (address: string, message: string) => {
                        if (
                          !accounts ||
                          !Array.isArray(accounts) ||
                          !(accounts.length && accounts.length > 0)
                        )
                            throw new Error(
                              'No account selected. Must call eth_requestAccounts first.'
                            )

                        const accountIdx =
                          accounts.findIndex(account => account.address === address) || 0

                        if(!this.ledger){
                          throw new ProviderRpcError({
                            code: 4001,
                            message: errorMessages[ERROOR_CHOICEPOLKADOT]
                          })
                        }
                        const { signature } = await this.ledger.signRaw(stringToUint8Array(message), 0, 0);
                        return signature
                    }
                    async enable() {
                        try {
                            this.ledger = new Ledger('webusb', 'polkadot');
                            if(!this.ledger){
                              throw new ProviderRpcError({
                                code: 4001,
                                message: errorMessages[ERROOR_CHOICEPOLKADOT]
                              })
                            }
                            // Triggers the account select modal if no accounts have been selected
                            const accounts = await this.getAccounts()

                            if (!accounts || !Array.isArray(accounts)) {
                                throw new Error('No accounts were returned from Keepkey device')
                            }
                            if (!accounts.length) {
                                throw new ProviderRpcError({
                                    code: 4001,
                                    message: 'User rejected the request.'
                                })
                            }
                            if (!accounts[0].hasOwnProperty('address')) {
                                throw new Error(
                                  'The account returned does not have a required address field'
                                )
                            }
                            return {
                                address: accounts.map((account) => account.address),
                                signer: undefined
                            }
                        } catch (error) {
                            const {name} = error as { name: string }
                          console.log(error)
                            // This error indicates that the keepkey is paired with another app
                            throw new ProviderRpcError({
                                code: 4001,
                                message: errorMessages[ERROR_BUSY]
                            })

                            // This error indicates that for some reason we can't claim the usb device
                        }

                    }

                    async signDummy(address: string, message: string) {
                        return await this.signMessage(address, message) || '0x0'
                    }

                    async disconnect () {
                      if(!this.ledger){
                        throw new ProviderRpcError({
                          code: 4001,
                          message: errorMessages[ERROOR_CHOICEPOLKADOT]
                        })
                      }
                      return this.ledger.withApp(async (app) => {
                        await app.transport.close();
                      });
                    }

                  async request ({method, params} : RequestArguments) {
                    if(!methodList.includes(method)) {
                      throw new ProviderRpcError({
                        code: ProviderRpcErrorCode.UNSUPPORTED_METHOD,
                        message: `The Provider does not support the requested method: ${method}`
                      })
                    }


                    if ( method === 'polkadot_signMessage' ) {
                      try {
                        if(!(isArray(params)&& params.length > 0 )) {
                          throw new ProviderRpcError({
                            code: ProviderRpcErrorCode.INVALID_PARAMS,
                            message: `The Provider does not support the requested params: ${params}`
                          })
                        };

                        return  await this.signMessage(params[0] as string, params[1] as string);
                      }catch (e) {
                        throw new ProviderRpcError({
                          code: ProviderRpcErrorCode.UNSUPPORTED_METHOD,
                          message: `The Provider does not support the requested method: ${method}`
                        })
                      }
                    }

                    if( method === 'polkadot_requestAccounts' ){
                      try {
                        return await this.enable();
                      }catch (e) {
                        throw new ProviderRpcError({
                          code: ProviderRpcErrorCode.UNSUPPORTED_METHOD,
                          message: `The Provider does not support the requested method: ${method}`
                        })
                      }
                    }

                    if( method === 'polkadot_transaction'){
                      try{
                        if(!this.ledger){
                          throw new ProviderRpcError({
                            code: 4001,
                            message: errorMessages[ERROOR_CHOICEPOLKADOT]
                          })
                        }
                        if (params) {
                          return await this.ledger.sign(stringToUint8Array(params.toString()));
                        }
                      }catch (e) {
                        throw new ProviderRpcError({
                          code: ProviderRpcErrorCode.INVALID_PARAMS,
                          message: `The Provider does not support the requested params: ${params}`
                        })
                      }
                    }

                    throw new ProviderRpcError({
                      code: ProviderRpcErrorCode.INVALID_PARAMS,
                      message: `The Provider does not support the requested params: ${params}`
                    })
                  }

              }

                return {
                    provider: new LedgerPolkadot()
                }
            }
        }
    }
}

export default ledgerPolkadot
