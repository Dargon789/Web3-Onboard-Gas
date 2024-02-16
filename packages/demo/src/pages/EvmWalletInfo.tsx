// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';

import { useConnectWallet, useSetChain } from "@subwallet_connect/react";
import {useNavigate} from "react-router-dom";
import {HeaderWalletInfo} from "../components/header/HeaderWalletInfo";
import { ThemeProps } from '../types';
import CN from "classnames";
import styled from "styled-components";
import AccountList from "../components/account/AccountList";
import WalletMetadata from "../components/metadata/WalletMetadata";





interface Props extends ThemeProps{};



require('./EvmWalletInfo.scss');

function Component ({className}: Props): React.ReactElement {
  const [{wallet},] = useConnectWallet()
  const [{chains}, setChain] = useSetChain()
  const navigate = useNavigate();

  useEffect(() => {
    wallet?.type === "substrate" && navigate("/wallet-info")
  }, []);
  return (
    <div className={CN(className, '__evm-wallet-info-page')}>
      <div className={CN('__evm-wallet-info-page', className)}>
        <HeaderWalletInfo />
        <div className={'__evm-wallet-info-body'}>
          <div className={'__evm-wallet-info-box'}>
            <div className={'__evm-wallet-info-label'}>
              Account List
            </div>
            <AccountList />
          </div>
          <div className={'__evm-wallet-info-box'}>

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

    '.__evm-wallet-info-body': {
      display: 'flex',
      gap: token.paddingMD,
      flexWrap: 'wrap',
      width: '100%'
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
    }

  }
})


export default EvmWalletInfo;
