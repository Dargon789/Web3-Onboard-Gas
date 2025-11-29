
export interface RequestArguments {
  method: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  params?: unknown[] | Record<string, unknown> | object | undefined;
}


export type ModalStep = 'showQrCode' | 'scanQrCode' | 'successStep' | 'errorStep';

export interface Account  {
  isSubstrate: boolean
  address: string,
  genesisHash: `0x${string}`
}

export type TypeAction = 'signTransaction' | 'getAccount'


export interface SignatureResult {
  signature : `0x${string}`
}

export type QRResult = `0x${string}`;


export interface PayloadParams {
  address: string;
  genesisHash: string;
  transactionPayload : Uint8Array;
  isMessage: boolean;
}
