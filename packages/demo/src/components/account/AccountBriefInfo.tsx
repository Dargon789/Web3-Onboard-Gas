import { Typography } from '@subwallet/react-ui';
import SwAvatar from '@subwallet/react-ui/es/sw-avatar';
import React, {useContext, useMemo} from 'react';
import styled from 'styled-components';

import type { ThemeProps } from '../../types';
import { toShort } from "../../utils/style";
import type { Account } from '@subwallet-connect/core/dist/types';

interface Props extends ThemeProps {
  account: Account,
  isDetail ?: boolean
}

const Component: React.FC<Props> = ({ account, className, isDetail }: Props) => {
  const isAccountName = useMemo(() => {
    return !!( account.ens?.name || account.uns?.name )
  }, [account])

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
        {  account.ens?.name || account.uns?.name || toShort(account.address,10,10)}
      </Typography.Text>
      {isAccountName && <div className='account-address'>(...{account.address.slice(-3)})</div>}
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
      whiteSpace: 'nowrap',
      fontWeight: token.headingFontWeight,
      fontSize: token.fontSizeHeading5,
      lineHeight: token.lineHeightHeading5,
      color: token.colorTextBase
    },

    '.account-address': {
      whiteSpace: 'nowrap',
      fontSize: token.fontSizeHeading6,
      lineHeight: token.lineHeightHeading6,
      color: token.colorTextDescription
    },
  };
});

export default AccountBriefInfo;

