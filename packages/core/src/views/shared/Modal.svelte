<script lang="ts" context="module">
  let scrollContainer: HTMLElement
  export function modalAutoScroll(el: HTMLElement): void {
    const { scrollHeight, clientHeight } = scrollContainer || {}

    if (scrollHeight && scrollHeight > clientHeight) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }
</script>

<script lang="ts">
  import { fade } from 'svelte/transition'
  import { onDestroy, onMount } from 'svelte'
  import { configuration } from '../../configuration.js'
  import CloseButton from './CloseButton.svelte';

  const connectContainerEl = !!configuration.containerElements.connectModal

  const html = document.documentElement
  onMount(() => {
    if (!connectContainerEl) {
      html.style.position = 'sticky'
      html.style.overflow = 'hidden'
    }
  })

  onDestroy(() => {
    if (!connectContainerEl) {
      html.style.position = ''
      html.style.removeProperty('overflow')
    }
  })
  export let close: () => void
  export let maskClose = false ;

</script>

<style>
  section {
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: var(--onboard-modal-z-index, var(--modal-z-index));
  }

  .background {
    background: var(--onboard-modal-backdrop, var(--modal-backdrop));
    pointer-events: all;
  }

  .full-screen-background {
    width: 100vw;
    height: 100vh;
    height: 100dvh;
  }

  .max-height {
    max-height: calc(100vh - 2rem);
  }

  .modal-position {
    top: var(--onboard-modal-top, var(--modal-top));
    bottom: var(--onboard-modal-bottom, var(--modal-bottom));
    left: var(--onboard-modal-left, var(--modal-left));
    right: var(--onboard-modal-right, var(--modal-right));
  }

  .modal-overflow {
    overflow: hidden;
  }

  .modal-styling {
    --border-radius: var(
      --onboard-modal-border-radius,
      var(--w3o-border-radius, 1rem)
    );
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    box-shadow: var(--onboard-modal-box-shadow, var(--box-shadow-0));
  }

  .modal {
    overflow-y: auto;
    background: var(--w3o-background-color, black);
    color: var(--w3o-text-color, initial);
    display: flex;
    flex-direction: column;
  }

  .modal.modal-notify .modal-footer{
      padding: var(--spacing-4);
  }

  .modal.modal-notify .modal-content {
    margin: var(--spacing-4);
  }

  .modal-title {
    display: flex;
    color: var(--white);
    gap: var(--spacing-4);
    justify-content: start;
    font-weight: 600;
    font-size: var(--font-size-4);
    line-height: 28px;
    border-bottom: 1px solid #1a1a1a;
  }

  .modal-title.title-active {
    padding: 16px 64px 16px 8px;
  }

  .icon-container {
    width: 40px;
    height: 40px;
    background-color: transparent;
    color: var(--onboard-warning-500, var(--warning-500));
  }

  .width-100 {
    width: 100%;
  }

  .modal-container-mobile {
    bottom: 0;
  }



  @media all and (min-width: 768px) {
    .modal-styling {
      border-radius: var(--border-radius-5);
    }
    .modal-container-mobile {
      bottom: unset;
      margin: 1rem;
    }
    .width-100 {
      width: unset;
    }
  }

</style>

<section class:fixed={!connectContainerEl} transition:fade>
  <div
    on:click={close}
    class="background flex items-center justify-center relative"
    class:full-screen-background={!connectContainerEl}
  >
    <div
      class="modal-container-mobile modal-position flex"
      class:absolute={!connectContainerEl}
      class:width-100={connectContainerEl}
    >
      <div
        on:click|stopPropagation
        class="flex relative max-height"
        class:width-100={connectContainerEl}
      >
        <div
          class="modal-overflow modal-styling relative flex justify-center"

          style={`${connectContainerEl ? 'max-width: 100%;' : ''}`}
        >
          <div class="modal relative" class:modal-notify={maskClose}>
            <div class="modal-title"
                class:title-active = {maskClose}
            >
              {#if maskClose }
                <div class="icon-container flex justify-center items-center" on:click={close}>
                  <CloseButton />
                </div>
              {/if}
              <slot name="title"  />
            </div>
            <div class="modal-content">
              <slot name="content" />
            </div>
            <div class="modal-footer">
              <slot name="footer"  />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
