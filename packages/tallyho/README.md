# @subwallet-connect/tallyho (now named Taho wallet)

## (Deprecated) Wallet module for connecting Tally Ho Wallet to web3-onboard
_Use [@subwallet-connect/taho](../taho/README.md)_

See [Taho Developer Docs](https://docs.tally.cash/tally/developers/integrating-dapps)

### Install

`npm i @subwallet-connect/tallyho`

## Usage

```typescript
import Onboard from '@subwallet-connect/core'
import tallyHoWalletModule from '@subwallet-connect/tallyho'

// initialize the module with options
const tallyHoWalletSdk = tallyHoWalletModule()

const onboard = Onboard({
  // ... other Onboard options
  wallets: [
    tallyHoWalletModule()
    //... other wallets
  ]
})

const connectedWallets = await onboard.connectWallet()
console.log(connectedWallets)
```
