<script lang="ts">

    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { isSVG, getDataString, createFrames, createSignPayload } from '../utils.js';
    import { logoWallet } from '../icon/index.js';
    import { xxhashAsHex } from '@polkadot/util-crypto';
    import QrCode from 'svelte-qrcode';
    import Modal from './Modal.svelte';
    import { payloadUri$ } from '../streams.js';
    import type { PayloadParams } from '../types.js';
    import { CMD } from '../constants.js';
    import { qrCodeIcon } from '../icon/index.js';


    let uri : Uint8Array;
    export let onEnable: () => void
    export let onDismiss: () => void
    let node : any;

    let frames = [];
    let valueHash : any;

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

      const uri = createSignPayload(
        address, cmd(), transactionPayload , genesisHash
      );
      valueHash = xxhashAsHex(uri);
      frames = createFrames(uri); // encode on demand
      const _images = frames.map((frame) => getDataString(frame));
      valueHash = _images[0];
    })

</script>

<style>

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        font-family: var(--onboard-font-family-normal, var(--font-family-normal));
        font-size: var(--onboard-font-size-5, var(--font-size-5));
        line-height: 24px;
        padding: 16px 16px 0 16px;
        text-align: center;
    }



    .title {
        display: flex;
        align-items: center;
        margin-left: 40px;
        justify-content: center;
    }

    .content-description, .content-subHeading {
        padding: 0 var(--spacing-4);
    }

    .content-subHeading {
        color: var(--success-500);
        font-weight: 600;
    }

    .content-description {
        font-size: var(--font-size-6);
        color: rgba(255, 255, 255, 0.45);
        font-weight: 500;
    }


    .width-100 {
        width: 100%;
    }


    button{
        display: flex;
        justify-content: center;
        gap: var(--spacing-5);
        padding: var(--spacing-4);
    }

    .container {
        padding: var(--onboard-spacing-4, var(--spacing-4));
        font-size: var(--onboard-font-size-6, var(--font-size-6));
        line-height: 24px;
        margin: auto;
    }

    .icon{
        position: absolute;
        top: 41%;
        left: 41%;
        & svg {
            width: 55px;
            height: 55px;
        }

    }

    .flex{
        display: flex;
        flex-direction: column;

    }

    input {
        height: 1rem;
        width: 1rem;
        margin-right: 0.5rem;
    }
    .qr-box-container{
        border-radius: 8px;
        padding: 16px;
        margin: 16px ;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .qr-box-container img {
        width: 240px;
        height: 240px;

    }

    .button-action {
        display: flex;
        gap: 16px;
        margin: 16px;
    }

</style>
    {#if (valueHash)}
        <Modal close={onDismiss} maskClose={true}>
            <div class="title" slot="title">
                    CONFIRM
            </div>
            <div class="content" slot="content">
                <div class="container flex items-center qrCode">
                    <label class="flex flex-column qr-box-container" transition:fade={{ duration: 300 }}>
                        <QrCode value={valueHash} size={260} ></QrCode>
                            <div in:fade|local class="icon absolute z-10">
                                {#if isSVG(logoWallet)}
                                    <!-- render svg string -->
                                    {@html logoWallet}
                                {:else}
                                    <!-- load img url -->
                                    <img src={logoWallet} alt="logo" />
                                {/if}
                            </div>
                    </label>
                </div>
            </div>

            <div class="button-action items-center" slot="footer">
                <button class="button-neutral-confirm button-icon" on:click={onEnable}>
                    {@html qrCodeIcon} Approve
                </button>

                <button class="right button-neutral-solid" on:click={onDismiss}>
                   Cancel
                </button>
            </div>
        </Modal>

    {/if}
