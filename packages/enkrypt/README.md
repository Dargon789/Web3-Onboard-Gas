# @subwallet_connect/enkrypt

## Wallet module for connecting Enkrypt wallet through web3-onboard

### Install

**NPM**
`npm i @subwallet_connect/core @subwallet_connect/enkrypt`

**Yarn**
`yarn add @subwallet_connect/core @subwallet_connect/enkrypt`

## Usage

```typescript
import Onboard from '@subwallet_connect/core'
import enrkypt from '@subwallet_connect/enkrypt'

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
