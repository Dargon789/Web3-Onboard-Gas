import {ThemeProps} from "../../types";
import {BaseModal} from "../modal";
import {Button, ModalContext} from "@subwallet/react-ui";
import React, {useCallback, useContext} from "react";
import {DISCONNECT_MODAL} from "../../constants/modal";
import styled from "styled-components";
import CN from "classnames";


interface Props extends ThemeProps {
  onDisconnect: () => void
};


const modalId = DISCONNECT_MODAL;
function Component ({className, onDisconnect}: Props) {
  const { inactiveModal } = useContext(ModalContext);

  const onCloseModal = useCallback(() => {
    inactiveModal(modalId)
  }, [])


  return(
    <BaseModal
      id={modalId}
      center={true}
      closable={true}
      onCancel={onCloseModal}
      className={CN(className, 'disconnect-modal-container')}
      title={'Disconnect wallet'}
    >
      <div className={'__disconnect-modal-body'}>
        <div className={'__disconnect-modal-sub-title'}>
          Do wan to disconnect all wallets?
        </div>
        <div className={'__disconnect-modal-content'}>
          All connected wallets will be disconnected immediately. If you want to disconnect some accounts, please go to the corresponding
          wallet app to disable.
        </div>
        <div className={'__disconnect-action-group'}>
          <Button className={'__disconnect-action-reject'}
                  onClick={onCloseModal}
                  block={true}
                  schema={'secondary'}
          >
            Cancel
          </Button>
          <Button className={'__disconnect-action-approve'}
                  onClick={onDisconnect}
                  block={true}
                  schema={'danger'}
          >
            Disconnect
          </Button>
        </div>
      </div>
    </BaseModal>
  )


}

export const DisconnectWalletModal = styled(Component)<Props>(({ theme: {token}})=>{

  return({
    '.__disconnect-modal-body': {
      display: 'flex',
      gap: token.padding,
      flexDirection: 'column'
    },

    '.__disconnect-modal-sub-title': {
      color: token['colorError-6'],
      textAlign: 'center',
      fontSize: token.fontSizeLG,
      margin: '0 8px',
      fontWeight: 600,
      lineHeight: token.lineHeightHeading5,
    },

    '.__disconnect-modal-content': {
      color: token.colorTextLight4,
      textAlign: 'center',
      margin: '0 8px',
      fontWeight: 500,
      lineHeight: token.lineHeightHeading6
    },

    '.__disconnect-action-group': {
      display: 'flex',
      gap: token.paddingSM
    }

  })
})
