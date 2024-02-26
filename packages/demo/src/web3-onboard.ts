
import injectedModule from '@subwallet_connect/injected-wallets';
import { init } from '@subwallet_connect/react';
import walletConnectPolkadotModule from '@subwallet_connect/walletconnect-polkadot';
import ledgerPolkadot from "@subwallet_connect/ledgerpolkadot";
import metamaskSDK from '@subwallet_connect/metamask';
import subwalletModule from '@subwallet_connect/subwallet';
import talismanModule from '@subwallet_connect/talisman';
import polkadot_jsModule from '@subwallet_connect/polkadot_js';
import subwalletPolkadotModule from '@subwallet_connect/subwallet-polkadot';
import polkadotVaultModule from '@subwallet_connect/polkadot-vault';
import ledgerModule from '@subwallet_connect/ledger';
import walletConnectModule from '@subwallet_connect/walletconnect';
import {TransactionHandlerReturn} from "@subwallet_connect/core/dist/types";
import { SubWallet } from "../assets";

// Example key • Replace with your infura key
const INFURA_KEY = '302750fdd8644da3b50aa6daa0b89336'


const ledgerPolkadot_ = ledgerPolkadot();


const injected = injectedModule({
  custom: [
    // include custom injected wallet modules here
  ],
  filter: {
    // mapping of wallet labels to filter here
  }
})


const walletConnectPolkadot = walletConnectPolkadotModule({
  projectId: '762e91498a11e0acc664cdd0fd2af181',
  dappUrl: 'https://w3o-demo.subwallet.app/'
})
const metamaskSDKWallet = metamaskSDK({
  options: {
    extensionOnly: false,
    i18nOptions: {
      enabled: true
    },
    infuraAPIKey : INFURA_KEY,
    dappMetadata: {
      name: 'Demo Web3Onboard'
    }
  }
})
const subwalletWallet = subwalletModule();
const polkadotWallet = polkadot_jsModule();
const subwalletPolkadotWalet = subwalletPolkadotModule();
const talismanWallet = talismanModule();
const polkadotVaultWallet = polkadotVaultModule();
const ledger = ledgerModule({ projectId : '762e91498a11e0acc664cdd0fd2af181',   walletConnectVersion: 2 })
const walletConnect = walletConnectModule({
  projectId: '762e91498a11e0acc664cdd0fd2af181',
  dappUrl: 'https://w3o-demo.subwallet.app/'
})

export default init({
  theme: "dark",
  connect : {
    autoConnectLastWallet : true,
    autoConnectAllPreviousWallet : true
  },
  accountCenter: {
    desktop : {
      enabled: false,
    },
    mobile: {
      enabled: false
    }
  },
  projectId : '762e91498a11e0acc664cdd0fd2af181',

  // An array of wallet modules that you would like to be presented to the user to select from when connecting a wallet.
  wallets: [
    subwalletPolkadotWalet,
    subwalletWallet,
    walletConnectPolkadot,
    walletConnect,
    metamaskSDKWallet,
    ledgerPolkadot_,
    ledger,
    talismanWallet,
    polkadotWallet,
    polkadotVaultWallet,
    injected
  ],
  // An array of Chains that your app supports
  chains: [
    {
      id: '0x507',
      rpcUrl: 'https://rpc.api.moonbase.moonbeam.network',
      label: 'Moonbase Alpha',
      token:  'DEV',
      namespace : 'evm'
    },
    {
      // hex encoded string, eg '0x1' for Ethereum Mainnet
      id: '0x1',
      // string indicating chain namespace. Defaults to 'evm' but will allow other chain namespaces in the future
      namespace: 'evm',
      // the native token symbol, eg ETH, BNB, MATIC
      token: 'ETH',
      // used for display, eg Ethereum Mainnet
      label: 'Ethereum Mainnet',
      // used for network requests
      rpcUrl: `https://mainnet.infura.io/v3/${INFURA_KEY}`
    },
    {
      id: '0x504',
      rpcUrl: 'https://rpc.api.moonbeam.network',
      label: 'Moonbeam',
      token: 'GLMR',
      namespace : 'evm'
    },
    {
      id: '0x505',
      rpcUrl: 'https://rpc.api.moonriver.moonbeam.network',
      label: 'Moonriver',
      namespace: 'evm',
      token : 'MOVR'
    },
    {
      id: '0x250',
      rpcUrl: 'https://astar.public.blastapi.io',
      label: 'Astar',
      namespace : 'evm',
      token:  'ASTR',
    },
    {
      id: '0x150', // 336
      rpcUrl: 'https://shiden.public.blastapi.io',
      label: 'Shiden',
      token: 'SDN',
      namespace : 'evm'
    },

  ],


  chainsPolkadot:[
    {
      id: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e' ,
      token: 'WND',
      decimal : 12,
      label: 'Westend',
      rpcUrl: 'westend.subscan.io',
      namespace: 'substrate'
    },
    {
      // hex encoded string, eg '0x1' for Ethereum Mainnet
      id: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
      // string indicating chain namespace. Defaults to 'evm' but will allow other chain namespaces in the future
      namespace: 'substrate',
      // the native token symbol, eg ETH, BNB, MATIC
      token: 'DOT',
      // used for display, eg Polkadot
      label: 'Polkadot',
      // used for get balance
      rpcUrl: `polkadot.api.subscan.io`,
      decimal: 10
    },
    {
      id: '0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f',
      label: 'Polkadot Asset Hub',
      namespace: 'substrate',
      decimal: 10,
      token: 'DOT',
      rpcUrl: 'assethub-polkadot.subscan.io',
    },

    {
      id: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
      label: 'Kusama',
      decimal: 12,
      namespace: 'substrate',
      token: 'KSM',
      rpcUrl: 'kusama.api.subscan.io'
    },

    {
      id: '0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a',
      label: 'Kusama Asset Hub',
      decimal: 12,
      namespace: 'substrate',
      token: 'KSM',
      rpcUrl: 'assethub-kusama.subscan.io'
    }
  ],

  appMetadata: {
    // The name of your dApp
    name: 'SubWallet Connect',

    icon: SubWallet,

    description: 'Demo app for SubWalletConnect V2',
    // The url to a getting started guide for app
    gettingStartedGuide: 'http://mydapp.io/getting-started',
    // url that points to more information about app
    explore: 'http://mydapp.io/about',
    // if your app only supports injected wallets and when no injected wallets detected, recommend the user to install some
    recommendedInjectedWallets: [
      {
        // display name
        name: 'MetaMask',
        // link to download wallet
        url: 'https://metamask.io'
      },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
    ],
    // Optional - but allows for dapps to require users to agree to TOS and privacy policy before connecting a wallet
    agreement: {
      version: '1.0.0',
      termsUrl: 'https://docs.subwallet.app/main/privacy-and-security/terms-of-use',
      privacyUrl: 'https://docs.subwallet.app/main/privacy-and-security/security'
    }
  },
  notify: {
    desktop: {
      enabled: true,
      transactionHandler: (transaction) :TransactionHandlerReturn => {
        console.log({ transaction })
        if (transaction.eventCode === 'txConfirmed') {
          return {
            autoDismiss: 0
          }
        }
        // if (transaction.eventCode === 'txPool') {
        //   return {
        //     type: 'hint',
        //     message: 'Your in the pool, hope you brought a towel!',
        //     autoDismiss: 0,
        //     link: `https://goerli.etherscan.io/tx/${transaction.hash}`
        //   }
        // }
      },
      position: 'topCenter'
    }
  }
})
