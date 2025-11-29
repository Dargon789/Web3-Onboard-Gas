# @subwallet-connect/portis

## Wallet module for connecting Portis wallet to web3-onboard

### Install

`npm i @subwallet-connect/portis`

## Options

```typescript
type PortisOptions {
  apiKey: string // required
}
```

## Usage

```typescript
import Onboard from '@subwallet-connect/core'
import portisModule from '@subwallet-connect/portis'

const portis = portisModule({ apiKey: 'API_KEY' })

const onboard = Onboard({
  // ... other Onboard options
  wallets: [
    portis
    //... other wallets
  ]
})

const connectedWallets = await onboard.connectWallet()
console.log(connectedWallets)
```
