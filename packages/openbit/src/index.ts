import type { WalletInit, EIP1193Provider } from '@subwallet-connect/common'
import {
  createEIP1193Provider,
  SimpleEventEmitter,
  WalletInterface
} from "@subwallet-connect/common";
import { CustomWindow } from "./types.js";
import { URL_INSTALL } from "./constant.js";
declare const window: CustomWindow

function OpenBit (): WalletInit {
  if (typeof window === 'undefined') return () => null

  return () => {

    return {
      label: 'OpenBit',
      type: 'evm',
      getIcon: async () => (await import('./icon.js')).default,
      platforms: ['desktop'],
      getInterface: async ():Promise<WalletInterface> => {
        const openBitExist = window.hasOwnProperty('OpenBit');


        if(openBitExist){

          const openBitProvider : EIP1193Provider = window.OpenBit as EIP1193Provider

          const addListener: SimpleEventEmitter['on'] =
              openBitProvider.on.bind(openBitProvider)

          openBitProvider.on = (event, func) => {
            addListener(event, func)
          }
          const provider = createEIP1193Provider(openBitProvider)

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

export default OpenBit
