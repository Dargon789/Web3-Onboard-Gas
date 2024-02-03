// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useLocalStorage } from './../hooks/useLocalStorage';
import { Switch } from 'antd';
import React, { useCallback, useEffect } from 'react';
import {Outlet, useNavigate} from 'react-router-dom';

import WalletHeader from './WalletHeader';
import {useAccountCenter, useConnectWallet} from "@subwallet_connect/react";

require('./Layout.scss');

function Layout (): React.ReactElement<null> {
  const [{ wallet}] = useConnectWallet();
  const [theme, setTheme] = useLocalStorage('sub-wallet-theme', 'light');
  const navigate = useNavigate();
  const changeAccountCenter = useAccountCenter();

  useEffect(() => {
    if (!wallet) {
      navigate('/welcome');
    }


    const isDark = theme === 'dark';
    document.body.style.backgroundColor = isDark ? '#020412' : '#FFF';

    document.body.className = isDark ? 'dark-theme' : 'light-theme';
  }, [theme, navigate, wallet]);

  useEffect(() => {
    changeAccountCenter({
      position: 'topLeft',
      expanded: true,
      minimal: false
    })
  }, []);

  const _onChangeTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [setTheme, theme]);

  return (<div className={'main-layout '}>
    <div className={`main-content ${theme === 'dark' ? '-dark' : '-light'}`}>
      <Switch
        checkedChildren='Light'
        className={(!!wallet) ? 'sub-wallet-switch-theme with-header' : 'sub-wallet-switch-theme'}
        defaultChecked={theme === 'light'}
        onChange={_onChangeTheme}
        unCheckedChildren='Dark'
      />
      <WalletHeader visible={!!wallet} />
      <Outlet />
    </div>
  </div>);
}

export default Layout;
