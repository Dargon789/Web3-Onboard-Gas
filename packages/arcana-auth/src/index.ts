import { WalletInit, createEIP1193Provider } from '@subwallet_connect/common';
import icon from './icon.js'
import type { ConstructorParams } from '@arcana/auth/types'

export default function (opts: {
  clientID: string
  params?: ConstructorParams
}): WalletInit {
  return () => ({
    label: 'Arcana Auth',
    type : 'evm',
    async getIcon() {
      return icon
    },
    async getInterface() {
      const { AuthProvider } = await import('@arcana/auth')

      const instance = new AuthProvider(opts.clientID, opts.params)
      await instance.init()
      return new Promise((resolve, reject) => {
        // @ts-ignore
        instance.provider.once('connect', () => {
          resolve({
            provider: createEIP1193Provider(instance.provider),
            instance
          })
        })
        instance.connect().catch(reject)
      })
    }
  })
}
