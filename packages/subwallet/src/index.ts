import type { WalletInit, EIP1193Provider } from '@subwallet-connect/common'
import {
  createEIP1193Provider,
  SimpleEventEmitter,
  WalletInterface
} from "@subwallet-connect/common";
import { CustomWindow } from "./types.js";
import { URL_INSTALL } from "./constant.js";
declare const window: CustomWindow

function SubWallet (): WalletInit {
  if (typeof window === 'undefined') return () => null

  return () => {

    return {
      label: 'SubWallet',
      type: 'evm',
      getIcon: async () => (await import('./icon.js')).default,
      platforms: ['desktop'],
      getInterface: async ():Promise<WalletInterface> => {
        const subwalletExist = window.hasOwnProperty('SubWallet');


        if(subwalletExist){

          const subwalletProvider : EIP1193Provider = window.SubWallet as EIP1193Provider

          const addListener: SimpleEventEmitter['on'] =
            subwalletProvider.on.bind(subwalletProvider)

          subwalletProvider.on = (event, func) => {
            addListener(event, func)
          }
          const provider = createEIP1193Provider(subwalletProvider)

          provider.removeListener = (event, func) => {}

          return {
            provider
          }
        }else{
          window.open(URL_INSTALL, '_blank')
          throw new Error('Please Install SubWallet wallet to use this wallet')
        }

      },

    }
  }

}

export default SubWallet
