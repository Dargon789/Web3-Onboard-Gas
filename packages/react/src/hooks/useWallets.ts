import type { WalletState } from '@subwallet_connect/core'

import { useAppState } from './useAppState.js'

export const useWallets = (): WalletState[] => useAppState('wallets')
