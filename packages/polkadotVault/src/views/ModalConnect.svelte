<script lang="ts">
    import Modal from './Modal.svelte';
    import QrCodeModal from './QrCodeModal.svelte';
    import ScanQrModal from './ScanQrModal.svelte';
    import type { TypeAction, ModalStep, QRResult, PayloadParams } from '../types.js';
    import type { BehaviorSubject, Subject } from 'rxjs';
    import { payloadUri$ } from '../streams.js';
    import { CMD, STORAGE_KEYS } from '../constants.js';
    import { createSignPayload, setLocalStore, getLocalStore } from '../utils.js';
    export let typeAction: TypeAction;

    export let modalStep$: BehaviorSubject<ModalStep>;

    export let resultQrScan$:  Subject<QRResult>;

    let uri : Uint8Array

    payloadUri$.subscribe(({
            address,
            genesisHash,
            transactionPayload,
            isMessage,
    } : PayloadParams) => {
      const cmd = () => {
        if (isMessage) {
          return CMD.SUBSTRATE.SIGN_MSG;
        } else {
          return CMD.SUBSTRATE.SIGN_IMMORTAL;
        }
      }
      if(!address) return;

      uri = createSignPayload(address, cmd(), transactionPayload , genesisHash )

    })

    function setStep(update: ModalStep) {
      modalStep$.next(update)
    }

    function closeAllModal () {
      const lastConnectedWallets = getLocalStore(
        STORAGE_KEYS.LAST_CONNECTED_WALLET
      )
      if(lastConnectedWallets) {
        const lastConnectedWalletsParsed = JSON.parse(lastConnectedWallets);
        if (
          lastConnectedWalletsParsed &&
          Array.isArray(lastConnectedWalletsParsed) &&
          lastConnectedWalletsParsed.length
        ) {
          setLocalStore(STORAGE_KEYS.LAST_CONNECTED_WALLET, JSON.stringify(
            lastConnectedWalletsParsed.filter(({ label, type }) =>
            (label !== 'Polkadot Vault' && type !== 'substrate')
          )))}
      }
      setStep('successStep');
    }

    function onSuccessAfterScanQrCode ( result: string) {
      if(!result.startsWith('0x') && typeAction === 'signTransaction'){
        result = `0x${result}`;
      }
      resultQrScan$.next(result as QRResult);
      setStep('successStep');
    }

    function onSuccessAfterShowQrCode (){
      setStep('scanQrCode')
    }

    function goBack() {
      if(typeAction === 'signTransaction') {
        setStep('showQrCode')
      } else {
        setStep('successStep')
      }
    }

</script>

<style>

    .modal-connect-container {
        font-family: var(--onboard-font-family-normal, var(--font-family-normal));
        color: var(--account-select-text-color, var(--text-color));
        position: fixed;
        top: 0;
        right: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
        background: var(--account-select-background-color, rgba(0, 0, 0, 0.2));
    }

    :global(button) {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: calc(var(--onboard-spacing-4, var(--spacing-4)) - 1px);
        border-radius: 24px;
        cursor: pointer;
        font: inherit;
        border: none;
        transition: background-color 150ms ease-in-out, color 150ms ease-in-out;
    }

    :global(.onboard-button-primary) {
        background: var(--onboard-primary-500, var(--primary-2));
        padding: calc(var(--onboard-spacing-5, var(--spacing-5)) - 1px)
        calc(var(--onboard-spacing-4, var(--spacing-4)) - 1px);
        color:  var(--white);
        font-size: var(--onboard-font-size-6, var(--font-size-6));
        line-height: var(--onboard-font-line-height-3, var(--font-line-height-3));
        border: 1px solid transparent;
        font-weight: 600;
        height: 40px;
        border-radius: var(--border-radius-1);
    }

    :global(.button-neutral-solid) {
        width: 100%;
        border-radius: 8px;
        height: 52px;
        margin-top: 0 !important;
        background: var(--gray-800);
        padding: var(--spacing-4);
        color: var(--onboard-white, var(--white));
        line-height: var(--onboard-font-line-height-3, var(--font-line-height-3));
    }

    :global(.button-neutral-solid-b) {
        width: 100%;
        height: 52px;
        padding: var(--spacing-4);
        margin-top: 0 !important;
        background: var(--onboard-gray-100, var(--gray-100));
        color: var(--onboard-gray-500, var(--gray-500));
        line-height: var(--onboard-font-line-height-3, var(--font-line-height-3));
    }

    :global(.button-neutral-danger){
        height: 52px;
        width: 100%;
        padding: var(--spacing-4);
        margin-top: 0 !important;
        border-radius: var(--border-radius-5);
        background: var(--danger-600);
        color: var(--onboard-white, var(--white));
        line-height: var(--onboard-font-line-height-3, var(--font-line-height-3));
    }

    :global(.button-neutral-confirm){
        height: 52px;
        width: 100%;
        padding: var(--spacing-4);
        margin-top: 0 !important;
        border-radius: 8px;
        background: var(--primary-2);
        color: var(--onboard-white, var(--white));
        line-height: var(--onboard-font-line-height-3, var(--font-line-height-3));
    }

    :global(.button-neutral-success){
        height: 52px;
        width: 100%;
        padding: var(--spacing-4);
        margin-top: 0 !important;
        border-radius: var(--border-radius-5);
        background: var(--success-500);
        color: var(--onboard-white, var(--white));
        line-height: var(--onboard-font-line-height-3, var(--font-line-height-3));
    }


    :global(button.rounded) {
        border-radius: 24px;
    }

    :global(.button-neutral-danger:hover) {
        background: var(--danger-500);
    }
    :global(.button-neutral-confirm:hover) {
        background: var(--primary-3);
    }

    :global(.button-neutral-solid:hover) {
        background: var(--onboard-gray-500, var(--gray-500));
    }
    :global(.button-neutral-solid-b:hover) {
        background: var(--onboard-gray-200, var(--gray-200));
    }

    :global(.button-neutral-solid:active) {
        color: var(--onboard-gray-300, var(--gray-300));
    }

    :global(.button-neutral-solid-b:active) {
        color: var(--onboard-gray-600, var(--gray-600));
        background: var(--onboard-gray-300, var(--gray-300));
    }

    .container {
        padding: 16px;
        font-family: var(--onboard-font-family-normal, var(--font-family-normal));
        pointer-events: none;
        touch-action: none;
        width: 100%;
    }

    .z-indexed {
        z-index: var(--account-center-z-index);
    }

</style>


    <div class="modal-connect-container">
        {#if ($modalStep$ === 'showQrCode' && uri)}
            <QrCodeModal uri={uri} onEnable={onSuccessAfterShowQrCode} onDismiss={closeAllModal}/>
        {/if}
        {#if ($modalStep$ === 'scanQrCode' )}
            <ScanQrModal onBack={goBack} onSuccess={onSuccessAfterScanQrCode} onDismiss={closeAllModal} isBack={typeAction === 'signTransaction'}/>
        {/if}
    </div>



