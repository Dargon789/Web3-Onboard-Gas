import { BehaviorSubject, Subject } from 'rxjs';
import type { PayloadParams, QRResult } from './types.js';


export const payloadUri$ =
  new BehaviorSubject<PayloadParams>({} as PayloadParams);

export const resultQrScan$ = new Subject<QRResult | undefined>();

