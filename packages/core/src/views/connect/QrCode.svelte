<script lang="ts">

    import { fade } from 'svelte/transition';
    import QRCode from 'easyqrcodejs'
    import { onMount } from 'svelte';
    import { isSVG } from '../../utils.js';

    export let uri = '';
    let node : any;
    export let logoImage = '';


    onMount(() => {
      const options = {
        text: uri,
        // ... your other options
        dotScale: 1,
        quietZone: 0,
        width: 240,
        height: 240,
        quietZoneColor: 'rgba(0,0,0,0)',
      };
      new QRCode(node, options);
    });

</script>

<style>
    .container {
        padding: var(--onboard-spacing-4, var(--spacing-4));
        font-size: var(--onboard-font-size-6, var(--font-size-6));
        line-height: 24px;
        margin: auto;
    }

    .icon{
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
        width: 264px;
        height: 264px;
        border-radius: var(--border-radius-5);
        padding: var(--spacing-5);
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }
</style>
    {#if (uri !== '')}
        <div class="container flex items-center qrCode">
            <label class="flex flex-column qrCode" transition:fade={{ duration: 300 }}>
                <div class="qr-box-container" bind:this={node}>
                    <div in:fade|local class="icon absolute z-10">
                        {#if isSVG(logoImage)}
                            <!-- render svg string -->
                            {@html logoImage}
                        {:else}
                            <!-- load img url -->
                            <img src={logoImage} alt="logo" />
                        {/if}
                    </div>
                </div>
            </label>
        </div>
    {/if}
