<script lang="ts">
  import { onMount } from 'svelte';
  import jsQR from 'jsqr';
  import { imageSquareIcon, errorIcon } from '../icon/index.js';


  type optionsType = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    onPermissionError?: Function;
    // eslint-disable-next-line @typescript-eslint/ban-types
    onResulted?: Function;
  };

  export let scanResult = '';
  export let isBack: boolean;
  export let enableQRCodeReaderButton: boolean;
  export let options: optionsType;

  export let onBack : () => void;

  let canScan = false;
  let video: any;
  let canvas: any;

  onMount(() => {
    requestCamera();
  });

  function requestCamera() {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        // Lọc ra các thiết bị là camera
        const cameras = devices.filter(device => device.kind === 'videoinput');

        // Hiển thị thông tin về số lượng và tên của mỗi camera
        console.log(`Số lượng camera: ${cameras.length}`);
        cameras.forEach((camera, index) => {
          console.log(`Camera ${index + 1}: ${camera.label}`);
        });
      })
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: 'environment',
        },
      })
      .then((userStream) => {
        video.srcObject = userStream;
        video.setAttribute('playsinline', true);
        video.play();
        startScan();
      })
      .catch((err) => {
        canScan = false;
        if (options?.onPermissionError != undefined) {
          options.onPermissionError();
        } else {
          alert(err);
        }
      });
  }

  function startScan() {
    if( !canvas ) return;
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    const { width, height } = canvas;

    context?.drawImage(video, 0, 0, width, height);

    const imageData = context?.getImageData(0, 0, width, height);
    const qrCode = jsQR(imageData.data, width, height);

    if (qrCode) {
      scanResult = qrCode.data;
      if (options?.onResulted != undefined) {
        options.onResulted(qrCode.data);
      } else {
        alert(qrCode.data);
        setTimeout(startScan, 1000);
      }
    } else {
      setTimeout(startScan, 500);
    }
  }

  function onCanPlay() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canScan = true;
    startScan();
  }

  function qrcodeReader(e: any) {
    try {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        let img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          const context = canvas.getContext('2d');
          context.imageSmoothingEnabled = false;
          context.drawImage(img, 0, 0);
          const imageData = context.getImageData(
            0,
            0,
            img.width,
            img.height
          );
          const qrCode = jsQR(imageData.data, img.width, img.height);
          if (qrCode) {
            scanResult = qrCode.data;
            if (options?.onResulted != undefined) {
              options.onResulted(qrCode.data);
            } else {
              alert(qrCode.data);
            }
          }
        };
      };
    } catch (error) {
      console.error(error);
    }
  }
</script>

<canvas bind:this={canvas} />
<!-- svelte-ignore a11y-media-has-caption -->
<div class="qr-scan-container" class:qr-scan-error={!canScan}>
    <div class="qr-scan-left-part" >
        <div class="qr-scan-top-left-conner"/>
        <div class="qr-scan-bottom-left-conner"/>
    </div>
    <video on:canplay={onCanPlay}  class:cant-scan={!canScan} bind:this={video} />
    <div class="qr-scan-right-part" >
        <div class="qr-scan-top-right-conner"/>
        <div class="qr-scan-bottom-right-conner"/>
    </div>
    {#if (!canScan)}
        <div class="qr-scan-error-notify">
            <div class="qr-scan-error-icon">
                {@html errorIcon}
            </div>
            <div class="qr-scan-error-label">
                Can’t find camera
            </div>
        </div>
    {/if}
</div>

<div class='action-footer'>
    <button class="button-neutral-solid" on:click={onBack}>
        {isBack ? 'BACK' : 'Cancel'}
    </button>

    {#if enableQRCodeReaderButton}
        <label for="upload-qrcode-image" class="button-neutral-solid label-upload-img">
            {@html imageSquareIcon} Upload from photos
        </label>
        <input
                class="image-qrcode-input"
                type="file"
                id="upload-qrcode-image"
                accept=".jpg, .jpeg, .png"
                on:change={(e) => qrcodeReader(e)}
        />
    {/if}


</div>


<style>
    canvas {
        display: none;
    }

    video {
        width: 288px;
        border-radius: 16px;
        object-fit: cover;
        height: 288px;
    }

    .image-qrcode-input {
        display: none;
    }

    .button-neutral-confirm{
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        cursor: pointer;
        gap: 4px;
        height: fit-content;
    }

    .button-neutral-confirm, .button-neutral-solid {
        font-weight: 600;
        padding: 16px;
    }

    .action-footer{
        height: 100px;
        display: flex;
        gap: 24px;
        align-items: center;
        width: 100%;
    }

    .cant-scan {
        background-color: #1a1a1a;
    }

    .label-upload-img{
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--spacing-5);
    }

    .qr-scan-container {
        position: relative;
        display: flex;
    }

    .qr-scan-left-part {
        background-color: gray;
        flex: 1;
        position: relative;
        z-index: 1
    }

    .qr-scan-top-left-conner {
        width: 40px;
        height: 40px;
        position: absolute;
        overflow: hidden;
        right: -40px;
        top: 0

    }

    .qr-scan-top-left-conner::before{
        content: "";
        position: absolute;
        top: 0;
        right: -4px;
        height: 40px;
        width: 40px;
        border-top-left-radius: 20px;
        border-style: solid;
        border-color: #004BFF;
        border-width: 0;
        border-left-width: 3px;
        border-top-width: 3px;
        background: transparent;
        box-shadow: -20px 0 0 0 rgba(12, 12, 12, 0.95);
   }


     .qr-scan-bottom-left-conner {
         width: 40px;
         height: 40px;
         position: absolute;
         overflow: hidden;
         right: -40px;
         bottom: 0;
     }

    .qr-scan-bottom-left-conner::before {
        content: "";
        position: absolute;
        top: -4px;
        right: -4px;
        height: 40px;
        width: 40px;
        border-bottom-left-radius: 20px;
        border-style: solid;
        border-color: #004BFF;
        border-width: 0;
        border-left-width: 3px;
        border-bottom-width: 3px;
        background: transparent;
        box-shadow: -20px 0 0 0 rgba(12, 12, 12, 0.95);
   }


    .qr-scan-right-part {
        background-color: rgba(12, 12, 12, 0.95);
        flex: 1;
        position: relative;
        z-index: 1;
    }

    .qr-scan-top-right-conner {
        width: 40px;
        height: 40px;
        position: absolute;
        overflow: hidden;
        left: -40px;
        top: 0;
    }

    .qr-scan-top-right-conner::before {
        content: "";
        position: absolute;
        top: 0;
        right: 1px;
        height: 40px;
        width: 40px;
        border-top-right-radius: 20px;
        border-style: solid;
        border-color: #004BFF;
        border-width: 0;
        border-right-width: 3px;
        border-top-width: 3px;
        background: transparent;
        box-shadow: 20px 0 0 0 rgba(12, 12, 12, 0.95);
      }


    .qr-scan-bottom-right-conner {
        width: 40px;
        height: 40px;
        position: absolute;
        overflow: hidden;
        left: -40px;
        bottom: 0;
    }

    .qr-scan-bottom-right-conner::before {
      content: "";
      position: absolute;
      top: -4px;
      right: 1px;
      height: 40px;
      width: 40px;
      border-bottom-right-radius: 20px;
      border-style: solid;
      border-color: #004BFF;
      border-width: 0;
      border-right-width: 3px;
      border-bottom-width: 3px;
      background: transparent;
      box-shadow: 20px 0 0 0 rgba(12, 12, 12, 0.95);
   }


    .qr-scan-error .qr-scan-top-left-conner::before,
    .qr-scan-error .qr-scan-bottom-left-conner::before,
    .qr-scan-error .qr-scan-top-right-conner::before,
    .qr-scan-error .qr-scan-bottom-right-conner::before {
        border-color: #bf1616;
    }

    .qr-scan-error-notify {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        background-color: rgba(0, 0, 0, 0.75);
        border-radius: 8px;
        position: absolute;
        top: 45%;
        left: 18%;
        border-width: 2px;
        border-style: solid;
        border-color: #bf1616;
        padding: 8px ;
    }

    .qr-scan-error-icon {
        width: 20px;
        height: 20px;
        color: #bf1616;
    }


</style>
