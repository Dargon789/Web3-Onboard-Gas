<script lang="ts">
  import { _ } from 'svelte-i18n'
  import { Modal } from '../shared'
  import en from '../../i18n/en.json'
  import warningIcon from '../../icons/warning.js'

  export let onConfirm: () => void
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

<Modal close={onClose} maskClose={true}>
  <span class="title" slot="title">
    {$_('modals.confirmDisconnectAll.heading', {
      default: en.modals.confirmDisconnectAll.heading
    })}
  </span>
  <div class="content width-100" slot="content">
    <span class="content-subHeading width-100">
      {$_('modals.confirmDisconnectAll.subHeading', {
        default: en.modals.confirmDisconnectAll.subHeading
      })}
    </span>
    <span class="content-description width-100">
      {$_('modals.confirmDisconnectAll.description', {
        default: en.modals.confirmDisconnectAll.description
      })}
    </span>
  </div>

  <div class="flex justify-between items-center" slot="footer">
    <button class="button-neutral-solid" on:click={onClose}
    >{$_('modals.confirmDisconnectAll.cancel', {
      default: en.modals.confirmDisconnectAll.cancel
    })}</button
    >
    <button class="right button-neutral-danger" on:click={onConfirm}
    >{$_('modals.confirmDisconnectAll.confirm', {
      default: en.modals.confirmDisconnectAll.confirm
    })}</button
    >
  </div>
</Modal>
