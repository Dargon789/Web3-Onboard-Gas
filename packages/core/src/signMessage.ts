import type { WalletState } from './types';
import {
    signDummy,
    signEthSignMessageRequest,
    signPersonalSignMessageRequest,
    signTypedData_v4MessageRequest,
    signTypedDataMessageRequest
} from './provider';
import { customNotification, sendSignMessage } from './store/actions';
import type { EIP1193Provider } from '@subwallet_connect/common';


async function signMessageAllTypeWallet (
    wallet : WalletState,
    signMethodType : string,
) {
    let message : string;
    const { update, dismiss } = customNotification({
        type: 'pending',
        message:
            'This is a custom DApp pending notification to use however you want',
        autoDismiss: 0
    })
    try {
        if (wallet.type === 'evm') {
            if (signMethodType === 'ETH Sign') {
                message = await signEthSignMessageRequest(
                    wallet.provider as EIP1193Provider
                );
            } else if (signMethodType === 'Personal Sign') {
                message = await signPersonalSignMessageRequest(
                    wallet.provider as EIP1193Provider
                );
            } else if (signMethodType === 'Sign Typed Data') {
                message = await signTypedDataMessageRequest(
                    wallet.provider as EIP1193Provider
                );
            } else if (signMethodType === 'Sign Typed Data v4') {
                message = await signTypedData_v4MessageRequest(
                    wallet.provider as EIP1193Provider
                )
            }
        }else if( wallet.type === 'substrate' && signMethodType === 'signMessageForSubstrateWallet') {
            message = await signDummy( wallet );
        }
        sendSignMessage(message)
        update({
            eventCode: 'dbUpdateSuccess',
            message: `success message is success`,
            type: 'success',
            autoDismiss: 0
        })
        setTimeout(()=> dismiss(), 3000)
    } catch (e) {
        update({
            eventCode: 'dbUpdateError',
            message: `Failed, error ${(e as Error).message}`,
            type: 'error',
            autoDismiss: 0
        })
        dismiss()
    }
}

export default signMessageAllTypeWallet
