import { Icon, Logo, NetworkItem } from '@subwallet/react-ui';
import { CaretDown, CheckCircle } from 'phosphor-react';
import React, {useCallback, useContext, useMemo} from 'react';
import styled, { useTheme } from 'styled-components';

import { NetworkItemType, Theme, ThemeProps} from '../../../types';
import { GeneralEmptyList } from "../../empty";
import { BaseSelectModal } from "../../modal";
import {ScreenContext} from "../../../context/ScreenContext";
import {useConnectWallet} from "@subwallet_connect/react";

interface Props extends ThemeProps {
  items: NetworkItemType[];
  itemSelected?: string;
  onSelectItem: (value: string) => void;
  disabled : boolean;
  modalId: string;
}

function Component (props: Props): React.ReactElement<Props> {
  const { className = '', itemSelected, items, modalId, disabled, onSelectItem } = props;
  const { token } = useTheme() as Theme;
  const { isWebUI } = useContext(ScreenContext);
  const [{ wallet},] = useConnectWallet();
  const renderEmpty = useCallback(() => <GeneralEmptyList />, []);
  const isLedgerWallet = useMemo(()=>  wallet?.label === 'Ledger' && wallet?.type === 'substrate' , [])
  const renderChainSelected = useCallback((item: NetworkItemType) => {
    return (
      <>
        { isWebUI && <div className={'__selected-item'}>{item.name}</div> }
      </>
    );
  }, []);

  const searchFunction = useCallback((item: NetworkItemType, searchText: string) => {
    const searchTextLowerCase = searchText.toLowerCase();

    return (
      item.name.toLowerCase().includes(searchTextLowerCase)
    );
  }, []);

  const networkLogoNode = useMemo(() => {
    return (
      <Logo
        className='__network-logo'
        network={itemSelected}
        shape='circle'
        size={token.sizeMD}
      />
    );
  }, [token.sizeMD, itemSelected]);

  const renderItem = useCallback((item: NetworkItemType, selected: boolean) => {
    return (
      <NetworkItem
        name={item.name}
        networkKey={item.slug}
        networkMainLogoShape='squircle'
        networkMainLogoSize={28}
        rightItem={selected && (<div className={'__check-icon'}>
          <Icon
            customSize={'20px'}
            iconColor={token.colorSuccess}
            phosphorIcon={CheckCircle}
            type='phosphor'
            weight='fill'
          />
        </div>)}
      />
    );
  }, [token]);

  return (
    <BaseSelectModal
      className={`${className} network-selector-modal ${disabled && '-disabled'}`}
      id={modalId}
      disabled={disabled || isLedgerWallet}
      inputClassName={`${className} network-selector-input`}
      itemKey={'slug'}
      items={items}
      onSelect={onSelectItem}
      placeholder={('Select network')}
      prefix={networkLogoNode}
      renderItem={renderItem}
      renderSelected={renderChainSelected}
      renderWhenEmpty={renderEmpty}
      searchFunction={searchFunction}
      searchMinCharactersCount={2}
      searchPlaceholder={('Network name')}
      selected={itemSelected || ''}
      shape={"round"}
      size='small'
      suffix={
        <Icon
          phosphorIcon={CaretDown}
          weight={'bold'}
        />
      }
      title={'Select network'}
    />

  );
}

const NetworkSelector = styled(Component)<Props>(({ theme: { token } }: Props) => {
  return ({
    '&.ant-select-modal-input-container': {
      height: 40,

      '.ant-select-modal-input-wrapper': {
        flex: 1
      },
    },

    '&.-disabled': {
      opacity: 0.5
    },

    '&.network-selector-input .__selected-item': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: token.colorText
    },

    '.ant-network-item .__check-icon': {
      display: 'flex',
      width: 40,
      justifyContent: 'center'
    }
  });
});

export default NetworkSelector;
