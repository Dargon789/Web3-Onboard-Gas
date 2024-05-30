import { ExternalProvider } from "@ethersproject/providers";

export interface CustomWindow extends Window {
  OpenBit: ExternalProvider

}
