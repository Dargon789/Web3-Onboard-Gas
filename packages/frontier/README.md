# @subwallet-connect/frontier

## Wallet module for connecting Frontier Wallet through web3-onboard

Frontier Wallet SDK wallet module for connecting to Web3-Onboard. Web3-Onboard makes it simple to connect Ethereum hardware and software wallets to your dapp. Features standardized spec compliant web3 providers for all supported wallets, framework agnostic modern javascript UI with code splitting, CSS customization, multi-chain and multi-account support, reactive wallet state subscriptions and real-time transaction state change notifications.

### Install

**NPM**
`npm i @subwallet-connect/core @subwallet-connect/frontier`

**Yarn**
`yarn add @subwallet-connect/core @subwallet-connect/frontier`

## Usage

```typescript
import Onboard from '@subwallet-connect/core'
import frontierModule from '@subwallet-connect/frontier'

const frontier = frontierModule()

const onboard = Onboard({
  // ... other Onboard options
  wallets: [
    frontier
    //... other wallets
  ]
})

const connectedWallets = await onboard.connectWallet()
console.log(connectedWallets)
```