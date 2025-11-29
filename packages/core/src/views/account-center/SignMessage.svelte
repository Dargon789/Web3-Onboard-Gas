<script lang="ts">
    import { _ } from 'svelte-i18n';
    import { Modal } from '../shared';
    import en from '../../i18n/en.json';
    import caretIcon from '../../icons/caret-light.js';
    import warningIcon from '../../icons/warning.js';
    import { state } from '../../store/index.js';
    import { listMethodTypeMessage } from '@subwallet-connect/common';
    import { wallets$ } from '../../streams.js';
    import  CloseButton  from '../shared/CloseButton.svelte';

    let selectElement: HTMLSelectElement
    const wallets= $wallets$;
    const message = wallets[0].accounts[0].message;
    export let onConfirm: (value : string) => void
    export let onClose: () => void
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
        text-align: center;
        max-width: 390px;
    }

    .content-description, .content-subHeading {
        padding: 0 var(--spacing-4);
    }

    .content-subHeading {
        color: var(--warning-800);
        font-weight: 600;
    }

    .content-description {
        color: rgba(255, 255, 255, 0.45);
        font-size: var(--font-size-6);
        font-weight: 500;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
    }

    .title {
        width: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .select-type-sign {
        width: 80%;
        border-radius: var(--border-radius-5);
        font-size: var(--font-size-5);
        margin: auto;
        height: 52px;
        border-color: transparent;
        padding-left: .375rem;
        &:focus{
            outline: none;
        }
    }

    button {
        margin-top: 1.5rem;
        width: 50%;
        font-weight: 600;
    }

    .right {
        margin-left: 0.5rem;
        width: 60%;
    }

    .width-100 {
        width: 100%;
    }

</style>

<Modal close={onClose} maskClose={true}>
    <span class="title" slot="title">
        {$_('modals.confirmSignMessage.heading', {
            default: en.modals.confirmSignMessage.heading
        })}
    </span>
    <div class="content width-100" slot="content">
      <span class="content-subHeading width-100">
          {$_('modals.confirmSignMessage.subHeading', {
              default: en.modals.confirmSignMessage.subHeading
          })}
        </span>
        <div class="content-description width-100">
            {#if wallets[0].type === 'evm' }
            <span>
                {$_('modals.confirmSignMessage.evmWallet.content', {
                    default: en.modals.confirmSignMessage.evmWallet.content
                })}
            </span>
            <select
                    class={`flex justify-center items-center pointer maximized_ac select-type-sign`}
                    bind:this={selectElement}
                    value={listMethodTypeMessage[0]}
                    style={`
        color: var(--account-center-maximized-network-selector-color,
        var(--account-center-network-selector-color, var(--gray-500)));
        ${
        'font-weight: 0;'
      }`}
            >
                {#each listMethodTypeMessage as method}
                    <option value={method}
                    >{method}</option
                    >
                {/each}
            </select>
                {:else if wallets[0].type === 'substrate' && wallets[0].signer}
                <span>
                    {$_('modals.confirmSignMessage.substrateWallet.content', {
                        default:
                            en.modals.confirmSignMessage.substrateWallet.content
                    })}
                </span>
            {/if}
        </div>
    </div>
    <div class="flex justify-between items-center" slot="footer">
        <button class="button-neutral-confirm" on:click={() => onConfirm( wallets[0].type === 'evm' ? selectElement.selectedOptions[0].value : 'signMessageForSubstrateWallet' )}>
            {$_('modals.confirmSignMessage.sign', {
                default:
                en.modals.confirmSignMessage.sign
            })}
        </button>
        <button class="right button-neutral-solid" on:click={onClose}>
            {$_('modals.confirmSignMessage.cancel', {
                default:
                en.modals.confirmSignMessage.cancel
            })}
        </button>
    </div>
</Modal>
