<script lang="ts">
  import ScanQRCode  from './ScanQRCode.svelte';
  import Modal from './Modal.svelte';

  export let onSuccess : (decodedText: string) => void;
  export let onBack : () => void;
  export let onDismiss: () => void;

  export let isBack: boolean;

  let result : string;




  function _onPermissionError() {

  }

  function _onResulted() {
    onSuccess(result);
  }

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
        padding: 16px 16px 0px 16px;
        text-align: center;
    }



    .title {
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

<div class="scan-qr-container">
    <Modal close={onDismiss} maskClose={true}>
        <div class="title" slot="title">
           Scan QR Code
        </div>
        <div class="content" slot="content">
            <ScanQRCode
                    bind:scanResult={result}
                    enableQRCodeReaderButton={true}
                    options={{
                  onPermissionError: () => _onPermissionError(),
                  onResulted: () => _onResulted()
            }}
                    isBack={isBack}
                    onBack= {isBack ? onBack : onDismiss}
            />
        </div>
    </Modal>

</div>
