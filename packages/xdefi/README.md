# @subwallet_connect/xdefi

## Wallet module for connecting XDEFI Wallet to web3-onboard

See [XDEFI Wallet Developer Docs](https://docs.xdefi.io/docs/technical-documentation/xdefi-extension-integration/)

### Install

`npm i @subwallet_connect/xdefi`

## Usage

```typescript
import Onboard from '@subwallet_connect/core'
import xdefiWalletModule from '@subwallet_connect/xdefi'

// initialize the module with options
const xdefiSdk = xdefiWalletModule()

const onboard = Onboard({
  // ... other Onboard options
  wallets: [
    xdefiSdk
    //... other wallets
  ]
})

const connectedWallets = await onboard.connectWallet()
console.log(connectedWallets)
```
