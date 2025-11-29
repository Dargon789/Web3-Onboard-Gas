export const MOBILE_WINDOW_WIDTH = 768


export const ADDRESS_PREFIX = 'substrate';
export const SECRET_PREFIX = 'secret';

export enum SCAN_TYPE {
  READONLY = 'READONLY',
  SECRET = 'SECRET',
  QR_SIGNER = 'QR_SIGNER'
}

export const FRAME_SIZE = 1024;
export const CMD_SIGN_MORTAL = 0;
export const CMD_SIGN_HASH = 1;
export const CMD_SIGN_IMMORTAL = 2;
export const CMD_SIGN_MSG = 3;
export const MULTIPART = new Uint8Array([0]);
export const STANDARD_FRAME_SIZE = 2 ** 8;
export const SUBSTRATE_ID = new Uint8Array([0x53]);
export const CRYPTO_SR25519 = new Uint8Array([0x01]);
export const CMD = {
  SUBSTRATE: {
    SIGN_MORTAL: 0,
    SIGN_HASH: 1,
    SIGN_IMMORTAL: 2,
    SIGN_MSG: 3
  }
};

export const STORAGE_KEYS = {
  LAST_CONNECTED_WALLET: 'onboard.js:last_connected_wallet'
}
