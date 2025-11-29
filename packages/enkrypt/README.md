# @subwallet-connect/enkrypt

## Wallet module for connecting Enkrypt wallet through web3-onboard

### Install

**NPM**
`npm i @subwallet-connect/core @subwallet-connect/enkrypt`

**Yarn**
`yarn add @subwallet-connect/core @subwallet-connect/enkrypt`

## Usage

```typescript
import Onboard from '@subwallet-connect/core'
import enrkypt from '@subwallet-connect/enkrypt'

const enrkyptModule = enrkypt()

const onboard = Onboard({
  // ... other Onboard options
  wallets: [
    enrkyptModule
    //... other wallets
  ]
})

const connectedWallets = await onboard.connectWallet()
console.log(connectedWallets)
```
