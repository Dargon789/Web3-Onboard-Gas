<script lang="ts">
  import { _ } from 'svelte-i18n'
  import { WalletAppBadge } from '../shared/index.js'
  import type { WalletState } from '../../types.js'
  import {  successIcon } from '../../icons/index.js'
  import en from '../../i18n/en.json'
  import { shareReplay, startWith } from 'rxjs'
  import { state } from '../../store/index.js'
  import ConnectHDWalletModal from './ConnectHDWalletModal.svelte';
  import { onMount } from 'svelte';
  import { setLocalStore } from '../../utils.js';
  import { STORAGE_KEYS } from '../../constants.js';
  import { connectWallet$ } from '../../streams.js';

  export let selectedWallet: WalletState

  const appMetadata$ = state
    .select('appMetadata')
    .pipe(startWith(state.get().appMetadata), shareReplay(1))

   let notifyAboutConnectHDWallet = false;

  onMount(()=>{

    // if(selectedWallet.label === 'Ledger' && selectedWallet.type === 'substrate'){
    //   const isShowedModal = JSON.parse(
    //     getLocalStore(STORAGE_KEYS.CONNECT_HD_WALLET_MODAL)
    //   )
    //   if(!isShowedModal){
    //     notifyAboutConnectHDWallet = true;
    //   }
    // }
  })
  const showNotifyConnectHDWalletModal = () => {
    setLocalStore(
      STORAGE_KEYS.CONNECT_HD_WALLET_MODAL,
      JSON.stringify(notifyAboutConnectHDWallet)
    )
    notifyAboutConnectHDWallet = false;
    setTimeout(() => connectWallet$.next({ inProgress: false }), 1500)
  }


</script>

<style>
    .container {
        padding: 20px 24px 0 0;
    }

    .connecting-container {
        width: 100%;
        padding: var(--onboard-spacing-4, var(--spacing-4));
        padding: 12px 14px 16px 18px;
        transition: background-color 100ms ease-in-out,
        border-color 100ms ease-in-out;
        border-radius: var(--border-radius-5);
        background: var(--w3o-background-color-item, var(--primary-800));
        border: 1px solid transparent;
        color: var(--w3o-text-color, var(--white));
    }


    .text {
        line-height: 24px;
        font-weight: 600;
    }

    .subtext {
        font-size: var(--onboard-font-size-7, var(--font-size-7));
        color: var(--gray-400);
        line-height: 20px;
        font-weight: 600;
    }

    .items-center{
        gap: var(--spacing-5);
    }



    @media all and (max-width: 520px) {
        .connecting-container {
            border-radius: var(--onboard-border-radius-4, var(--border-radius-4));
        }

        .container {
            padding-bottom: 0;
        }
    }
</style>
{#if notifyAboutConnectHDWallet}
    <ConnectHDWalletModal
            wallet={selectedWallet.label}
            onConfirm={() => showNotifyConnectHDWalletModal()}
    />
{/if}
<div class="container">
  <div class="connecting-container flex justify-between items-center">
    <div class="flex items-center">
      <div class="flex justify-center items-end relative">
        <div class="relative">
          <WalletAppBadge
            size={40}
            padding={8}
            typeWallet={selectedWallet.type}
            border="darkGreen"
            background="transparent"
            icon={selectedWallet.icon}
          />
        </div>
      </div>
        <div class="flex flex-column justify-center ml connecting-wallet-info">
            <div class="text">
                {selectedWallet.label}
            </div>

                <div class="subtext">
                    {$_('connect.connectedWallet.mainText', {
                        default: en.connect.connectedWallet.mainText,
                        values: { wallet: selectedWallet.label }
                    })}
                </div>
        </div>
    </div>

    <div class="tick flex items-center" style="width: 24px;">
      {@html successIcon}
    </div>
  </div>
</div>
