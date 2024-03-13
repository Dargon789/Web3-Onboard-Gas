// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {useCallback, useContext, useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import CN from 'classnames';
import WalletHeader from './WalletHeader';
import { useAccountCenter, useConnectWallet } from "@subwallet-connect/react";
import styled, {useTheme} from 'styled-components';
import {Theme, ThemeProps} from "../../types";
import WalletFooter from "./WalletFooter";
import { ScreenContext } from "../../context/ScreenContext";
import { HeaderWalletInfo } from "../header/HeaderWalletInfo";



interface Props extends ThemeProps{};

function Component ( { className } : Props): React.ReactElement<null> {
  const [{ wallet}] = useConnectWallet();
  const navigate = useNavigate();
  const { isWebUI } = useContext(ScreenContext);
  const changeAccountCenter = useAccountCenter();
  const theme = useTheme() as Theme;
  useEffect(() => {
    if (!wallet) {
      navigate('/welcome');
    }

  }, [ navigate, wallet]);


  return (
  <div className={CN('__main-layout', className, {
    '-isMobile': !isWebUI
  })}>
    <div className={CN('__main-content', {
      '-isConnected': !!wallet
    })}>
      <WalletHeader visible={!!wallet} />
      {wallet && <HeaderWalletInfo />}
      <div className={CN('__content', {
        '-upper': !wallet
      })}>
        <Outlet />
      </div>
      <WalletFooter />
    </div>
  </div>
  );
}

const Layout = styled(Component)<Props>( ({ theme: { extendToken, token} }: ThemeProps) => {
  return {
    backgroundColor: token.colorBgDefault,
    position: 'relative',
    height: '100vh',
    padding: '0 16px',
    '.__main-content': {
      height: '100%',
      margin: 'auto',
      display: 'flex',
      overflowX: 'hidden',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: token.padding,
      '::-webkit-scrollbar': {
        width: 0
      },

      '::-webkit-scrollbar-track': {
        backgroundColor: 'transparent'
      },

      '::-webkit-scrollbar-thumb': {
        backgroundColor: 'transparent'
      }
    },

    '.__main-content.-isConnected': {
      maxWidth: 1600,
      justifyContent: 'flex-start'
    },

    '.__content': {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20vh'
    },

    '.-upper': {
      gap: 81,
      marginTop: 200
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

    },


    '&.-isMobile':{
      padding: 0,

      '.__main-content.-isConnected': {
        padding: `0 ${token.padding}px`,
      },

      '.-upper': {
        gap: 81,
        marginTop: 0
      },
    }
  }
})

export default Layout;
