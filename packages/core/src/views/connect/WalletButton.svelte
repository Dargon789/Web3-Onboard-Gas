<script lang="ts">
  import { fade } from 'svelte/transition'
  import { MOBILE_WINDOW_WIDTH } from '../../constants.js'

  import { WalletAppBadge, SuccessStatusIcon } from '../shared/index.js'

  export let icon: Promise<string>
  export let label: string
  export let onClick: () => void
  export let connected: boolean
  export let connecting: boolean
  export let disabled: boolean

  export let typeWallet: string

  let windowWidth: number


</script>

<style>
  button:disabled {
    opacity: 0.5;
  }

  button.wallet-button-styling {
    position: relative;
    align-items: flex-start;
    flex: 1;
    padding: 0;
    background: none;
    color: var(--onboard-wallet-button-color, inherit);
  }

  .wallet-button-container {
    display: flex;
  }

  .wallet-button-container-inner {
    position: relative;
    display: flex;
    flex-flow: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    width: 243px;
    height: 68px;
  }

  .name {
    font-size: var(--onboard-font-size-7, var(--font-size-7));
    line-height: 1rem;
    text-overflow: ellipsis;
    max-width: 5rem;
    max-height: 2rem;
    overflow: hidden;
  }

  .status-icon {
    position: absolute;
    top: 3.5rem;
    left: 3.5rem;
  }

  @media screen and (min-width: 768px) {
    button.wallet-button-styling {
      transition: background-color 250ms ease-in-out;
      background: var(--onboard-wallet-button-background, var(--item-color));
      border: 1px solid transparent;
      border-color: var(--onboard-wallet-button-border-color, transparent);
      border-radius: var(--onboard-wallet-button-border-radius, var(--border-radius-5));
    }

    button.wallet-button-styling:hover {
      background: var(--onboard-wallet-button-background-hover, var(--action-color));
      color: var(--onboard-wallet-button-color-hover);
    }

    .wallet-button-container-inner {
      flex: 1;
      flex-flow: row nowrap;
      gap: 1rem;
    }

    button.connected {
      border-color: var(--onboard-success-500, var(--success-500));
    }

    .name {
      font-size: var(--onboard-font-size-5, var(--font-size-5));
      line-height: 1.25rem;
      text-align: initial;
      max-width: inherit;
      max-height: 3rem;
      font-weight: 600;
    }

    .status-icon {
      top: 0;
      bottom: 0;
      left: auto;
      right: 1rem;
      margin: auto;
      height: 20px;
    }
  }
</style>

<svelte:window bind:innerWidth={windowWidth} />

<div class="wallet-button-container">
  <button
    class="wallet-button-styling"
    class:connected
    {disabled}
    in:fade|local
    on:click={onClick}
  >
    <div class="wallet-button-container-inner">
      <WalletAppBadge
        size={windowWidth >= MOBILE_WINDOW_WIDTH ? 40 : 56}
        typeWallet={typeWallet}
        {icon}
        loading={connecting}
        border={connected ? 'green' : 'custom'}
        background="transparent"
      />
      <div class="name">{label}</div>
      {#if connected}
        <div class="status-icon">
          <SuccessStatusIcon size={20} />
        </div>
      {/if}
    </div>
  </button>
</div>
