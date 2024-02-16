// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect } from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import CN from 'classnames';
import WalletHeader from './WalletHeader';
import { useAccountCenter, useConnectWallet } from "@subwallet_connect/react";
import styled, {useTheme} from 'styled-components';
import {Theme, ThemeProps} from "../../types";
import WalletFooter from "./WalletFooter";



interface Props extends ThemeProps{};

function Component ( { className } : Props): React.ReactElement<null> {
  const [{ wallet}] = useConnectWallet();
  const navigate = useNavigate();
  const changeAccountCenter = useAccountCenter();
  const theme = useTheme() as Theme;
  useEffect(() => {
    if (!wallet) {
      navigate('/welcome');
    }

  }, [ navigate, wallet]);


  return (
  <div className={CN('__main-layout', className)}>
    <div className={CN('__main-content', {
      '-isConnected': !!wallet
    })}>
      <div className={CN('__content', {
        '-upper': !wallet
      })}>
        <WalletHeader visible={!!wallet} />
        <Outlet />
      </div>
    </div>
  </div>
  );
}

const Layout = styled(Component)<Props>( ({ theme: { extendToken, token} }: ThemeProps) => {
  return {
    backgroundColor: token.colorBgDefault,
    position: 'relative',
    height: '100vh',

    '.__main-content': {
      height: '100%',
      display: 'flex',
      overflowX: 'hidden',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: token.padding
    },

    '.__main-content.-isConnected': {
      padding: '0px 164px',
      justifyContent: 'flex-start'
    },

    '.__content': {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },

    '.-upper': {
      gap: 81
    },

    '.__wallet-footer': {
      width: 1240,
      flexWrap: 'wrap'
    },

    '@media(max-width : 1250px)' : {
      '.__wallet-footer': {
        maxWidth: '100%',
        padding: token.padding
      },

      '.__wallet-header': {
        maxWidth: '100%',
      }

    }
  }
})

export default Layout;
