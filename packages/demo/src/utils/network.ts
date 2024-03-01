import {NetworkItemType} from "../types";


export const NetworkInfo : Record<string, NetworkItemType> = {
  'Polkadot': {
    slug: 'polkadot',
    name: 'Polkadot',
    namespace: 'substrate',
    wsProvider: "wss://rpc.polkadot.io"
  },
  'HydraDX': {
    slug: 'hydradx_main',
    name: 'HydraDX',
    namespace: 'substrate',
    wsProvider: "wss://rpc.hydradx.cloud"
  },
  'Astar Network': {
    slug: 'astar',
    name: 'Astar Network',
    namespace: 'substrate',
    wsProvider: "wss://rpc.astar.network"
  },
  'Westend': {
    slug: 'westend',
    name: 'Westend',
    namespace: 'substrate',
    wsProvider: "wss://westend-rpc.polkadot.io"
  },
  'Ethereum Mainnet': {
    slug: 'ethereum',
    name: 'Ethereum Mainnet',
    namespace: 'evm'
  },
  'Moonbeam': {
    slug: 'moonbeam',
    name: 'Moonbeam',
    namespace: 'evm'
  },
  'Moonriver': {
    slug: 'moonriver',
    name: 'Moonriver',
    namespace: 'evm'
  },
  "Moonbase Alpha": {
    slug: "moonbase",
    name: "Moonbase Alpha",
    namespace: 'evm'
  },
  'Astar - EVM': {
    slug: 'astarEvm',
    name: 'Astar - EVM',
    namespace: 'evm'
  },
  'Shiden': {
    slug: 'shiden',
    name: 'Shiden',
    namespace: 'evm'
  },
  'Mumbai': {
    slug: 'polygon',
    name: 'Polygon',
    namespace: 'evm'
  },
  'Polkadot Asset Hub': {
    slug: 'statemint',
    namespace: 'substrate',
    name: 'Polkadot Asset Hub',
    wsProvider: 'wss://statemint-rpc.dwellir.com'
  },
  'Kusama Asset Hub': {
    slug: 'statemine',
    namespace: 'substrate',
    name: 'Kusama Asset Hub',
    wsProvider: 'wss://statemine-rpc.dwellir.com'
  },
  'Rococo': {
    slug: 'rococo',
    namespace: 'substrate',
    name: 'Rococo',
    wsProvider: 'wss://pangolin-rpc.darwinia.network'
  },
  'Kusama': {
    slug: 'kusama',
    namespace: 'substrate',
    name: 'Kusama',
    wsProvider: 'wss://1rpc.io/ksm'
  }
}
