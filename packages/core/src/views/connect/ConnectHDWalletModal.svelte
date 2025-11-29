<script lang="ts">
  import { _ } from 'svelte-i18n'
  import { Modal } from '../shared'
  import en from '../../i18n/en.json'
  import warningIcon from '../../icons/warning.js'

  export let wallet : string
  export let onConfirm: () => void
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
        color: var(--danger-600);
        font-weight: 600;
    }

    .content-description {
        font-size: var(--font-size-6);
        color: rgba(255, 255, 255, 0.45);
        font-weight: 500;
    }


    button {
        margin-top: 1.5rem;
        width: 50%;
        font-weight: 600;
    }

    .title {
        width: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .right {
        margin-left: 0.75rem;
    }

    .width-100 {
        width: 100%;
    }
</style>

<Modal close={() => {}} maskClose={true}>
  <span class="title" slot="title">
    {$_('modals.confirmConnectHDWallet.heading', {
        default: en.modals.confirmConnectHDWallet.heading,
        values: { wallet }
    })}
  </span>
    <div class="content width-100" slot="content">
    <span class="content-subHeading width-100">
      {$_('modals.confirmConnectHDWallet.subHeading', {
          default: en.modals.confirmConnectHDWallet.subHeading
      })}
    </span>
        <span class="content-description width-100">
      {$_('modals.confirmConnectHDWallet.description', {
          default: en.modals.confirmConnectHDWallet.description
      })}
    </span>
    </div>

    <div class="flex justify-between items-center" slot="footer">
        <button class="right button-neutral-danger width-100" on:click={onConfirm}
        >{$_('modals.confirmConnectHDWallet.confirm', {
            default: en.modals.confirmConnectHDWallet.confirm
        })}</button
        >
    </div>
</Modal>
