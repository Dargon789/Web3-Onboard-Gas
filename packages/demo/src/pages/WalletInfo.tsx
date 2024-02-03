// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect} from 'react';

import AccountList from '../components/AccountList';
import WalletMetadata from '../components/WalletMetadata';
import { useNavigate } from "react-router-dom";
import { useConnectWallet } from "@subwallet_connect/react";

require('./WalletInfo.scss');

function WalletInfo (): React.ReactElement {
  const navigate = useNavigate()
  const [ { wallet}] = useConnectWallet()


  useEffect(() => {
    if(wallet?.type=== "evm")  navigate('/evm-wallet-info');
  }, [wallet]);

  return <div className={'boxed-container'}>
    <div className={'wallet-info-page'}>
      <div className='wallet-info-page__text'>Version: {'something'}</div>
      <div className='wallet-info-page__text'>Account List</div>
      <AccountList />
      <div className='wallet-info-page__text'>Metadata</div>
      <WalletMetadata />
    </div>
  </div>;
}

export default WalletInfo;
