// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button } from 'antd';
import React from 'react';
import {useConnectWallet} from "@subwallet_connect/react";



require('./WalletHeader.scss');

interface Props {
  visible?: boolean
}

function WalletHeader ({ visible }: Props): React.ReactElement<Props> {
  const [{ wallet}, connect] = useConnectWallet()
  if (!visible) {
    return (<></>);
  }

  const onClickAnotherWalle = async ()=>{
    await connect()
  }


  return (<header className={'wallet-header-wrapper'}>
    <div className={'boxed-container'}>
      <div className={'wallet-header-content'}>
        <div className={'wallet-logo'}>
          <svg width={'100%'} height={'100%'} dangerouslySetInnerHTML={{ __html: (wallet?.icon as string).replace(/width="(\d+)"/g, 'width = "100%"').replace(/height="(\d+)"/g, 'height = "100%"') }} />
        </div>
        <div className={'wallet-title'}>
          {wallet?.label}
        </div>
        <div className='spacer' />
        <Button
          className='sub-wallet-btn sub-wallet-btn-small-size'
          onClick={()=>onClickAnotherWalle()}
          type={'primary'}
        >Connect</Button>
      </div>
    </div>
  </header>);
}

export default WalletHeader;
