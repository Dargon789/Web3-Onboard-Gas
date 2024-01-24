<script lang="ts">
  import successIcon from '../../icons/success.js'

  export let size: number // px
  export let color: 'green' | 'blue' = 'green'
</script>

<style>
  .icon {
    color: var(--onboard-white, var(--white));
    border-radius: 50px;
    width: fit-content;
    height: fit-content;
  }
</style>

<div
  class="icon flex"
  style={`width: ${size}px; height: ${size}px;`}
>
  {@html successIcon}
</div>
