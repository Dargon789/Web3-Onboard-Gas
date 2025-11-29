# @subwallet-connect/walletlink

## (Deprecated) Wallet module for connecting WalletLink to web3-onboard
_Use [@subwallet-connect/coinbase](../coinbase/README.md)_

### Install

`npm i @subwallet-connect/walletlink`

## Options

```typescript
type WalletLinkOptions = {
  darkMode: boolean // default = false
}
```

## Usage

```typescript
import Onboard from '@subwallet-connect/core'
import walletLinkModule from '@subwallet-connect/walletlink'

// initialize the module with options
const walletLink = walletLinkModule({ darkMode: true })

// can also initialize with no options...
// const walletLink = walletLinkModule()

const onboard = Onboard({
  // ... other Onboard options
  wallets: [
    walletLink
    //... other wallets
  ]
})

const connectedWallets = await onboard.connectWallet()
console.log(connectedWallets)
```
