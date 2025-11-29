import { useState, useCallback } from 'react'

import type { ConnectedChain } from '@subwallet-connect/core'
import type { Chain } from '@subwallet-connect/common'
import { useAppState } from './useAppState.js'
import { useWeb3Onboard } from '../context.js'

type SetChainOptions = {
  chainId: string
  chainNamespace?: string
}

export const useSetChain = (
  walletLabel?: string,
  walletType ?: 'evm' | 'substrate'
): [
  {
    chains: Chain[]
    connectedChain: ConnectedChain | null
    settingChain: boolean
  },
  (options: SetChainOptions) => Promise<boolean>
] => {
  const web3Onboard = useWeb3Onboard()

  const { setChain } = web3Onboard

  const { wallets, chains } = useAppState()

  const getChain = () => {
    const wallet = walletLabel
      ? wallets.find(({ label, type }) => label === walletLabel && walletType === type)
      : wallets[0]
    return wallet && wallet.chains ? wallet.chains[0] : null
  }

  const connectedChain = getChain()

  const [settingChain, setInProgress] = useState<boolean>(false)

  const set = useCallback(async (options: SetChainOptions) => {
    setInProgress(true)

    const success = await setChain({ ...options, wallet: walletLabel })

    setInProgress(false)

    return success
  }, [])

  return [{ chains, connectedChain, settingChain }, set]
}
