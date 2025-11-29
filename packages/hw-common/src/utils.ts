import type { AppParams, Asset } from './types.js';

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


export const supportedApps: Record<string, AppParams> = {
  [ChainIdByGenesisHash.POLKADOT_ID]: {
    name: 'polkadot',
    path: `m/44'/354'/0'/0`,
    asset: {
      label: 'DOT'
    }
  },
  [ChainIdByGenesisHash.STATEMINT_ID]: {
    name: 'statemint',
    path: `m/44'/354'/0'/0`,
    asset: {
      label: 'DOT'
    }
  },
  [ChainIdByGenesisHash.STAEMINE_ID]: {
    name: 'statemine',
    path: `m/44'/434'/0'/0`,
    asset: {
      label: 'KSM'
    }
  },
  [ChainIdByGenesisHash.KUSAMA_ID]: {
    name: 'kusama',
    asset: {
      label: 'KSM'
    },
    path: `m/44'/434'/0'/0`,
  },
  [ChainIdByGenesisHash.HYDRADX_ID]: {
    name: 'hydraDX',
    asset: {
      label: 'DOT'
    },
    path: `m/44'/354'/0'/0`,
  },
  [ChainIdByGenesisHash.PHALA_ID]: {
    name: 'phala',
    asset: {
      label: 'DOT'
    },
    path: `m/44'/354'/0'/0`,
  },
  [ChainIdByGenesisHash.ASTAR_NETWORK_ID] :{
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
