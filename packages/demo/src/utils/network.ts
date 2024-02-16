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
    wsProvider: "wss://rpc.dotters.network/westend"
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
  'Astar': {
    slug: 'astar',
    name: 'Astar',
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
  }
}
