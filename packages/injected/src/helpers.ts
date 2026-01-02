import type { Device, ProviderRpcErrorCode } from '@subwallet-connect/common'
import type { InjectedProvider, InjectedWalletModule } from './types.js'
import * as cheerio from 'cheerio'

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

  // Use a DOM parser to detect <script> elements robustly
  try {
    const $ = cheerio.load(svgString, { xmlMode: true })

    // Check for any <script> elements
    if ($('script').length > 0) {
      return true
    }
  } catch {
    // If parsing fails, fall back to regex-based checks below
  }

  // Regular expression to match event handler attributes (e.g., onclick, onload)
  const eventHandlerRegex = /\bon[a-z]+\s*=\s*["']?(?:javascript:)?/gi

  // Regular expression to match href or xlink:href attributes containing "javascript:"
  const hrefJavaScriptRegex = /\b(href|xlink:href)\s*=\s*["']?javascript:/gi

  // Check for event handlers
  if (eventHandlerRegex.test(svgString)) {
    return true
  }

  // Check for "javascript:" in href or xlink:href
  if (hrefJavaScriptRegex.test(svgString)) {
    return true
  }

  // No executable JavaScript found
  return false
}
