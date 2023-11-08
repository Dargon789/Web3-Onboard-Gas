import { EIP1193Provider } from '@subwallet_connect/common'
export interface CustomWindow extends Window {
  ethereum: EIP1193Provider & {
    isTrust?: boolean
  }
  trustwallet: EIP1193Provider
}
