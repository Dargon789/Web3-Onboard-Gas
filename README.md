## SubWallet-Connect

**Providing an efficient and easy solution for connecting Polkadot, Substrate, & Ethereum wallets. Drawing insights from [Blocknative](https://github.com/blocknative)'s [web3-onboard](https://onboard.blocknative.com/), we've enhanced our capabilities for seamless integration with Substrate wallets.**

## New Update
**We have developed the ability to further extend the connection of substrate wallets.**
**SDK Substrate Wallets**
- [SubWallet-Polkadot](https://github.com/Koniverse/SubWallet-Connect/wiki/SubWallet%E2%80%90Polkadot)
- [WalletConnect-Polkadot](https://github.com/Koniverse/SubWallet-Connect/wiki/WalletConnect%E2%80%90Polkadot)
- [Talisman](https://github.com/Koniverse/SubWallet-Connect/wiki/Talisman)
- [Polkadot{.js}](https://github.com/Koniverse/SubWallet-Connect/wiki/Polkadot%E2%80%90Js)
- [Polkadot Vault](https://github.com/Koniverse/SubWallet-Connect/wiki/Polkadot-Vault)
- [Ledger Polkadot](https://github.com/Koniverse/SubWallet-Connect/wiki/Ledger%E2%80%90Polkadot)

## Features

- **Minimal Dependencies**: All wallet dependencies are included in separate packages, so you only include the ones you want to use in your app.
- **Multiple Wallets and Accounts Connection**: Allow your users to connect multiple wallets and multiple accounts within each wallet at the same time to your app.
- **Multiple Chain Support**: Allow users to switch between chains/networks with ease.
- **Account Center**: A persistent interface to manage wallet connections and networks, with a minimal version for mobile
- **Notify**: Real-time transaction notifications for the connected wallet addresses for all transaction states
- **Wallet Provider Ethereum Standardization**: All wallet modules expose a provider that is patched to be compliant with the [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193), [EIP-1102](https://eips.ethereum.org/EIPS/eip-1102), [EIP-3085](https://eips.ethereum.org/EIPS/eip-3085) and [EIP-3326](https://ethereum-magicians.org/t/eip-3326-wallet-switchethereumchain/5471) specifications.
- **Wallet Provider Substrate**: For Substrate wallets, we provide 2 connection solutions. This includes injected wallets with available signers, and other connections like hardware wallets, WalletConnect, and Polkadot Vault. Additionally, we offer a provider similar to Ethereum wallets, supporting various methods such as `polkadot_signTransaction`, `polkadot_signMessage`, `polkadot_sendTransaction`, `polkadot_getBalance`, and `polkadot_requestAccounts`
- **Dynamic Imports**: Supporting multiple wallets in your app requires a lot of dependencies. Onboard dynamically imports a wallet and its dependencies only when the user selects it, so that minimal bandwidth is used.

## Quickstart
**Note**: If you're still unsure about following our instructions below, you can run the [demo](https://github.com/Koniverse/SubWallet-Connect/wiki#test-out-the-demo-app) that we have prepared. The result is our [Subwallet-Connect](https://w3o-demo.subwallet.app/).
Install the core Onboard library, the injected wallets module and optionally ethers js and polkadot js to support browser extension and mobile wallets:

**NPM**
`npm i @subwallet-connect/core @subwallet-connect/injected-wallets ethers `

**Yarn**
`yarn add @subwallet-connect/core @subwallet-connect/injected-wallets ethers @polkadot/extension-inject`

Then initialize in your app:

```javascript
import Onboard from '@subwallet-connect/core';
import injectedModule from '@subwallet-connect/injected-wallets';
import subwalletModule from '@subwallet-connect/subwallet';
import subwalletPolkadotModule from '@subwallet-connect/subwallet-polkadot';
import type { EIP1193Provider, SubstrateProvider } from "@subwallet-connect/common";
import { ethers } from 'ethers';
import { ApiPromise, WsProvider } from '@polkadot/api';

const MAINNET_RPC_URL = 'https://mainnet.infura.io/v3/<INFURA_KEY>'
const ws = 'wss://rpc.polkadot.io'

const injected = injectedModule()
const subwalletWallet = subwalletModule()
const subwalletPolkadotWalet = subwalletPolkadotModule()

const onboard = Onboard({
  wallets: [ injected, subwalletWallet, subwalletPolkadotWalet  ],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: MAINNET_RPC_URL
    }
  ],
 chainsPolkadot:[ 
   {
      id: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
      namespace: 'substrate',
      token: 'DOT',
      label: 'Polkadot',
      rpcUrl: `polkadot.api.subscan.io`,
      decimal: 10
   }
})

const wallets = await onboard.connectWallet()

console.log(wallets)

if (wallets[0]?.type === 'evm') {
  // create an ethers provider with the last connected wallet provider
  const ethersProvider = new ethers.providers.Web3Provider(
    wallets[0].provider as EIP1193Provider,
    'any'
  )

  const signer = ethersProvider.getSigner()

  // send a transaction with the ethers provider
  const txn = await signer.sendTransaction({
    to: '0x',
    value: 100000000000000
  })

  const receipt = await txn.wait()
  console.log(receipt)
}else if(wallets[0]?.type === 'substrate') {

  const api = new ApiPromise({
      provider: new WsProvider(ws)
    });
 api.isReady().then(()=> {
     const transferExtrinsic = api.tx.balances.transferKeepAlive(recipientAddress, amount);

     transferExtrinsic.signAndSend(senderAddress, { wallet.signer }, ({ status, txHash }) => {
          if (status.isInBlock) {
            console.log(txHash.toString());
            console.log(`Completed at block hash #${status.asInBlock.toString()}`);
          } else {
            console.log(`Current status: ${status.type}`);
          }
     })
 })
}
```

**SubWallet Connect migration guide**

If you're coming from v1, we've created a [migration guide for you](https://onboard.blocknative.com/docs/overview/onboard.js-migration-guide#background).

## Documentation

For full documentation, check out the README.md for each package or the [docs page here](https://onboard.blocknative.com/docs/overview/introduction#features) from ethereum wallet:

**Core Repo**

- [Core](https://github.com/Koniverse/SubWallet-Connect/wiki/Core)

**Injected Wallets**

- [Injected](https://github.com/Koniverse/SubWallet-Connect/wiki/Injected)

**SDK Wallets**
- [SubWallet](https://github.com/Koniverse/SubWallet-Connect/wiki/SubWallet)
- [SubWallet-Polkadot](https://github.com/Koniverse/SubWallet-Connect/wiki/SubWallet%E2%80%90Polkadot)
- [WalletConnect-Polkadot](https://github.com/Koniverse/SubWallet-Connect/wiki/WalletConnect%E2%80%90Polkadot)
- [Talisman](https://github.com/Koniverse/SubWallet-Connect/wiki/Talisman)
- [Polkadot{.js}](https://github.com/Koniverse/SubWallet-Connect/wiki/Polkadot%E2%80%90Js)
- [Arcana](https://github.com/Koniverse/SubWallet-Connect/wiki/Arcana)
- [Coinbase](https://github.com/Koniverse/SubWallet-Connect/wiki/Coinbase)
- [Trust](https://github.com/Koniverse/SubWallet-Connect/wiki/Trust)
- [WalletConnect](https://github.com/Koniverse/SubWallet-Connect/wiki/WalletConnect)
- [Magic](https://github.com/Koniverse/SubWallet-Connect/wiki/Magic)
- [Fortmatic](https://github.com/Koniverse/SubWallet-Connect/wiki/Fortmatic)
- [Portis](https://github.com/Koniverse/SubWallet-Connect/wiki/Portis)
- [MEW-Wallet](https://github.com/Koniverse/SubWallet-Connect/wiki/Mew)
- [Web3Auth](https://github.com/Koniverse/SubWallet-Connect/wiki/Web3Auth)
- [Taho (previously Tally Ho)](https://github.com/Koniverse/SubWallet-Connect/wiki/Taho)
- [Enkrypt](https://github.com/Koniverse/SubWallet-Connect/wiki/Enkrypt)
- [Frontier](https://github.com/Koniverse/SubWallet-Connect/wiki/Frontier)
- [Infinity Wallet](https://github.com/Koniverse/SubWallet-Connect/wiki/Infinity-Wallet)
- [Frame](https://github.com/Koniverse/SubWallet-Connect/wiki/Frame)
- [Blocto](https://github.com/Koniverse/SubWallet-Connect/wiki/Blockto)

**Hardware Wallets**
- [Polkadot Vault](https://github.com/Koniverse/SubWallet-Connect/wiki/Polkadot-Vault)
- [Ledger Polkadot](https://github.com/Koniverse/SubWallet-Connect/wiki/Ledger%E2%80%90Polkadot) 
- [Ledger](https://github.com/Koniverse/SubWallet-Connect/wiki/Ledger)
- [Trezor](https://github.com/Koniverse/SubWallet-Connect/wiki/Trezor)
- [Keystone](https://github.com/Koniverse/SubWallet-Connect/wiki/Keystone)
- [KeepKey](https://github.com/Koniverse/SubWallet-Connect/wiki/KeepKey)
- [D'CENT](https://github.com/Koniverse/SubWallet-Connect/wiki/D'CENT)

**Frameworks**

- [React](https://github.com/Koniverse/SubWallet-Connect/wiki/React)


## Test out the demo app

If you would like to test out the current functionality of Subwallet Connect in a small browser demo, then:

- Clone the repo: `git clone git@github.com:Koniverse/Subwallet-Connect.git`
- Checkout the SubWallet Connect feature branch: `git checkout sw-dev`
- Install the dependencies: `yarn install` (if running a M1 mac - `yarn install-m1-mac`)
- Run build all packages in dev mode: `yarn build`
- Direct to package\demo: `cd .\packages\demo\`
- Running start to view demo : `yarn start`
- To view the demo app in the browser after running the above steps navigate to [http://localhost:8080](http://localhost:8080)

***
