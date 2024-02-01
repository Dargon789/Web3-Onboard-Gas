<script lang="ts">
  import { slide } from 'svelte/transition'
  import infoIcon from '../../icons/info.js'
</script>

<style>
  .container {
    gap: 1rem;
    padding: 0.75rem;
    color: var(--white);
    font-size: var(--onboard-font-size-7, var(--font-size-7));
    line-height: 16px;
    background: var(--gray-800);
    border-radius: 12px;
    display: flex;
    align-items: center;
  }

  .icon {
    color: var(--onboard-warning-700, var(--warning-800));
    width: 1rem;
    height: 1rem;
    flex: 0 0 auto;
  }


</style>

<div in:slide|local="{{delay: 50, duration: 500}}" class="container flex justify-between">
  <div>
    <slot />
  </div>

  <div class="icon">
    {@html infoIcon}
  </div>
</div>
