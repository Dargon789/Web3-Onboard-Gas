import bowser from 'bowser'
import axios from 'axios';
import type {
  Device,
  DeviceBrowser,
  DeviceOS,
  DeviceType,
  ChainId,
  Chain,
  WalletInit,
  WalletModule,
  ChainWithDecimalId
} from '@subwallet_connect/common'

import {
  hourglass,
  gnosisIcon,
  successIcon,
  errorIcon,
  infoIcon,
  ethereumIcon,
  polygonIcon,
  binanceIcon,
  questionIcon,
  fantomIcon,
  optimismIcon,
  celoIcon,
  avalancheIcon,
  harmonyOneIcon,
  arbitrumIcon,
  baseIcon,
  polkadotIcon,
  crutsIcon,
  acalaIcon,
  astarNetworkIcon,
  hydraxIcon,
  kusamaIcon,
  phalaNetworkIcon,
  statemintIcon,
  turingNetworkIcon,
  westendIcon, statemineIcon, rococoIcon
} from './icons/index.js'

import type {
  ChainStyle,
  ConnectedChain,
  DeviceNotBrowser,
  NotifyEventStyles, PlatformType, WalletStateDeviceInterface
} from './types.js'
import type { WalletState } from  './types.js';


export function getDevice(): Device | DeviceNotBrowser {
  if (typeof window !== 'undefined') {
    const parsed = bowser.getParser(window.navigator.userAgent)
    const os = parsed.getOS()
    const browser = parsed.getBrowser()
    const { type } = parsed.getPlatform()

    return {
      type: type as DeviceType,
      os: os as DeviceOS,
      browser: browser as DeviceBrowser
    }
  } else {
    return {
      type: null,
      os: null,
      browser: null
    }
  }
}

export const notNullish = <T>(value: T | null | undefined): value is T =>
  value != null

export function validEnsChain(chainId: ChainId): ChainId | null {
  // return L2s as Eth for ens resolution
  switch (chainId) {
    case '0x1':
    case '0x89': // Polygon
    case '0xa': //Optimism
    case '0xa4b1': // Arb One
    case '0xa4ba': // Arb Nova
    case '0x144': // zksync
      return '0x1'
    case '0x5': // Goerli
      return chainId
    case '0xaa36a7': // Sepolia
      return chainId
    default:
      return null
  }
}

export function isSVG(str: string): boolean {
  return str.includes('<svg')
}

export function shortenAddress(add: string): string {
  return `${add.slice(0, 6)}…${add.slice(-4)}`
}

export function shortenDomain(domain: string): string {
  return domain.length > 11
    ? `${domain.slice(0, 4)}…${domain.slice(-6)}`
    : domain
}

export async function copyWalletAddress(text: string): Promise<void> {
  try {
    const copy = await navigator.clipboard.writeText(text)
    return copy
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

export const toHexString = (val: number | string): string =>
  typeof val === 'number' ? `0x${val.toString(16)}` : val

export function chainIdToHex(chains: (Chain | ChainWithDecimalId)[]): Chain[] {
  return chains.map(({ id, ...rest }) => {
    const hexId = toHexString(id)
    return { id: hexId, ...rest }
  })
}

export function gweiToWeiHex(gwei: number): string {
  return `0x${(gwei * 1e9).toString(16)}`
}

export enum ChainIdByGenesisHash  {
  POLKADOT_ID = '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
  KUSAMA_ID = '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
  WESTEND_ID = '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
  ROCOCO_ID = '0x6408de7737c59c238890533af25896a2c20608d8b380bb01029acb392781063e',
  ASTAR_NETWORK_ID = '0x9eb76c5184c4ab8679d2d5d819fdf90b9c001403e9e17da2e14b6d8aec4029c6',
  CRUST_MAINET_ID = '0x8b404e7ed8789d813982b9cb4c8b664c05b3fbf433309f603af014ec9ce56a8c',
  HYDRADX_ID = '0xafdc188f45c71dacbaa0b62e16a91f726c7b8699a9748cdf715459de6b7f366d',
  PHALA_ID = '0x1bb969d85965e4bb5a651abbedf21a54b6b31a21f66b5401cc3f1e286268d736',
  STATEMINT_ID = '0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f',
  STAEMINE_ID = '0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a',
  TURING_ID = '0xd54f0988402deb4548538626ce37e4a318441ea0529ca369400ebec4e04dfe4b'
}

export const chainIdToLabel: Record<string, string> = {
  '0x1': 'Ethereum',
  '0x3': 'Ropsten',
  '0x4': 'Rinkeby',
  '0x5': 'Goerli',
  '0xaa36a7': 'Sepolia',
  '0x2a': 'Kovan',
  '0x38': 'Binance',
  '0x89': 'Polygon',
  '0xfa': 'Fantom',
  '0xa': 'Optimism',
  '0x45': 'Optimism Kovan',
  '0xa86a': 'Avalanche',
  '0xa4ec': 'Celo',
  '0x2105': 'Base',
  '0x14a33': 'Base Goerli',
  '0x64': 'Gnosis',
  '0x63564C40': 'Harmony One',
  '0xa4b1': 'Arbitrum One',
  '0xa4ba': 'Arbitrum Nova',
  'acala' : 'Acala',
  '0x507': 'Moonbase Alpha',
  '0x504': 'Moonbeam',
  '0x505': 'Moonriver',
  '0x250': 'Astar',
  '0x150': 'Shiden',
  [ChainIdByGenesisHash.POLKADOT_ID] : 'Polkadot',
  [ChainIdByGenesisHash.ASTAR_NETWORK_ID] : 'Astar Network',
  [ChainIdByGenesisHash.CRUST_MAINET_ID] : 'Crust',
  [ChainIdByGenesisHash.HYDRADX_ID] : 'Hydradx',
  [ChainIdByGenesisHash.KUSAMA_ID] : 'Kusama',
  [ChainIdByGenesisHash.PHALA_ID] : 'Phala Network',
  [ChainIdByGenesisHash.STATEMINT_ID] : 'Statemint',
  [ChainIdByGenesisHash.TURING_ID] : 'Turing Network',
  [ChainIdByGenesisHash.WESTEND_ID] : 'Westend',
  [ChainIdByGenesisHash.ROCOCO_ID]: 'Rococo',
  [ChainIdByGenesisHash.STAEMINE_ID]: 'Statemine'
}

export const networkToChainId: Record<string, ChainId> = {
  main: '0x1',
  ropsten: '0x3',
  rinkeby: '0x4',
  goerli: '0x5',
  kovan: '0x2a',
  xdai: '0x64',
  'bsc-main': '0x38',
  'matic-main': '0x89',
  'fantom-main': '0xfa',
  'matic-mumbai': '0x80001',
  'sepolia': '0xaa36a7',
  'Fantom': '0xfa',
  'optimism': '0xa',
  'optimism kovan': '0x45',
  'avalanche': '0xa86a',
  'celo': '0xa4ec',
  'base': '0x2105',
  'base goerli': '0x14a33',
  'harmony one': '0x63564C40',
  'arbitrum one': '0xa4b1',
  'arbitrum nova': '0xa4ba',
  'acala' : 'Acala',
  'moonbase-alpha': '0x507',
  'moonbeam': '0x504',
  'moonriver': '0x505',
  'astar-network': '0x250',
  'shiden': '0x150',
  'polkadot': ChainIdByGenesisHash.POLKADOT_ID,
  'kusama': ChainIdByGenesisHash.KUSAMA_ID,
  'astar': ChainIdByGenesisHash.ASTAR_NETWORK_ID,
  'crust': ChainIdByGenesisHash.CRUST_MAINET_ID,
  'hydradx': ChainIdByGenesisHash.HYDRADX_ID,
  'phala': ChainIdByGenesisHash.PHALA_ID,
  'stateminte': ChainIdByGenesisHash.STATEMINT_ID,
  'turing' : ChainIdByGenesisHash.TURING_ID,
  'westend': ChainIdByGenesisHash.WESTEND_ID,
  'rococo': ChainIdByGenesisHash.ROCOCO_ID,
  'statemine': ChainIdByGenesisHash.STAEMINE_ID
}

export const chainStyles: Record<string, ChainStyle> = {
  '0x1': {
    icon: ethereumIcon,
    color: '#627EEA'
  },
  '0x3': {
    icon: ethereumIcon,
    color: '#627EEA'
  },
  '0x4': {
    icon: ethereumIcon,
    color: '#627EEA'
  },
  '0x5': {
    icon: ethereumIcon,
    color: '#627EEA'
  },
  '0x2a': {
    icon: ethereumIcon,
    color: '#627EEA'
  },
  '0xaa36a7': {
    icon: ethereumIcon,
    color: '#627EEA'
  },
  '0x38': {
    icon: binanceIcon,
    color: '#F3BA2F'
  },
  '0x89': {
    icon: polygonIcon,
    color: '#8247E5'
  },
  '0xfa': {
    icon: fantomIcon,
    color: '#1969FF'
  },
  '0xa': {
    icon: optimismIcon,
    color: '#FF0420'
  },
  '0x45': {
    icon: optimismIcon,
    color: '#FF0420'
  },
  '0xa86a': {
    icon: avalancheIcon,
    color: '#E84142'
  },
  '0xa4ec': {
    icon: celoIcon,
    color: '#FBCC5C'
  },
  '0x64': {
    icon: gnosisIcon,
    color: '#04795B'
  },
  '0x63564C40': {
    icon: harmonyOneIcon,
    color: '#ffffff'
  },
  '0xa4b1': {
    icon: arbitrumIcon,
    color: '#33394B'
  },
  '0xa4ba': {
    icon: arbitrumIcon,
    color: '#33394B'
  },
  '0x2105': {
    icon: baseIcon,
    color: '#0259F9'
  },
  '0x14a33': {
    icon: baseIcon,
    color: '#0259F9'
  },
  '0x80001': {
    icon: polygonIcon,
    color: '#8247E5'
  },
  [ChainIdByGenesisHash.POLKADOT_ID] : {
    icon : polkadotIcon,
    color : '#ffffff'
  },
  'acala' : {
    icon : acalaIcon,
    color : '#ffffff'
  },
  [ChainIdByGenesisHash.ASTAR_NETWORK_ID] : {
    icon : astarNetworkIcon,
    color : '#ffffff'
  },
  [ChainIdByGenesisHash.CRUST_MAINET_ID] : {
    icon: crutsIcon,
    color: '#000000'
  },
  [ChainIdByGenesisHash.HYDRADX_ID] : {
    icon : hydraxIcon,
    color : '#f453a1'
  },
  [ChainIdByGenesisHash.KUSAMA_ID] : {
    icon : kusamaIcon,
    color: '#000000'
  },
  [ChainIdByGenesisHash.PHALA_ID]: {
    icon : phalaNetworkIcon,
    color: '#000000'
  },
  [ChainIdByGenesisHash.STATEMINT_ID] : {
    icon : statemintIcon,
    color : '#E6007A'
  },
  [ChainIdByGenesisHash.TURING_ID] : {
    icon : turingNetworkIcon,
    color: '#ffffff'
  },
  [ChainIdByGenesisHash.WESTEND_ID] : {
    icon : westendIcon,
    color: '#ffffff'
  },
  [ChainIdByGenesisHash.STATEMINT_ID] : {
    icon: statemineIcon,
    color: '#000000'
  },
  [ChainIdByGenesisHash.ROCOCO_ID]: {
    icon: rococoIcon,
    color: '#ffffff'
  }



}

export const unrecognizedChainStyle = { icon: questionIcon, color: '#33394B' }

export function getDefaultChainStyles(chainId: string): ChainStyle | undefined {
  return chainId ? chainStyles[chainId.toLowerCase()] : undefined
}

export function connectedToValidAppChain(
  walletConnectedChain: ConnectedChain,
  chains: Chain[]
): boolean {
  return !!chains.find(
    ({ id, namespace }) =>
      id === walletConnectedChain.id &&
      namespace === walletConnectedChain.namespace
  )
}

export function initializeWalletModules(
  modules: WalletInit[],
  device: Device
): WalletModule[] {
  return modules.reduce((acc, walletInit) => {
    const initialized = walletInit({ device })

    if (initialized) {
      // injected wallets is an array of wallets
      acc.push(...(Array.isArray(initialized) ? initialized : [initialized]))
    }

    return acc
  }, [] as WalletModule[])
}

export const defaultNotifyEventStyles: Record<string, NotifyEventStyles> = {
  pending: {
    backgroundColor: '#FDB1B11A',
    borderColor: 'var(--warning-800)',
    eventIcon: hourglass
  },
  success: {
    backgroundColor: '#FDB1B11A',
    borderColor: 'var(--onboard-success-500, var(--success-500))',
    eventIcon: successIcon
  },
  error: {
    backgroundColor: '#FDB1B11A',
    borderColor: 'var(--onboard-danger-600, var(--danger-600))',
    eventIcon: errorIcon
  },
  hint: {
    backgroundColor: '#FDB1B11A',
    borderColor: 'var(--onboard-gray-500, var(--gray-500))',
    iconColor: 'var(--onboard-gray-100, var(--gray-100))',
    eventIcon: infoIcon
  }
}

export const wait = (time: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, time))

export function getLocalStore(key: string): string | null {
  try {
    const result = localStorage.getItem(key)
    return result
  } catch (error) {
    return null
  }
}

export function setLocalStore(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    return
  }
}

export function delLocalStore(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    return
  }
}

export const baseURL = 'https://*/api/scan/account/tokens';

export type dataTypeFetch  = {
  address : string
}
export interface  clientAxiosProps {
  url : string,
  data: dataTypeFetch
};


export async function getBalanceSubstrate({ url, data } : clientAxiosProps){
  if(url === '') return
  const urlResult = baseURL.replace('*', url);
  return await axios.post(urlResult, data)
    .then( data_ => {
      return data_.data.data ? data_.data.data.native[0].balance : '0';
    })

}


 const TypeWalletEvmPlatformByLabel  : Record<WalletState['label'], WalletStateDeviceInterface> = {
  'SubWallet': {
    platform: ['Extension'],
    namespace: 'SubWallet'
  },
  'Arcana Auth' : {
    platform: ['Extension', 'WebApp']
  },
  'Bitget Wallet': {
    platform: ['Extension']
  },
  'BitKeep': {
    platform: ['Extension'],
    namespace: 'isBitKeep'
  },
  'Blockto': {
    platform: ['WebApp', 'Mobile']
  },
  'Capsule': {
    platform: ['Extension']
  },
  'cede.store': {
    platform: ['Extension'],
    namespace: 'cede'
  },
  'Coinbase Wallet': {
    platform: ['Extension', 'WebApp'],
    namespace: 'coinbaseWalletExtension'
  },
  'D\'CENT': {
    platform: ['Cold Wallet'],
    namespace: 'ethereum'
  },
  'Enkrypt': {
    platform: ['Extension'],
    namespace: 'enkrypt'
  },
  'Fortmatic': {
    platform: ['WebApp']
  },
  'Frame': {
    platform: ['Extension'],
    namespace: 'isFrame'
  },
  'Frontier': {
    platform: ['Extension'],
    namespace: 'frontier'
  },
  'Safe': {
    platform: ['WebApp']
  },
  'Infinity Wallet': {
    platform: ['Extension'],
    namespace: 'infinityWallet'
  },
  'KeepKey': {
    platform: ['Cold Wallet']
  },
  'Keystone': {
    platform: ['Cold Wallet']
  },
  'Ledger': {
    platform: ['QRcode']
  },
  'MetaMask': {
    platform: ['QRcode','Extension']
  },
  'MEW Wallet': {
    platform: ['Extension'],
    namespace: 'isMEWwallet'
  },
  'Phantom': {
    platform: ['Extension'],
    namespace: 'phantom'
  },
  'Portis': {
    platform: ['WebApp']
  },
  'Sequence': {
    platform: ['Extension'],
    namespace: 'isSequence'
  },
  'Taho': {
    platform: ['Extension'],
    namespace: 'tally'
  },
   'Coinbase': {
    platform: ['QRcode']
   },
  'Torus': {
    platform: ['WebApp']
  },
  'Trezor': {
    platform: ['Cold Wallet']
  },
  'Trust Wallet': {
    platform: ['Extension'],
    namespace: 'trustwallet'
  },
  'Unstoppable': {
    platform: ['Mobile']
  },
  'Venly': {
    platform: ['Extension']
  },
  'WalletConnect': {
    platform: ['QRcode', 'Extension']
  },
  'Web3Auth': {
    platform: ['WebApp']
  },
  'XDEFI Wallet': {
    platform: ['Extension'],
    namespace: 'xfi'
  },
  'Zeal': {
    platform: ['Extension'],
    namespace: 'zeal'
  }
}

const TypeWalletSubstratePlatformByLabel : Record<WalletState['label'], WalletStateDeviceInterface> = {
  'WalletConnect': {
    platform: ['QRcode', 'Extension']
  },
  'Ledger': {
    platform: ['Cold Wallet']
  },
  'SubWallet': {
    platform: ['Extension'],
    namespace: 'subwallet-js'
  },
  'Polkadot{.js}': {
    platform: ['Extension'],
    namespace: 'polkadot-js'
  },
  'Talisman': {
    platform: ['Extension'],
    namespace: 'talisman'
  },
  'Polkadot Vault': {
    platform: ['QRcode']
  }
}


export const WalletPlatformByLabel : Record<WalletState['label'], Record<WalletState['label'], WalletStateDeviceInterface>> = {
  'evm' : TypeWalletEvmPlatformByLabel,
  'substrate' : TypeWalletSubstratePlatformByLabel
}
