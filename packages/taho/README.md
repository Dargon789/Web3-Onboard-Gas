# @subwallet-connect/taho (Taho previously named Tally Ho wallet)

## Wallet module for connecting Taho (Previously named Tally Ho wallet) Wallet to web3-onboard
See [Taho Developer Docs](https://docs.tally.cash/tally/developers/integrating-dapps)

### Install

`npm i @subwallet-connect/taho`


## Usage

```typescript
import Onboard from '@subwallet-connect/core'
import tahoWalletModule from '@subwallet-connect/taho'

// initialize the module with options
const tahoWalletSdk = tahoWalletModule()

const onboard = Onboard({
  // ... other Onboard options
  wallets: [
    tahoWalletModule()
    //... other wallets
  ]
})

const connectedWallets = await onboard.connectWallet()
console.log(connectedWallets)
```
