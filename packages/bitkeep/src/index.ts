import type { WalletInit, EIP1193Provider } from '@subwallet-connect/common'

let bitKeepDependencies: any = null
let bitKeepAdapter: any = null

const loadBitKeepDependencies = async (getAdapter?: boolean) => {
  if (!bitKeepDependencies) {
    bitKeepDependencies = await import('@bitget-wallet/web3-sdk')
  }
  if (getAdapter && !bitKeepAdapter) {
    bitKeepAdapter = new bitKeepDependencies.LegacyEip1193Adapter()
    return bitKeepAdapter
  }
  if (getAdapter) {
    return bitKeepAdapter
  }
  return bitKeepDependencies
}

function bitKeep(): WalletInit {
  if (typeof window === 'undefined') return () => null

  return () => {
    return {
      label: 'BitKeep',
      type : 'evm',
      getIcon: async () => {
        const { WalletInfo } = await loadBitKeepDependencies();
        return WalletInfo.logolist.svg[256];
      },
      getInterface: async () => {
        const {
          currentProvider,
          getIsInstall,
          installWalletMessage
        } = await loadBitKeepDependencies()

        let provider: EIP1193Provider
        if (getIsInstall()) {
          provider = currentProvider()
        } else {
          throw new Error(installWalletMessage)
        }
        return { provider }
      }
    }
  }
}

export default bitKeep
