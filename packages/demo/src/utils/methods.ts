
import { RequestArguments } from "../types";
import { keccak256 } from "@ethersproject/keccak256";
import { TypedData, TypedMessage } from "eth-sig-util";

export const METHOD_MAP: Record<string, RequestArguments> = {
  addMoonbeamNetwork: {
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x504',
        rpcUrls: ['https://rpc.api.moonbeam.network'],
        chainName: 'Moonbeam',
        nativeCurrency: { name: 'GLMR', decimals: 18, symbol: 'GLMR' },
        blockExplorerUrls: ['https://moonbeam.moonscan.io/']
      }
    ]
  },
  switchToMoonbeamNetwork: {
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: '0x504'
      }
    ]
  },
  addMoonriverNetwork: {
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x505',
        rpcUrls: ['https://rpc.api.moonriver.moonbeam.network'],
        chainName: 'Moonriver',
        nativeCurrency: { name: 'MOVR', decimals: 18, symbol: 'MOVR' },
        blockExplorerUrls: ['https://moonriver.moonscan.io/']
      }
    ]
  },
  switchToMoonriverNetwork: {
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: '0x505'
      }
    ]
  },
  addMoonbaseAlphaNetwork: {
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x507',
        rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
        chainName: 'MoonbaseAlpha',
        nativeCurrency: { name: 'DEV', decimals: 18, symbol: 'DEV' },
        blockExplorerUrls: ['https://moonbase.moonscan.io/']
      }
    ]
  },
  switchToMoonbaseAlphaNetwork: {
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: '0x507'
      }
    ]
  },
  addAstarNetwork: {
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x250',
        rpcUrls: ['https://astar.public.blastapi.io'],
        chainName: 'Astar',
        nativeCurrency: { name: 'ASTR', decimals: 18, symbol: 'ASTR' },
        blockExplorerUrls: ['https://blockscout.com/astar']
      }
    ]
  },
  switchToAstarNetwork: {
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: '0x250' // 592
      }
    ]
  },
  addShidenNetwork: {
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x150', // 336
        rpcUrls: ['https://shiden.public.blastapi.io'],
        chainName: 'Shiden',
        nativeCurrency: { name: 'SDN', decimals: 18, symbol: 'SDN' },
        blockExplorerUrls: ['https://blockscout.com/astar']
      }
    ]
  },
  switchToShidenNetwork: {
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: '0x150'
      }
    ]
  },
  addShibuyaNetwork: {
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x51',
        rpcUrls: ['https://evm.shibuya.astar.network'],
        chainName: 'Shibuya Testnet',
        nativeCurrency: { name: 'SBY', decimals: 18, symbol: 'SBY' },
        blockExplorerUrls: ['https://blockscout.com/shibuya']
      }
    ]
  },
  switchToShibuyaNetwork: {
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: '0x51' // 81
      }
    ]
  },
  addMumbaiNetwork: {
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x13881',
        rpcUrls: ['https://endpoints.omniatech.io/v1/matic/mumbai/public'],
        chainName: 'Mumbai',
        nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
        blockExplorerUrls: ['https://mumbai.polygonscan.com']
      }
    ]
  },
  switchToMumbaiNetwork: {
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: '0x13881' // 81
      }
    ]
  },
  addBobaTestnet: {
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x120',
        rpcUrls: ['https://endpoints.omniatech.io/v1/matic/mumbai/public'],
        chainName: 'Boba ',
        nativeCurrency: { name: 'BOBA', decimals: 18, symbol: 'BOBA' },
        blockExplorerUrls: ['https://mumbai.polygonscan.com']
      }
    ]
  },
  switchToBobaTestnet: {
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: '0x120' // 81
      }
    ]
  },
  getPermissions: {
    method: 'wallet_getPermissions',
    params: [{ eth_accounts: {} }]
  },
  requestPermissions: {
    method: 'wallet_requestPermissions',
    params: [{ eth_accounts: {} }]
  }
};


export const SIGN_METHODS = {
  ethSign: {
    name: 'ETH Sign',
    method: 'eth_sign',
    getInput: (message: string): string => {
      return keccak256(Buffer.from(message, 'utf8'));
    }
  },
  substrateSign: {
    name: 'Substrate Sign',
    method: 'polkadot_signMessage',
    getInput: (message: string): string => message
  },
  personalSign: {
    name: 'Personal Sync',
    method: 'personal_sign',
    getInput: (message: string): string => {
      return `0x${Buffer.from(message, 'utf8').toString('hex')}`;
    }
  },
  signTypedData: {
    name: 'Sign Typed Data',
    method: 'eth_signTypedData',
    getInput: (message: string): TypedData => {
      return [{
        type: 'string',
        name: 'Message',
        value: message
      }];
    }
  },
  signTypedDatav3: {
    name: 'Sign Typed Data v3',
    method: 'eth_signTypedData_v3',
    getInput: (message: string, chainId: number, from: string): TypedMessage<any> => {
      return {
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' }
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' }
          ],
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person' },
            { name: 'contents', type: 'string' }
          ]
        },
        primaryType: 'Mail',
        domain: {
          name: 'Ether Mail',
          version: '1',
          chainId,
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
        },
        message: {
          from: {
            name: 'John Doe',
            wallet: from
          },
          to: {
            name: 'Alice',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
          },
          contents: message
        }
      };
    }
  },
  signTypedDatav4: {
    name: 'Sign Typed Data v4',
    method: 'eth_signTypedData_v4',
    getInput: (message: string, chainId: number, from: string): TypedMessage<any> => {
      return {
        domain: {
          chainId,
          name: 'Ether Mail',
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
          version: '1'
        },
        message: {
          contents: message,
          from: {
            name: 'Cow',
            wallets: [
              from,
              '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF'
            ]
          },
          to: [
            {
              name: 'Alice',
              wallets: [
                '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
                '0xB0B0b0b0b0b0B000000000000000000000000000'
              ]
            }
          ]
        },
        primaryType: 'Mail',
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' }
          ],
          Group: [
            { name: 'name', type: 'string' },
            { name: 'members', type: 'Person[]' }
          ],
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person[]' },
            { name: 'contents', type: 'string' }
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallets', type: 'address[]' }
          ]
        }
      };
    }
  }
};
