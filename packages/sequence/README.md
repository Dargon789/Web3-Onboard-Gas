# @subwallet-connect/sequence

## Wallet module for connecting Sequence wallet to web3-onboard

### Install

`npm i @subwallet-connect/sequence 0xsequence ethers`  
or  
`yarn add @subwallet-connect/sequence 0xsequence ethers`

## Options

```typescript
type SequenceOptions {
  appName?: string
  network?: number | string
}
```

## Usage

```typescript
import Onboard from '@subwallet-connect/core'
import sequenceModule from '@subwallet-connect/sequence'

const sequence = sequenceModule({
  appName: 'My app'
})

const onboard = Onboard({
  // ... other Onboard options
  wallets: [
    sequence
    //... other wallets
  ]
})

const connectedWallets = await onboard.connectWallet()
console.log(connectedWallets)
```
