import { isHexString } from './index.js'

import type { JQueryStyleEventEmitter } from 'rxjs/internal/observable/fromEvent'
import type {WalletConnectOptions} from './types.js'
import type { CoreTypes } from '@walletconnect/types'
import type {
  Chain,
  ProviderAccounts,
  WalletInit,
 SubstrateProvider
} from '@subwallet_connect/common'
import {UniversalProviderOpts, RequestArguments} from "@walletconnect/universal-provider";
import { Signer } from '@polkadot/types/types/extrinsic.js'

// methods that require user interaction
const methods = [
  'polkadot_signTransaction',
  'polkadot_signMessage',
  'polkadot_sendTransaction',
  'polkadot_getBalance',
  'polkadot_requestAccounts'
]

function walletConnect(options: WalletConnectOptions): WalletInit {
  if (!options.projectId) {
    throw new Error(
      'WalletConnect requires a projectId. Please visit https://cloud.walletconnect.com to get one.'
    )
  }
  if (!options.dappUrl) {
    console.warn(
      `It is strongly recommended to supply a dappUrl to the WalletConnect init object as it is required by some wallets (i.e. MetaMask) to allow connection.`
    )
  }
  const {
    projectId,
    handleUri,
    requiredChains,
    optionalChains,
    qrModalOptions,
    additionalRequiredMethods,
    additionalOptionalMethods,
    dappUrl
  } = options

  let instance: unknown

  return () => {
    return {
      label: 'WalletConnect',
      type: 'substrate',
      getIcon: async () => (await import('./icon.js')).default,
      getInterface: async ({chains,           EventEmitter, appMetadata}) => {

        const {ProviderRpcError, ProviderRpcErrorCode} = await import(
          '@subwallet_connect/common'
          )

        const {UniversalProvider} = await import(
          '@walletconnect/universal-provider'
          )

        const {Subject, fromEvent} = await import('rxjs')
        const {takeUntil, take} = await import('rxjs/operators')


        const getMetaData = (): CoreTypes.Metadata | undefined => {
          if (!appMetadata) return undefined
          const url = dappUrl || appMetadata.explore || ''

          !url &&
          !url.length &&
          console.warn(
            `It is strongly recommended to supply a dappUrl as it is required by some wallets (i.e. MetaMask) to allow connection.`
          )
          const wcMetaData: CoreTypes.Metadata = {
            name: appMetadata.name,
            description: appMetadata.description || '',
            url,
            icons: []
          }

          if (appMetadata.icon !== undefined && appMetadata.icon.length) {
            wcMetaData.icons = [appMetadata.icon]
          }
          if (appMetadata.logo !== undefined && appMetadata.logo.length) {
            wcMetaData.icons = wcMetaData.icons.length
              ? [...wcMetaData.icons, appMetadata.logo]
              : [appMetadata.logo]
          }

          return wcMetaData
        }

        // default to mainnet
        const requiredChainsParsed: number[] =
          Array.isArray(requiredChains) &&
          requiredChains.length &&
          requiredChains.every(num => !isNaN(num))
            ? // @ts-ignore
              // Required as WC package does not support hex numbers
            requiredChains.map(chainID => parseInt(chainID))
            : []

        // Defaults to the chains provided within the web3-onboard init chain property
        const optionalChainsParsed: number[] =
          Array.isArray(optionalChains) &&
          optionalChains.length &&
          optionalChains.every(num => !isNaN(num))
            ? // @ts-ignore
              // Required as WC package does not support hex numbers
            optionalChains.map(chainID => parseInt(chainID))
            : chains.map(({id}) => parseInt(id, 16))


        const optionalMethods =
          additionalOptionalMethods && Array.isArray(additionalOptionalMethods)
            ? [...additionalOptionalMethods, ...methods]
            : methods

        const connector = await UniversalProvider.init({
          projectId,
          relayUrl: 'wss://relay.walletconnect.com',
          metadata: getMetaData(),
        } as UniversalProviderOpts)

        const generateAccountAddress = (address?: string[]) => {
          const CAPId = chains[0].id

          if (!connector.session) {
            return [];
          }
          if(address){
            return address.filter((address) => (
              address.includes(CAPId)
            )).map((account) => (account.replace(`polkadot:${CAPId}:`, "")));
          }

          return Object.values(connector.session.namespaces)
            .map(namespace => namespace.accounts)
            .flat().filter((address) => (
              address.includes(CAPId)
            )).map((account) => (account.replace(`polkadot:${CAPId}:`, "")));
        }

        const convertChainIdToCaipId = () => {
          return chains.map((chain) => (
            `polkadot:${chain.id}`
          ))
        }



        const emitter = new EventEmitter()

        class Provider implements SubstrateProvider {
          public connector: InstanceType<typeof UniversalProvider>
          public chains: Chain[]
          // @ts-ignore
          public emit: typeof EventEmitter['emit']
          // @ts-ignore
          public on: typeof EventEmitter['on']
          // @ts-ignore
          public removeListener: typeof EventEmitter['removeListener']

          private disconnected$: InstanceType<typeof Subject>


          constructor({
                        connector,
                        chains
                      }: {
            connector: InstanceType<typeof UniversalProvider>
            chains: Chain[]
          }) {
            this.emit = emitter.emit.bind(emitter)
            this.on = emitter.on.bind(emitter)
            this.removeListener = emitter.removeListener.bind(emitter)

            this.connector = connector
            this.chains = chains
            this.disconnected$ = new Subject()




            // listen for accountsChanged
            fromEvent(this.connector, 'accountsChanged', payload => payload)
              .pipe(takeUntil(this.disconnected$))
              .subscribe({
                next: payload => {
                  const accounts = generateAccountAddress(Array.isArray(payload) ? payload : [payload])
                  this.emit('accountsChanged', accounts)
                },
                error: console.warn
              })

            // listen for chainChanged
            fromEvent(
              this.connector as JQueryStyleEventEmitter<any, number>,
              'chainChanged',
              (payload: number) => payload
            )
              .pipe(takeUntil(this.disconnected$))
              .subscribe({
                next: chainId => {
                  const hexChainId = isHexString(chainId)
                    ? chainId
                    : `0x${chainId.toString(16)}`
                  this.emit('chainChanged', hexChainId)
                },
                error: console.warn
              })

            // listen for disconnect event
            fromEvent(
              this.connector as JQueryStyleEventEmitter<any, string>,
              'session_delete',
              (payload: string) => payload
            )
              .pipe(takeUntil(this.disconnected$))
              .subscribe({
                next: () => {
                  this.emit('accountsChanged', [])
                  this.disconnected$.next(true)
                  typeof localStorage !== 'undefined' &&
                  localStorage.removeItem('walletconnect_polkadot')
                },
                error: console.warn
              })



            // listen for uri event
            fromEvent(
              this.connector as JQueryStyleEventEmitter<any, string>,
              'display_uri',
              (payload: string) => payload
            )
              .pipe(takeUntil(this.disconnected$))
              .subscribe(async uri => {
                try {
                  this.emit('uriChanged', uri)
                  handleUri && (await handleUri(uri))
                } catch (error) {
                  throw `An error occurred when handling the URI. Error: ${error}`
                }
              })


            const checkForSession = () => {
              const session = this.connector.session
              instance = session
              if (session) {
                this.emit('accountsChanged', generateAccountAddress())
                this.emit('chainChanged', chains[0])
              }
            }
            checkForSession()

          }


          async enable() {

            let address : string[] = [];
            try {
              address = await this.request({method : 'polkadot_requestAccounts'});
            }catch (e) {}
            return{
              address
            }
          }


          async signDummy(address: string, data: string, wallet?: Signer | undefined) {
              const result = await this.request({method: 'polkadot_signMessage', params: {
                  address,
                  data,
                  type: 'bytes'
                }})
            return result || ''
          }

          async  disconnect() {
              if (this.connector.session) {
                await this.connector.disconnect();
                instance = null
            }
          }

          async request ({method, params} : RequestArguments) {

            if (method === 'polkadot_requestAccounts') {
              return new Promise<ProviderAccounts>(
                async (resolve, reject) => {
                  console.log('request account');
                  // Subscribe to connection events
                  fromEvent(
                    this.connector as JQueryStyleEventEmitter<
                      any,
                      { chainId: number }
                    >,
                    'connect',
                    (payload: { chainId: number | string }) => payload
                  )
                    .pipe(take(1))
                    .subscribe({
                      next: ({chainId}) => {
                        this.emit('accountsChanged', generateAccountAddress())
                        this.emit('chainChanged', convertChainIdToCaipId())
                        this.emit('qrModalState', false)
                        resolve(generateAccountAddress())
                      },
                      error: reject
                    })

                  // Check if connection is already established
                  if (!this.connector.session) {
                    // create new session

                    await this.connector.connect({
                      namespaces: {
                        polkadot: {
                          methods: optionalMethods,
                          chains: convertChainIdToCaipId(),
                          events: ['chainChanged", "accountsChanged', 'connect']
                        },
                      }
                    }).catch(err => {
                      console.error('err creating new session: ', err)
                      reject(
                        new ProviderRpcError({
                          code: 4001,
                          message: 'User rejected the request.'
                        })
                      )
                    })
                  } else {
                    // update ethereum provider to load accounts & chainId
                    const accounts = generateAccountAddress()
                    const chainId = chains[0]
                    instance = this.connector.session
                    this.emit('chainChanged', chainId)
                    this.emit('qrModalState', false)
                    return resolve(accounts)
                  }
                }
              )
            }

            if (method === 'polkadot_signMessage') {

              if(!this.connector.session) {
                return ''
              }

              try {
                const result = await this.connector?.client.request({
                  topic: this.connector.session.topic,
                  request: {
                    method: 'polkadot_signMessage',
                    params
                  },
                  chainId: `polkadot:${chains[0].id}`
                })

                return result;
              }catch (e) {
                throw new ProviderRpcError({
                  code: ProviderRpcErrorCode.UNSUPPORTED_METHOD,
                  message: `The Provider does not support the requested method: ${method}`
                })

              }
            }

            return this.connector.request<Promise<any>>({
              method,
              params
            })
          }

        }

        return {
          provider: new Provider({ chains, connector }),
          instance
        }
      }
    }
  }
}

export default walletConnect
