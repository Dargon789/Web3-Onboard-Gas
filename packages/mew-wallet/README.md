# @subwallet-connect/mew-wallet

## Wallet module for connecting Mew wallet through web3-onboard

### Install

**NPM**
`npm i @subwallet-connect/core @subwallet-connect/mew-wallet`

**Yarn**
`yarn add @subwallet-connect/core @subwallet-connect/mew-wallet`

## Usage

```typescript
import Onboard from '@subwallet-connect/core'
import mewWallet from '@subwallet-connect/mew-wallet'

const mewWalletModule = mewWallet()

const onboard = Onboard({
  // ... other Onboard options
  wallets: [
    mewWalletModule
    //... other wallets
  ]
})

const connectedWallets = await onboard.connectWallet()
console.log(connectedWallets)
```
