// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useContext, useEffect, useState } from 'react';

import {useConnectWallet, useNotifications, useSetChain} from "@subwallet_connect/react";
import {useNavigate} from "react-router-dom";
import { ThemeProps } from '../types';
import CN from "classnames";
import styled from "styled-components";
import AccountList from "../components/account/AccountList";
import {PlusCircleOutlined} from "@ant-design/icons";
import {Button, Web3Block} from "@subwallet/react-ui";
import {EIP1193Provider} from "@subwallet_connect/common";
import {evmApi} from "../utils/api/evmApi";
import type { Account } from '@subwallet_connect/core/dist/types';
import {ScreenContext} from "../context/ScreenContext";




interface Props extends ThemeProps{};


function Component ({className}: Props): React.ReactElement {
  const [{ wallet, connecting},connect,, updateBalance] = useConnectWallet();
  const [{ chains}, setChain] = useSetChain();
  const navigate = useNavigate();
  const [ evmProvider, setEvmProvider ] = useState<evmApi>();
  const customNotification = useNotifications()[1];
  const { isWebUI } = useContext(ScreenContext);


  useEffect(() => {
    wallet?.type === "substrate" && navigate("/wallet-info");
    if(!wallet) return;
    setEvmProvider(new evmApi(wallet.provider as EIP1193Provider));
    wallet.provider.on('accountsChanged', (accounts) => {
      if(accounts.length === 0){
        navigate("/welcome");
      }
    })
  }, [wallet]);


  const requestPermission = useCallback(async ()=> {
    const { update, dismiss } = customNotification({
      type: 'pending',
      message:
        `Request permission`,
      autoDismiss: 0
    });
    try{
      await evmProvider?.requestPermissions();

      update({
        eventCode: 'dbUpdateSuccess',
        message: `Request permission success`,
        type: 'success',
        autoDismiss: 1500
      })
    }catch (e) {
      update({
        eventCode: 'dbUpdateError',
        message: `${(e as Error).message}`,
        type: 'error',
        autoDismiss: 1500
      })
    }
  }, [evmProvider]);

  return (
    <div className={CN(className, '__evm-wallet-info-page', {
      '-isMobile': !isWebUI
    })}>
      <div className={CN('__evm-wallet-info-page', className)}>
        <div className={'__evm-wallet-info-body'}>
          <div className={'__evm-wallet-info-box'}>
            <div className={'__evm-wallet-info-label'}>
              Account List
            </div>
            <AccountList evmProvider={evmProvider}/>
          </div>
          <div className={'__evm-wallet-info-box'}>
            <div className={'__evm-wallet-info-label'}>Permission</div>
            <Web3Block
              className={'__request-item'}
              middleItem={
              <Button
                className='__sub-wallet-btn'
                icon={<PlusCircleOutlined />}
                onClick={requestPermission}
                block={true}
              >Request Permissions</Button>
            }
            />

          </div>
        </div>
      </div>
    </div>
);
}


const EvmWalletInfo = styled(Component)<Props>(({theme: {token}})=>{

  return{

    '&.__evm-wallet-info-page': {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: token.padding,
    },

    '&.-isMobile': {
      '.__evm-wallet-info-body': {
        marginTop: 0
      }
    },

    '.__evm-wallet-info-body': {
      display: 'flex',
      gap: token.paddingMD,
      flexWrap: 'wrap',
      width: '100%',
      marginTop: 230
    },

    '.__evm-wallet-info-box': {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 576px'
    },

    '.__evm-wallet-info-label': {
      fontSize: 24,
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '32px',
      marginBottom: token.margin
    },

    '.__request-item': {
      padding: token.padding,
      width: '100%',
      marginBottom: token.marginSM,
      backgroundColor: token.colorBgSecondary,
      borderRadius: 8,
    },

  }
})


export default EvmWalletInfo;
