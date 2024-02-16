// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect} from 'react';

import AccountList from '../components/account/AccountList';
import WalletMetadata from '../components/metadata/WalletMetadata';
import { useNavigate } from "react-router-dom";
import { useConnectWallet } from "@subwallet_connect/react";
import { HeaderWalletInfo } from "../components/header/HeaderWalletInfo";
import styled from "styled-components";
import {ThemeProps} from "../types";
import CN from "classnames";

require('./WalletInfo.scss');

interface Props extends ThemeProps {};


function Component ({className}: Props): React.ReactElement {
  const navigate = useNavigate()
  const [ { wallet}] = useConnectWallet()


  useEffect(() => {
    if(wallet?.type=== "evm")  navigate('/evm-wallet-info');
  }, [wallet]);

  return (
  <div className={CN('__wallet-info-page', className)}>
      <HeaderWalletInfo />
    <div className={'__wallet-info-body'}>
      <div className={'__wallet-info-box'}>
        <div className={'__wallet-info-label'}>
          Account List
        </div>
        <AccountList />
      </div>
      {!!wallet?.metadata && <div className={'__wallet-info-box'}>
        <div className={'__wallet-info-label'}>
          Metadata
        </div>
        <WalletMetadata/>
      </div>}
    </div>
  </div>
  );
}

const WalletInfo = styled(Component)<Props>(({theme: {token}}) => {

  return {

    '&.__wallet-info-page': {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: token.padding
    },

    '.__wallet-info-body': {
      display: 'flex',
      gap: token.paddingMD,
      flexWrap: 'wrap',
      width: '100%'
    },

    '.__wallet-info-box': {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 576px'
    },

    '.__wallet-info-label': {
      fontSize: 24,
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '32px',
      marginBottom: token.margin
    }

  }
})


export default WalletInfo;
