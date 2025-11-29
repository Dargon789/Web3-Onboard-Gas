import type { Account, QRResult } from './types.js';
import { isString, u8aConcat, u8aToU8a } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';
import { ADDRESS_PREFIX, CRYPTO_SR25519, FRAME_SIZE, SUBSTRATE_ID } from './constants.js';


export function isSVG(str: string): boolean {
  return str.includes('<svg')
}


export function generateAccount(str: QRResult): Account {
  const arrResult = str.split(':');

  return {
    address: arrResult[1],
    genesisHash: arrResult[2] as `0x${string}`,
    isSubstrate: arrResult[0] === ADDRESS_PREFIX
  }
}


export function isHexString  (value: string | number)  {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false
  }

  return true
}


export function getDataString (value: Uint8Array | string): string  {
  if( typeof value === 'string') return value
  return Buffer.from(value).toString('binary');
};

const MULTIPART = new Uint8Array([0]);

export function encodeNumber (value: number): Uint8Array {
  return new Uint8Array([value >> 8, value & 0xff]);
}

export function encodeString (value: string): Uint8Array {
  const count = value.length;
  const u8a = new Uint8Array(count);

  for (let i = 0; i < count; i++) {
    u8a[i] = value.charCodeAt(i);
  }

  return u8a;
}

export function decodeString (value: Uint8Array): string {
  return value.reduce((str, code): string => {
    return str + String.fromCharCode(code);
  }, '');
}

export function createAddressPayload (
  address: string, genesisHash: string
): Uint8Array {
  return encodeString(`${ADDRESS_PREFIX}:${address}:${genesisHash}`);
}

export function createSignPayload (
  address: string,
  cmd: number,
  payload: string | Uint8Array,
  genesisHash: string | Uint8Array
): Uint8Array {
  return u8aConcat(
    SUBSTRATE_ID,
    CRYPTO_SR25519,
    new Uint8Array([cmd]),
    decodeAddress(address),
    u8aToU8a(payload),
    u8aToU8a(genesisHash)
  );
}

export function createFrames (input: Uint8Array): Uint8Array[] {
  const frames = [];
  let idx = 0;

  while (idx < input.length) {
    frames.push(input.subarray(idx, idx + FRAME_SIZE));

    idx += FRAME_SIZE;
  }

  return frames.map((frame, index: number): Uint8Array =>
    u8aConcat(
      MULTIPART,
      encodeNumber(frames.length),
      encodeNumber(index),
      frame
    )
  );
}

export function createImgSize (size?: string | number): Record<string, string> {
  if (!size) {
    return {
      height: 'auto',
      width: '100%'
    };
  }

  const height = isString(size)
    ? size
    : `${size}px`;

  return {
    height,
    width: height
  };
}

export function getLocalStore(key: string): string | null {
  try {
    const result = localStorage.getItem(key)
    return result
  } catch (error) {
    return null
  }
}

export function setLocalStore(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    return
  }
}
