import type { Device, ProviderRpcErrorCode } from '@subwallet-connect/common'
import type { InjectedProvider, InjectedWalletModule } from './types.js'
import DOMPurify from 'dompurify'

export class ProviderRpcError extends Error {
  message: string
  code: ProviderRpcErrorCode | number
  data?: unknown

  constructor(error: Pick<ProviderRpcError, 'message' | 'code' | 'data'>) {
    super(error.message)
    this.message = error.message
    this.code = error.code
    this.data = error.data
  }
}

export const defaultWalletUnavailableMsg =
    ({
       label,
       externalUrl
     }: InjectedWalletModule) =>
        externalUrl
            ? `Please <a href="${externalUrl}" target="_blank">install</a> or enable ${label} to continue`
            : `Please install or enable ${label} to continue`

export const isWalletAvailable = (
    provider: InjectedProvider,
    checkProviderIdentity: InjectedWalletModule['checkProviderIdentity'],
    device: Device
): boolean => {
  // No injected providers exist.
  if (!provider) {
    return false
  }

  // Many injected providers add their own object into window.
  if (checkProviderIdentity({ provider, device })) {
    return true
  }

  // For multiple injected providers, check providers array
  // example coinbase inj wallet pushes over-ridden wallets
  // into a providers array at window.ethereum
  return !!provider.providers?.some(provider =>
      checkProviderIdentity({ provider, device })
  )
}

export 
function containsExecutableJavaScript(svgString: string): boolean {
  if (!svgString) return false

  // Use DOMPurify to detect whether any executable JavaScript or
  // other dangerous content would be removed during sanitization.
  // If DOMPurify removes anything, we treat the SVG as containing
  // executable or otherwise unsafe content.
  // Configure DOMPurify for SVG content.
  DOMPurify.removed = []
  DOMPurify.sanitize(svgString, { USE_PROFILES: { svg: true } })

  return Array.isArray(DOMPurify.removed) && DOMPurify.removed.length > 0
}
