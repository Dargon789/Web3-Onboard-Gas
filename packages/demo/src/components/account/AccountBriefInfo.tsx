import { Typography } from '@subwallet/react-ui';
import SwAvatar from '@subwallet/react-ui/es/sw-avatar';
import React from 'react';
import styled from 'styled-components';

import type { ThemeProps } from '../../types';
import { toShort } from "../../utils/style";
import type { Account } from "@subwallet_connect/core/dist/types";

interface Props extends ThemeProps {
  account: Account
}

const Component: React.FC<Props> = ({ account, className }: Props) => {
  return (
    <div className={className}>
      <div className='account-avatar'>
        <SwAvatar
          size={20}
          value={account.address}
        />
      </div>
      <Typography.Text
        className='account-name'
        ellipsis={true}
      >
        {toShort(account.address)}
      </Typography.Text>
    </div>
  );
};

const AccountBriefInfo = styled(Component)<Props>(({ theme: { token } }: Props) => {
  return {
    display: 'flex',
    flexDirection: 'row',
    gap: token.sizeXS,
    alignItems: 'center',
    overflow: 'hidden',

    '&.mr': {
      marginRight: -1
    },

    '.account-name': {
      fontWeight: token.headingFontWeight,
      fontSize: token.fontSizeHeading5,
      lineHeight: token.lineHeightHeading5,
      color: token.colorTextBase
    },

    '.account-address': {
      fontSize: token.fontSizeHeading6,
      lineHeight: token.lineHeightHeading6,
      color: token.colorTextDescription
    }
  };
});

export default AccountBriefInfo;
