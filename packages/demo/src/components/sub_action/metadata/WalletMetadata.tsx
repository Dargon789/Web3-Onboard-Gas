// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0


import React, { useCallback, useEffect, useState } from 'react';
import styled from "styled-components";
import { ThemeProps } from "../../../types";
import { useConnectWallet, useNotifications } from "@subwallet_connect/react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { InjectedMetadataKnown, InjectedMetadata, MetadataDef  } from "@polkadot/extension-inject/types";
import {Button, SwList, Web3Block} from "@subwallet/react-ui";
import CN from "classnames";
import {GeneralEmptyList} from "../../empty";


interface Props extends ThemeProps{};


function Component({className}: Props): React.ReactElement {
  const [{ wallet }] = useConnectWallet()
  const [injectedMetas, setInjectedMetas] = useState<InjectedMetadataKnown[]>([]);
  const customNotification = useNotifications()[1];
  const renderEmpty = useCallback(() => <div></div>, []);

  const loadMetadata = useCallback(
    () => {
      const metadata = wallet?.metadata;
      if (metadata) {
        (metadata as InjectedMetadata).get().then((rs) => {
          setInjectedMetas(rs);
        });
      }
    },
    [wallet]
  );

  useEffect(() => {
    setTimeout(() => {
      loadMetadata();
    }, 300);
  }, [loadMetadata, wallet]);

  const addMetadata = useCallback(
    () => {
      const metadata = wallet?.metadata;

      if (metadata) {
        const newMetaDef: MetadataDef = {
          chain: 'SubWallet Connect Demo',
          genesisHash: '0x1bf2a278799868de66ea8610f2ce7c8c43706561b6476031315f6640fe38e888',
          icon: 'substrate',
          ss58Format: 0,
          chainType: 'substrate',
          color: '#F0F0F0',
          specVersion: Math.floor(Date.now() / 1000),
          tokenDecimals: 12,
          tokenSymbol: 'SWCC',
          types: {}
        };


        const { update, dismiss } = customNotification({
          type: 'pending',
          message:
            `Adding Metadata`,
          autoDismiss: 0
        });
          (metadata as InjectedMetadata).provide(newMetaDef)
          .then((rs) => {
            update({
              eventCode: 'dbUpdateSuccess',
              message: `Add Metadata Successfully!`,
              type: 'success',
              autoDismiss: 0
            })
            loadMetadata();
          })
          .catch((error) => {
            console.error(error);
            update({
              eventCode: 'dbUpdateSuccess',
              message: `Add Metadata Failed or Cancelled!`,
              type: 'error',
              autoDismiss: 0
            })
          });
        setTimeout(()=>{
          dismiss();
        }, 1500)
      }
    },
    [loadMetadata, wallet?.metadata]
  );

  const metadataItem = useCallback((meta: InjectedMetadataKnown)=> {


    const _middleItem = (
      <div className={'__metadata-item-middle'}>
        <div className='__metadata-item-info'>
          <span className='__metadata-item__title'>Genesis Hash:</span>
          <span className='__metadata-item__content'>{meta.genesisHash}</span>
        </div>
        <div className='__metadata-item-info'>
          <span className='__metadata-item__title'>Spec Version:</span>
          <span className='__metadata-item__content'>{meta.specVersion}</span>
        </div>
      </div>
    )

    return(
      <Web3Block
        key={meta.genesisHash}
        className={'__metadata-item'}
        middleItem={_middleItem}
      />
    )

  }, [wallet])

  return (
    <div className={CN(className, 'wallet-metadata')}>
    <SwList
      className={'__metadata-list'}
      list={injectedMetas}
      renderWhenEmpty={renderEmpty}
      renderItem={metadataItem}
    >
    </SwList>
      <Button
        className='__sub-wallet-btn'
        icon={<PlusCircleOutlined />}
        onClick={addMetadata}
        block={true}
      >Add Example Metadata</Button>
  </div>);
}

const WalletMetadata = styled(Component)<Props>(({theme:{token}}: Props) => {
  return {
    '&.__metadata-list': {
      position: 'relative',
      width: '100%'
    },

    '.__metadata-item': {
      padding: token.padding,
      width: '100%',
      marginBottom: token.marginSM,
      backgroundColor: token.colorBgSecondary,
      borderRadius: 8,
    },

    '.__metadata-item-middle': {
      display: 'flex',
      flexDirection: 'column',
      gap: token.paddingSM,
      overflow: 'hidden'
    },

    '.__metadata-item-info': {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      overflow: 'hidden',
      gap: token.paddingSM
    },

    '.__metadata-item__title': {
      fontSize: token.fontSizeHeading6,
      fontStyle: 'normal',
      fontWeight: 600,
      width: 128,
      lineHeight: '22px',
      overflow: 'hidden'
    },


    '.__metadata-item__content': {
      textOverflow: 'ellipsis',
      fontSize: token.fontSizeHeading6,
      overflow: 'hidden',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '22px',
      color: token.colorTextLight4
    },

  }
})

export default WalletMetadata;
