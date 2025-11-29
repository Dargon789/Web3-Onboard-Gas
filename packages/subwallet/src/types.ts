import { ExternalProvider } from "@ethersproject/providers";

export interface CustomWindow extends Window {
  SubWallet: ExternalProvider

}
