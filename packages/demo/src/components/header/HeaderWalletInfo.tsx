import { Theme, ThemeProps } from "../../types";
import { WalletState } from "@subwallet-connect/core";
import CN from "classnames";
import { useConnectWallet } from "@subwallet-connect/react";
import LogoWithSubIcon from "../logo/LogoWithSubIcon";
import {Button, Icon, ModalContext, SwModalFuncProps} from "@subwallet/react-ui";
import { Wallet } from "@phosphor-icons/react";
import styled, { useTheme } from "styled-components";
import React, { useCallback, useContext, useMemo } from "react";
import { ScreenContext } from "../../context/ScreenContext";
import { Plugs } from "phosphor-react";
import { useConfirmModal } from "../../hooks";
import { BaseModal } from "../modal";
import { DISCONNECT_MODAL } from "../../constants/modal";
import {DisconnectWalletModal} from "./DisconnectModal";

interface Props extends ThemeProps{};


const modalId = DISCONNECT_MODAL;
const Component = ({ className }: Props)=> {
  const  [{ wallet }, connect  , disconnect ] = useConnectWallet();
  const { token  } = useTheme() as Theme
  const { isWebUI } = useContext(ScreenContext);
  const { activeModal , inactiveModal } = useContext(ModalContext);


  const onClickToDisconnect = useCallback( ()=>{
    if(wallet){
        activeModal(modalId);
    }

  }, [wallet])

  if(!wallet){
    return (
      <></>
    )
  }

  const onCloseModal = useCallback(()=> {
    inactiveModal(modalId)
  }, [])

  const disconnectWallet = useCallback(async ()=> {
    await disconnect(wallet)
  }, [])




  return(
    <div className={CN(className, '__wallet-info-header', {
      '-isMobile': !isWebUI
    })}>
      <div className={CN('__wallet-common-info')}>
        <LogoWithSubIcon icon={wallet.icon} type={wallet.type}/>
        <div className={'__wallet-info-name'}>
          { wallet.label }
        </div>
      </div>
      <Button
        icon={
        <Icon
          phosphorIcon={ Wallet }
          weight={'fill'}
        />
      }
        onClick={onClickToDisconnect}
        shape={'circle'}
        schema={'danger'}
      >
        { isWebUI && 'Disconnect' }
      </Button>
      <DisconnectWalletModal onDisconnect={disconnectWallet} />
    </div>
  )
}


export const HeaderWalletInfo = styled(Component)<Props>(({theme: {token}}) => {

  return({
    '&.__wallet-info-header': {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: 1632,
      padding: `${token.paddingMD + 4}px 16px `,
      position: 'fixed',
      marginTop: 80,
      backgroundColor: token.colorBgDefault,
      zIndex: 1,
      borderBottom: '2px solid',
      borderColor: token.colorBgDivider,
      alignItems: 'center'
    },

    '.__wallet-common-info': {
      display: 'flex',
      gap: token.padding,
      alignItems: 'center',
      '.__wallet-info-name': {
        fontSize: 30,
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '38px'
      }
    },

    '&.-isMobile': {
      position: 'relative',
      paddingLeft: 0,
      paddingRight: 0,
      width: '100%',
      marginTop: 0
    },




  })
})
