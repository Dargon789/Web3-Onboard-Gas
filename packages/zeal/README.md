# @subwallet-connect/zeal

## Wallet module for connecting Zeal to web3-onboard

See [Zeal](https://www.zeal.app/) for details.

For any questions or issues related to integration with Zeal wallet do not hesitate to contact our builders via [hi@zeal.app](mailto:hi@zeal.app) OR ping us on twitter [@withzeal](https://twitter.com/withzeal)

### Install

`npm i @subwallet-connect/core @subwallet-connect/zeal`

## Usage

```typescript
import Onboard from '@subwallet-connect/core'
import zealWalletModule from '@subwallet-connect/zeal'

// initialize the module with options
const zealWalletSdk = zealWalletModule()

const onboard = Onboard({
  // ... other Onboard options
  wallets: [
    zealWalletModule()
    //... other wallets
  ]
})

const connectedWallets = await onboard.connectWallet()
console.log(connectedWallets)
```
