import { BehaviorSubject, firstValueFrom, Subject, take } from 'rxjs'
import { payloadUri$, resultQrScan$ } from '../streams.js';
import type { ModalStep, PayloadParams, QRResult, TypeAction } from '../types.js';
import ModalConnect from './ModalConnect.svelte';
import { ProviderRpcError, ProviderRpcErrorCode, ProviderRpcErrorMessage } from '@subwallet-connect/common';

// eslint-disable-next-line max-len
const modalConnect = async (
  typeAction: TypeAction,
  payload ?: PayloadParams
): Promise<QRResult | undefined> => {
  // if (options) {
  //   const error = validateSelectAccountOptions(options)
  //
  //   if (error) {
  //     throw error
  //   }
  // }

  const modalStep$ = new BehaviorSubject<ModalStep>(
    typeAction === 'signTransaction' ? 'showQrCode': 'scanQrCode'
  );

  const app = mountModalConnect(typeAction, modalStep$, resultQrScan$)
  payload && payloadUri$.next(payload)


  resultQrScan$.pipe(take(1)).subscribe(() => {
    app.$destroy()
  })

  return firstValueFrom(resultQrScan$)
}


// eslint-disable-next-line max-len
const mountModalConnect = (
  typeAction: TypeAction,
  modalStep$: BehaviorSubject<ModalStep>,
  resultQrScan$: Subject<QRResult | undefined>,
) => {
  class ModalConnectEl extends HTMLElement {
    constructor() {
      super()
    }
  }

  if (!customElements.get('vault-modal')) {
    customElements.define('vault-modal', ModalConnectEl)
  }

  // add to DOM
  const modalConnectDomElement = document.createElement('vault-modal')
  const target = modalConnectDomElement.attachShadow({ mode: 'open' })

  modalConnectDomElement.style.all = 'initial'

  target.innerHTML = `
    <style>
      :host {
    /* COLORS */
          --white: white;
          --black: black;
          --primary-1: #2F80ED;
          --primary-2: #004BFF;
          --primary-3: #2565e6;
          --primary-100: #a0c7fa;
          --primary-200: #76aaf7;
          --primary-300: #4e8af2;
          --primary-400: #2565e6;
          --primary-500: #004BFF;
          --primary-600: #0031a6;
          --primary-700: #00174d;
          --gray-100: #ebebed;
          --gray-200: #c2c4c9;
          --gray-300: #999ca5;
          --gray-400: #797979;
          --gray-500: #363636;
          --gray-600: #242835;
          --gray-700: #1a1d26;
          --gray-800: #1A1A1A;
          --success-100: #d1fae3;
          --success-200: #baf7d5;
          --success-300: #a4f4c6;
          --success-400: #8df2b8;
          --success-500: #4CEAAC;
          --success-600: #18ce66;
          --success-700: #129b4d;
          --danger-100: #ffe5e6;
          --danger-200: #ffcccc;
          --danger-400: #ff8080;
          --danger-300: #ffb3b3;
          --danger-500: #d5413b;
          --danger-600: #BF1616;
          --danger-700: #660000;
          --warning-100: #ffefcc;
          --warning-200: #ffe7b3;
          --warning-300: #ffd780;
          --warning-400: #ffc74c;
          --warning-500: #ffaf00;
          --warning-600: #cc8c00;
          --warning-700: #664600;
          --warning-800: #D9C500;

        /* FONTS */
       --font-family-normal: var(--w3o-font-family, 'Plus Jakarta Sans', Inter, sans-serif);
        --font-size-5: 1rem;
        --font-size-6: .875rem;
        --font-size-7: .75rem;
        --font-line-height-1: 24px;

        /* SPACING */
        --margin-4: 1rem;
        --margin-5: 0.5rem;
        --spacing-4: 1rem;
        --spacing-5: 0.5rem;

        /* MODAL POSITION */
        --account-select-modal-z-index: 20;
        --account-select-modal-top: unset;
        --account-select-modal-right: unset;
        --account-select-modal-bottom: unset;
        --account-select-modal-left: unset;

        /* SHADOWS */
        --shadow-1: 0px 4px 12px rgba(0, 0, 0, 0.1);

        /* THEMING */
        --background-color: var(--w3o-background-color, #FFF);
        --foreground-color: var(--w3o-foreground-color);
        --text-color: var(--w3o-text-color, inherit);
        --border-color: var(--w3o-border-color, var(--gray-200));
        --action-color: var(--w3o-action-color, var(--primary-500));
      }
    </style>
  `
  const containerElementQuery = 'body'

  const containerElement = document.querySelector(containerElementQuery)
  console.log(containerElement)
  if (!containerElement) {
    throw new Error(
      `Element with query ${containerElementQuery} does not exist.`
    )
  }

  containerElement?.appendChild(modalConnectDomElement)

  const app = new ModalConnect({
    target: target,
    props: {
      typeAction,
      modalStep$,
      resultQrScan$
    }
  })

  return app
}

export default modalConnect

