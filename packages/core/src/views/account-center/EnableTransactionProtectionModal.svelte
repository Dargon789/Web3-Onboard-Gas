<script lang="ts">
  import { _ } from 'svelte-i18n'
  import { Modal } from '../shared'
  import en from '../../i18n/en.json'
  import shieldIcon from '../../icons/shield-icon.js'

  export let onEnable: () => void
  export let onDismiss: () => void
  export let infoLink: string
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
    color: var(--success-500);
    font-weight: 600;
  }

  .content-description {
    font-size: var(--font-size-6);
    color: rgba(255, 255, 255, 0.45);
    font-weight: 500;
  }

  .icon-container {
    position: relative;
    overflow: hidden;
    width: 2.625rem;
    height: 2.625rem;
    border-radius: 24px;
    padding: 0.75rem;
    background: none;
  }
  .icon-container::before {
    content: '';
    height: 100%;
    width: 100%;
    opacity: 0.2;
    background: var(--action-color);
  }

  .title {
    width: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .width-100 {
    width: 100%;
  }

  .right {
    margin-left: 0.5rem;
  }

  button{
    display: flex;
    justify-content: center;
  }
</style>

<Modal close={onDismiss} maskClose={true}>
  <div class="title" slot="title">
    {$_('modals.confirmTransactionProtection.heading', {
      default: en.modals.confirmTransactionProtection.heading
    })}
  </div>
  <div class="content width-100" slot="content">
    <span class="content-subHeading width-100">
      {$_('modals.confirmTransactionProtection.subHeading', {
        default: en.modals.confirmTransactionProtection.subHeading
      })}
    </span>
    <div class="content-description">
      <div>
        {$_('modals.confirmTransactionProtection.description')}
      </div>
      <a
        href={infoLink}
        target="_blank"
        rel="noreferrer noopener"
        class="no-link"
        >{$_('modals.confirmTransactionProtection.link', {
          default: en.modals.confirmTransactionProtection.link
        })}
      </a>
    </div>
  </div>

  <div class="flex justify-between items-center" slot="footer">
    <button class="button-neutral-confirm" on:click={onEnable}>
      <div class="content-subHeading icon-container">
        {@html shieldIcon}
      </div>
      {$_('modals.confirmTransactionProtection.enable', {
        default: en.modals.confirmTransactionProtection.enable
      })}
    </button>

    <button class="right button-neutral-solid" on:click={onDismiss}>
      {$_('modals.confirmTransactionProtection.dismiss', {
        default: en.modals.confirmTransactionProtection.dismiss
      })}
    </button>
  </div>
</Modal>
