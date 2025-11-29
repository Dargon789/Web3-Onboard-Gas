import type { SubstrateProvider, WalletInit, WalletInterfaceSubstrate } from '@subwallet-connect/common';
import { ProviderRpcErrorMessage } from '@subwallet-connect/common';
import EventEmitter from 'eventemitter3';
import type { Signer } from '@polkadot/types/types';
import type { PayloadParams, RequestArguments } from './types.js';
import modalConnect from './views/index.js';
import { generateAccount } from './utils.js';
import { u8aWrapBytes } from '@polkadot/util';


function PolkadotVault (): WalletInit {
  if (typeof window === 'undefined') return () => null

  return () => {

    return {
      label: 'Polkadot Vault',
      type: 'substrate',
      getIcon: async () => (await import('./icon/logoWallet.js')).default,
      platforms: ['desktop'],
      getInterface: async ({ chains }): Promise<WalletInterfaceSubstrate> => {

        const emitter = new EventEmitter()
        const { ProviderRpcError, ProviderRpcErrorCode } = await import(
          '@subwallet-connect/common'
          )


        class PolkadotVaultProvider  implements SubstrateProvider{

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          public emit: typeof EventEmitter['emit']
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          public on: typeof EventEmitter['on']
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          public removeListener: typeof EventEmitter['removeListener']

          constructor() {
            this.emit = emitter.emit.bind(emitter)
            this.on = emitter.on.bind(emitter)
            this.removeListener = emitter.removeListener.bind(emitter)
          }

          async enable() {
              const account = await this.request({ method: 'polkadot_requestAccounts' })

              return {
                address: [account as string]
              }
          }
          async signDummy(address: string, data: string,
                          signer: Signer) {
            if (signer && signer.signRaw) {
              return (await signer.signRaw({
                address: address,
                data: 'This is dummy message',
                type: 'bytes'
              })).signature as string;
            }
            return '0x0'
          }

          async request ({ method, params } : RequestArguments) {

            if(method === 'polkadot_requestAccounts') {
              try {
                const account = await modalConnect('getAccount');

                if(!account) {
                  throw new ProviderRpcError({
                    code: 4001,
                    message: ProviderRpcErrorMessage.ACCOUNT_ACCESS_REJECTED
                  })
                }

                const {
                  address,
                  genesisHash,
                  isSubstrate
                } = generateAccount(account);

                if(!isSubstrate){
                  throw new ProviderRpcError({
                    code: 4001,
                    message: 'Type wallet is invalid'
                  })
                }

                const uniqueChainNetwork = chains.find(({ id, namespace }) => namespace === 'substrate' && genesisHash.includes(id));
                if(uniqueChainNetwork){
                  this.emit('chainChanged', uniqueChainNetwork.id)
                }
                return address;
              }catch (e) {
                throw new ProviderRpcError({
                  code: 4001,
                  message: ProviderRpcErrorMessage.ACCOUNT_ACCESS_REJECTED
                })
              }
            }
            if(method === 'polkadot_signMessage') {
              if(!( params && Array.isArray(params) && params.length >= 3)){
                throw new ProviderRpcError({
                  code: ProviderRpcErrorCode.INVALID_PARAMS,
                  message: 'Need params to request this method'
                })
              }
              try {

                const result = await modalConnect('signTransaction', {
                  isMessage: true,
                  genesisHash: params[2],
                  address: params[0],
                  transactionPayload:  u8aWrapBytes(params[1])
                } as PayloadParams);
                if(!result) {
                  throw new ProviderRpcError({
                    code: 4001,
                    message: 'User reject this request'
                  })
                }
                return  { signature: result };
              }catch (e) {
                throw new ProviderRpcError({
                  code: ProviderRpcErrorCode.DISCONNECTED,
                  message: (e as Error).message
                })
              }
            }

            if(method === 'polkadot_sendTransaction'){
              if(! params){
                throw new ProviderRpcError({
                  code: ProviderRpcErrorCode.INVALID_PARAMS,
                  message: 'Need params to request this method'
                })
              }
              try {
                const result = await modalConnect('signTransaction', { isMessage: false, ...params } as PayloadParams);
                return  { signature: result };
              }catch (e) {
                throw new ProviderRpcError({
                  code: ProviderRpcErrorCode.DISCONNECTED,
                  message: (e as Error).message
                })
              }

            }
          }

          async disconnect() {}


        }

        return {
          provider: new PolkadotVaultProvider()
        }
      },
    }
  }
}

export default PolkadotVault
