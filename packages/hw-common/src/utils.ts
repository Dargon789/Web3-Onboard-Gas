import type { AppParams, Asset } from './types.js';


export const supportedApps: Record<string, AppParams> = {
  ['91b171bb158e2d3848fa23a9f1c25182']: {
    name: 'polkadot',
    path: `m/44'/354'/0'/0`,
    asset: {
      label: 'DOT'
    }
  },
  ['68d56f15f85d3136970ec16946040bc1']: {
    name: 'statemint',
    path: `m/44'/354'/0'/0`,
    asset: {
      label: 'DOT'
    }
  },
  ['48239ef607d7928874027a43a6768920']: {
    name: 'statemine',
    path: `m/44'/434'/0'/0`,
    asset: {
      label: 'KSM'
    }
  },
  ['b0a8d493285c2df73290dfb7e61f870f']: {
    name: 'kusama',
    asset: {
      label: 'KSM'
    },
    path: `m/44'/434'/0'/0`,
  },
  ['afdc188f45c71dacbaa0b62e16a91f72']: {
    name: 'hydraDX',
    asset: {
      label: 'DOT'
    },
    path: `m/44'/354'/0'/0`,
  },
  ['1bb969d85965e4bb5a651abbedf21a54']: {
    name: 'phala',
    asset: {
      label: 'DOT'
    },
    path: `m/44'/354'/0'/0`,
  },
  ['9eb76c5184c4ab8679d2d5d819fdf90b'] :{
    name: 'astar',
    asset: {
      label: 'ASTR'
    },
    path: `m/44'/810'/0'/0`,
  },
  ['0x1']: {
    name: 'Ethereum Mainnet',
    asset: {
      label: 'ETH'
    },
    path: `m/44'/60'/0'/0`
  }
};
