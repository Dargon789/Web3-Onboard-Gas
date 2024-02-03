// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {Button} from 'antd';
import React, { useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import {useConnectWallet} from "@subwallet_connect/react";

require('./Welcome.scss');

function Welcome (): React.ReactElement {

  const navigate = useNavigate();
  const [{ wallet }, connect] = useConnectWallet()

  useEffect(() => {
    if (wallet?.type === 'substrate') {
      navigate('/wallet-info');
    } else if(wallet?.type === 'evm' ){
      navigate('/evm-wallet-info');
    }
  }, [wallet]);


  return (<div className={'welcome-wrapper'}>
    <div className={'welcome-content'}>
      <div className='welcome-content__text'>Welcome to SubWallet Connect</div>
      <Button
        className='sub-wallet-btn sub-wallet-btn-normal-size'
        onClick={() => connect()}
      >Connect wallet</Button>
    </div>
  </div>);
}

export default Welcome;
