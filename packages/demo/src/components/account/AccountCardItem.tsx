import { Icon, Logo } from '@subwallet/react-ui';
import SwAvatar from '@subwallet/react-ui/es/sw-avatar';
import CN from 'classnames';
import { CheckCircle } from 'phosphor-react';
import React, { Context, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

import useAccountAvatarTheme from "../../hooks/useAccountAvatarTheme";
import type { Theme } from '../../types';
import { toShort } from "@subwallet/react-ui/es/_util/address";
import type { Account } from '@subwallet_connect/core/dist/types';

export interface _AccountCardItem {
  className?: string;
  account: Account;
  isSelected?: boolean;
}

function Component (props: _AccountCardItem): React.ReactElement<_AccountCardItem> {
  const { account, className, isSelected } = props;

  const token = useContext<Theme>(ThemeContext as Context<Theme>).token;

  const avatarTheme = useAccountAvatarTheme(account.address || '');

  return (
    <>
      <div className={CN(className)}>
        <div className='__item-left-part'>
          <SwAvatar
            isShowSubIcon={true}
            size={40}
            subIcon={(
              <Logo
                network={avatarTheme}
                shape={'circle'}
                size={16}
              />
            )}
            theme={avatarTheme}
            value={account.address}
          />
        </div>
        <div className='__item-center-part'>
          <div className='__item-name'>{toShort(account.address)}</div>
          <div className='__item-address'>{toShort(account.address, 9, 9)}</div>
        </div>
        <div className='__item-right-part'>
          {
            isSelected && (
              <div className='__item-check-icon-wrapper'>
                <Icon
                  iconColor={token.colorSuccess}
                  phosphorIcon={CheckCircle}
                  size='sm'
                  weight='fill'
                />
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}

const AccountCardItem = styled(Component)<_AccountCardItem>(({ theme }) => {
  const { token } = theme as Theme;

  return {
    height: 68,
    background: token.colorBgSecondary,
    padding: token.paddingSM,
    paddingRight: token.paddingXXS,
    borderRadius: token.borderRadiusLG,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    cursor: 'pointer',
    transition: `background ${token.motionDurationMid} ease-in-out`,

    '.__item-left-part': {
      paddingRight: token.paddingXS
    },
    '.__item-center-part': {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flex: 1
    },
    '.__item-name': {
      fontSize: token.fontSizeLG,
      color: token.colorTextLight1,
      lineHeight: token.lineHeightLG,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      'white-space': 'nowrap'
    },
    '.__item-address': {
      fontSize: token.fontSizeSM,
      color: token.colorTextLight4,
      lineHeight: token.lineHeightSM,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      'white-space': 'nowrap'
    },
    '.__item-right-part': {
      marginLeft: 'auto',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative'
    },

    '.__item-check-icon-wrapper': {
      width: 40,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },

    '&:hover': {
      background: token.colorBgInput,
    }
  };
});

export default AccountCardItem;
