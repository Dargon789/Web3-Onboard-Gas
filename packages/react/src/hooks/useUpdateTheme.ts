import type { Theme } from '@subwallet-connect/core'
import { useWeb3Onboard } from '../context.js'

export const useUpdateTheme = (): ((
  update: Theme
) => void) => useWeb3Onboard().state.actions.updateTheme
