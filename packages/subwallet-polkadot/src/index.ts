import type { WalletInit, EIP1193Provider } from '@subwallet-connect/common'
import {ProviderRpcError, SubstrateProvider, WalletInterfaceSubstrate} from "@subwallet-connect/common";
import { InjectedMetadata, InjectedWindow } from "@polkadot/extension-inject/types";
import EventEmitter from "eventemitter3";
import { Signer } from "@polkadot/types/types";
import { EXTENSION_NAME, DAPP_NAME, URL_INSTALL} from "./constant.js";

function SubWallet (): WalletInit {
  if (typeof window === 'undefined') return () => null

  return () => {

    return {
      label: 'SubWallet',
      type: 'substrate',
      getIcon: async () => (await import('./icon.js')).default,
      platforms: ['desktop'],
      getInterface: async (): Promise<WalletInterfaceSubstrate> => {
        const isInstalled = (extensionName: string) => {
          const injectedWindow = window as unknown as Window & InjectedWindow;
          const injectedExtension =
            injectedWindow?.injectedWeb3 && injectedWindow?.injectedWeb3[extensionName]
          return !!injectedExtension;
        }

        if(!isInstalled(EXTENSION_NAME)){
          window.open(URL_INSTALL, '_blank');
          throw new Error('Please Install SubWallet wallet to use this wallet');
        }
        const getRawExtension = (extensionName: string) => {
          const injectedWindow = window as unknown as Window & InjectedWindow;
          return injectedWindow?.injectedWeb3[extensionName];
        }
        const emitter = new EventEmitter()
        const provider: SubstrateProvider = {
          async enable() {

            try {
              const injectedExtension = getRawExtension(EXTENSION_NAME);

              if (!injectedExtension || !injectedExtension.enable) {
                return;
              }

              const rawExtension = await injectedExtension.enable(DAPP_NAME);
              if (!rawExtension) {
                return;
              }
              const accounts = await rawExtension.accounts.get();

              rawExtension.accounts.subscribe(account => {
                emitter.emit('accountsChanged', account.map(
                  (account) => `${account.address}_${account.name}`
                ))
              })

              return {
                signer: rawExtension.signer as Signer,
                metadata: rawExtension.metadata as InjectedMetadata,
                address: accounts.map(
                  (account) => `${account.address}_${account.name}`
                )
              }
            } catch (e) {
              throw new ProviderRpcError({
                code: 4001,
                message: 'User rejected the request.'
              })
            }
          },
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
          },

          async request() {},

          async disconnect() {},

          on: emitter.on.bind(emitter),
          removeListener: emitter.removeListener.bind(emitter)

        }

        return {
          provider
        }
      },
    }
  }

}

export default SubWallet
