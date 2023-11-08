# @subwallet_connect/mew-wallet

## Wallet module for connecting Mew wallet through web3-onboard

### Install

**NPM**
`npm i @subwallet_connect/core @subwallet_connect/mew-wallet`

**Yarn**
`yarn add @subwallet_connect/core @subwallet_connect/mew-wallet`

## Usage

```typescript
import Onboard from '@subwallet_connect/core'
import mewWallet from '@subwallet_connect/mew-wallet'

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
