import { Button, Icon } from '@subwallet/react-ui';
import { CaretDown, Plugs } from 'phosphor-react';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import styled from 'styled-components';

import { SELECT_ACCOUNT_MODAL } from "../../../constants/modal";
import { Theme, ThemeProps } from '../../../types';
import { AccountCardItem } from '../../account';
import AccountBriefInfo from '../../account/AccountBriefInfo';
import { GeneralEmptyList } from '../../empty';
import { BaseSelectModal } from '../BaseSelectModal';
import {useConnectWallet, useSetChain, useWallets} from "@subwallet_connect/react";
import type { Account, WalletState } from  '@subwallet_connect/core/dist/types';



type Props = ThemeProps;

const renderEmpty = () => <GeneralEmptyList />;

export const searchAccountFunction = (item: string, searchText: string): boolean => {
  return item.toLowerCase().includes(searchText.toLowerCase()) || (item || '').toLowerCase().includes(searchText.toLowerCase());
};

const modalId = SELECT_ACCOUNT_MODAL;

interface WalletMapByAccountInterface {
  [account: string]: WalletState
}

function Component ({ className }: Props): React.ReactElement<Props> {
  const wallets = useWallets();
  const setPrimaryWallet = useConnectWallet()[5];
  const [ accountMap, setAccountMap ] = useState<Account[]>([]);
  const [ walletMapByAccount, setWalletMapByAccount ] = useState<WalletMapByAccountInterface>({});
  const [{ chains, connectedChain }, set] = useSetChain();
  const [ currentAccount, setCurrentAccount ] = useState<string>(wallets[0].accounts[0].address);

  useEffect(() => {
    const accountMap_ = wallets.reduce((accountMap, wallet)=> {
      const walletMap = wallet.accounts.reduce((walletMap, account) => {

        walletMap = { ...walletMap, [account.address]: wallet}

        return walletMap;
      }, {} as WalletMapByAccountInterface)

      setWalletMapByAccount(walletMap);

      return  accountMap.concat(wallet.accounts);
    }, [] as Account[]);

    setAccountMap(accountMap_)


  }, [wallets]);

  const _onSelect = useCallback(async (address_: string) => {
    if (address_) {
      const walletByAddress = walletMapByAccount[address_];

      if (walletByAddress) {
        await setPrimaryWallet(walletByAddress, chains, address_)
        setCurrentAccount(address_);
      }
    }
  }, [walletMapByAccount]);

  const renderItem = useCallback((item: Account, _selected: boolean): React.ReactNode => {
    return (
      <AccountCardItem
        account={item}
        isSelected={_selected}
      />
    );
  }, []);

  const renderSelectedItem = useCallback((item: Account): React.ReactNode => {

    return (
      <div className='selected-account'>
        <AccountBriefInfo account={item} />
      </div>
    );
  }, []);


  return (
    <BaseSelectModal
      background={'default'}
      className={className}
      fullSizeOnMobile
      id={modalId}
      ignoreScrollbarMethod='padding'
      inputClassName={`${className} account-selector-input`}
      inputWidth={'100%'}
      itemKey='address'
      items={accountMap}
      onSelect={_onSelect}
      renderItem={renderItem}
      renderSelected={renderSelectedItem}
      renderWhenEmpty={renderEmpty}
      searchFunction={searchAccountFunction}
      searchMinCharactersCount={2}
      searchPlaceholder={'Account name'}
      selected={currentAccount || ''}
      shape='round'
      size='small'
      suffix={
        <Icon
          phosphorIcon={CaretDown}
          weight={'bold'}
        />
      }
      title={'Select account'}
    />
  );
}

const SelectAccount = styled(Component)<Props>(({ theme }) => {
  const { token } = theme as Theme;

  return ({
    '&.ant-select-modal-input-container': {
      '.account-name': {
        'white-space': 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },

    '&.ant-sw-modal': {
      '.ant-sw-modal-body': {
        minHeight: 370,
        marginBottom: 0
      },

      '.ant-sw-list-search-input': {
        paddingBottom: token.paddingXS
      },

      '.ant-sw-modal-footer': {
        marginTop: 0,
        borderTopColor: 'rgba(33, 33, 33, 0.80)'
      },

      '.ant-account-card': {
        padding: token.paddingSM
      },

      '.ant-web3-block .ant-web3-block-middle-item': {
        textAlign: 'initial'
      },

      '.all-account-selection': {
        cursor: 'pointer',
        borderRadius: token.borderRadiusLG,
        transition: `background ${token.motionDurationMid} ease-in-out`,

        '.account-item-name': {
          fontSize: token.fontSizeHeading5,
          lineHeight: token.lineHeightHeading5
        },

        '&:hover': {
          background: token.colorBgInput
        }
      },

      '.ant-account-card-name': {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        'white-space': 'nowrap',
        maxWidth: 120
      },

      '.ant-input-container .ant-input': {
        color: token.colorTextLight1
      }
    },

    '.all-account-item': {
      display: 'flex',
      padding: `${token.paddingSM + 2}px ${token.paddingSM}px`,
      cursor: 'pointer',
      backgroundColor: token.colorBgSecondary,
      borderRadius: token.borderRadiusLG,
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: token.sizeXS,

      '&:hover': {
        backgroundColor: token.colorBgInput
      },

      '.selected': {
        color: token['cyan-6']
      }
    },

    '.ant-select-modal-input-container': {
      overflow: 'hidden'
    },

    '.selected-account': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    },
  });
});

export default SelectAccount;
