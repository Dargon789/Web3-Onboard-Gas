
import injectedModule from '@subwallet_connect/injected-wallets'
import { init } from '@subwallet_connect/react'
import walletConnectModule from '@subwallet_connect/walletconnect'
import walletConnectPolkadotModule from '@subwallet_connect/walletconnect-polkadot'
import coinBaseModule from "@subwallet_connect/coinbase"
import cedeStoreWalletModule from '@subwallet_connect/cede-store'
import keepkeyModule from '@subwallet_connect/keepkey'
import ledgerModule from '@subwallet_connect/ledger'
import ledgerPolkadot from "@subwallet_connect/ledgerpolkadot";
import blocktoModule from  "@subwallet_connect/blocto"
import phantomModule from '@subwallet_connect/phantom'
import tallyHoModule from '@subwallet_connect/tallyho'
import metamaskSDK from '@subwallet_connect/metamask'
import infinityWalletModule from '@subwallet_connect/infinity-wallet'
import trustModule from '@subwallet_connect/trust'
import sequenceModule from '@subwallet_connect/sequence'
import {TransactionHandlerReturn} from "@subwallet_connect/core/dist/types";


// Example key • Replace with your infura key
const INFURA_KEY = '302750fdd8644da3b50aa6daa0b89336'

const cedeStore = cedeStoreWalletModule();
const ledger = ledgerModule({ projectId : '16c6ad72b95e09bfdddfde13bf7f90b4',   walletConnectVersion: 2 })
const keepkey = keepkeyModule()
const ledgerPolkadot_ = ledgerPolkadot();
const coinBase = coinBaseModule()
const blocto = blocktoModule()
const injected = injectedModule({
  custom: [
    // include custom injected wallet modules here
  ],
  filter: {
    // mapping of wallet labels to filter here
  }
})
const phantom = phantomModule()
const walletConnect = walletConnectModule({
  projectId: 'd4a987cb0d1a746dbffd38890458e65c',
  dappUrl: 'https://www.onboard.blocknative.com'
})

const walletConnectPolkadot = walletConnectPolkadotModule({
  projectId: 'd4a987cb0d1a746dbffd38890458e65c',
  dappUrl: 'https://www.onboard.blocknative.com'
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
const trust = trustModule()
const tallyho = tallyHoModule()
const infinityWallet = infinityWalletModule()
const sequence = sequenceModule({
  appName: 'My app'
})



export default init({
  theme: "dark",
  connect : {
    autoConnectLastWallet : true,
    autoConnectAllPreviousWallet : true
  },
  projectId : 'd4a987cb0d1a746dbffd38890458e65c',


  chainsPolkadot:[
    {
      // hex encoded string, eg '0x1' for Ethereum Mainnet
      id: '91b171bb158e2d3848fa23a9f1c25182',
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
      id: 'afdc188f45c71dacbaa0b62e16a91f72' ,
      token: 'HDX',
      namespace: 'substrate',
      label: 'Hydradx',
      rpcUrl: 'hydradx.api.subscan.io',
      decimal : 12
    },
    {
      id: '9eb76c5184c4ab8679d2d5d819fdf90b',
      token: 'ASTR',
      label: 'Astar Network',
      decimal: 18,
      namespace: 'substrate',
      rpcUrl: 'astar.api.subscan.io'
    }

  ],

  // An array of wallet modules that you would like to be presented to the user to select from when connecting a wallet.
  wallets: [
    metamaskSDKWallet,
    trust,
    infinityWallet,
    tallyho,
    injected,
    walletConnect,
    walletConnectPolkadot,
    cedeStore,
    ledger,
    keepkey,
    sequence,
    ledgerPolkadot_,
    blocto,
    coinBase,
    phantom
  ],
  // An array of Chains that your app supports
  chains: [
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
      id: 42161,
      token: 'ARB-ETH',
      label: 'Arbitrum One',
      rpcUrl: 'https://rpc.ankr.com/arbitrum'
    },
    {
      id: '0xa4ba',
      token: 'ARB',
      label: 'Arbitrum Nova',
      rpcUrl: 'https://nova.arbitrum.io/rpc'
    }

  ],
  appMetadata: {
    // The name of your dApp
    name: 'SubWallet Connect',

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
      termsUrl: 'https://www.blocknative.com/terms-conditions',
      privacyUrl: 'https://www.blocknative.com/privacy-policy'
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
      position: 'topLeft'
    }
  }
})
