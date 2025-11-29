// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { useConnectWallet } from "@subwallet-connect/react";
import {Theme, ThemeProps} from "../types";
import CN from "classnames";
import styled, {useTheme} from "styled-components";
import { Web3OnboardLogo, SubWalletLogo, DualLogo } from "../components/logo";
import { Icon, Button, Anchor } from '@subwallet/react-ui';
import { CheckCircle, Info } from "@phosphor-icons/react";
import {INSTALL_WALLET} from "../constants/common";
import {ScreenContext} from "../context/ScreenContext";


interface Props extends ThemeProps {};


function Component ({ className }: Props): React.ReactElement {
  const { isWebUI } = useContext(ScreenContext);
  const navigate = useNavigate();
  const [{ wallet }, connect] = useConnectWallet()
  const { token } = useTheme() as Theme;
  useEffect(() => {
    if (wallet?.type === 'substrate' && wallet.accounts.length > 0) {
      navigate('/wallet-info');
    } else if(wallet?.type === 'evm' && wallet.accounts.length > 0 ){
      navigate('/evm-wallet-info');
    }
  }, [wallet]);


  return (<div className={CN('__welcome-wrapper', className)}>
    <div className={CN('__welcome-content', {
      '-isMobile': !isWebUI
    })}>
      <div className={'__welcome-dual-logo'}>
        <DualLogo
          leftLogo={<SubWalletLogo/>}
          linkIcon={
              <Icon
                phosphorIcon={CheckCircle}
                weight={"fill"}
                customSize={"49.42px"}
                iconColor={"#4CEAAC"}
              />
          }
          rightLogo={<Web3OnboardLogo/>}
        />
      </div>
      <div className='__welcome-content__text'>Connect your wallet</div>
      <div className={CN('__welcome-content__sub-text', {
        '-isMobile': !isWebUI
      })}>Select your wallet from the provided options to get started.</div>
      <Button
        className='__welcome-content__btn'
        shape={'circle'}
        icon={
          <Icon
            phosphorIcon={CheckCircle}
            weight={'fill'}
            size={'lg'}
          />
        }
        onClick={() => connect()}
      >Connect wallet</Button>
      <a
        className={'__welcome-install_link'}
        href={INSTALL_WALLET}
        target="_blank"
        rel="noreferrer noopener"
      >
        <Icon
          phosphorIcon={Info}
          weight={'fill'}
          iconColor={token.colorPrimary}
          customSize={'14px'}
        />
        Don't see your wallet?
      </a>
    </div>
  </div>);
}

const Welcome = styled(Component)<Props>(({theme: { token }}: ThemeProps) => {

  return{
    '&.__welcome-wrapper': {
      position: 'relative',
      display: 'table-cell',
      verticalAlign: 'middle',
    },

    '.__welcome-content': {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px'
    },

    '.__welcome-content.-isMobile': {
      top: 10
    },

    '.__welcome-content__text': {
        fontSize: '24px',
        lineHeight: '32px',
        color: token.colorTextLight2
    },

    '.__welcome-content__sub-text': {
      fontSize: '14px',
      fontStyle: 'normal',
      lineHeight: '22px',
      width: 385,
      height: 44,
      color: token.colorTextLight3
    },

    '.__welcome-content__sub-text.-isMobile': {
      padding: `0 ${token.padding}px`
    },

    '.__welcome-content__btn': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: 'none',
        borderRadius: 8,
        padding: 16,
        width: 282,
        height: 52,
      '.ant-btn-content-wrapper': {
          padding: 0
      }
    },

    '.__welcome-install_link': {
      fontSize: 14,
      fontStyle: 'normal',
      lineHeight: '22px',
      display: 'flex',
      gap: 4,
      color: token.colorPrimary,
      textDecoration: 'none',

      '&:hover':{
        textDecoration: 'underline'
      }
    }

  }
})

export default Welcome;
