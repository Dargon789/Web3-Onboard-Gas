# @subwallet-connect/fortmatic

## Wallet module for connecting Fortmatic to web3-onboard

### Install

`npm i @subwallet-connect/fortmatic`

## Options

```typescript
type FortmaticOptions = {
  apiKey: string
}
```

## Usage

```typescript
import Onboard from '@subwallet-connect/core'
import fortmaticModule from '@subwallet-connect/fortmatic'

const fortmatic = fortmaticModule({ apiKey: 'API_KEY' })

const onboard = Onboard({
  // ... other Onboard options
  wallets: [
    fortmatic
    //... other wallets
  ]
})

const connectedWallets = await onboard.connectWallet()
console.log(connectedWallets)
```
