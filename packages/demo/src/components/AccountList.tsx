/* eslint-disable @typescript-eslint/no-floating-promises */
// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line header/header
import {Button, message, SwList, Web3Block} from "@subwallet/react-ui";
import React, {useCallback, useEffect, useState} from 'react';

import {useConnectWallet, useNotifications, useSetChain} from "@subwallet_connect/react";
import {EIP1193Provider, SubstrateProvider} from "@subwallet_connect/common";
import {GeneralEmptyList} from "./empty";
import {RequestArguments, ThemeProps} from "../types";
import CN from "classnames";
import styled from "styled-components";
import {Maybe} from "@metamask/providers/dist/utils";
import {evmApi} from "../utils/api/evmApi";
import {substrateApi} from "../utils/api/substrateApi";
import {NetworkInfo} from "../utils/network";


interface Props extends ThemeProps{};


type AccountMapType = {
  account: string,
  index: number
}

function Component ({className}: Props): React.ReactElement {
  const [{ wallet},] = useConnectWallet();
  const renderEmpty = useCallback(() => <GeneralEmptyList />, []);
  const [ accountsMap, setAccountMap ] = useState<AccountMapType[]>([])
  const [ substrateProvider, setSubstrateProvider ] = useState<substrateApi>();
  const [ evmProvider, setEvmProvider ] = useState<evmApi>();
  const [{ chains }] = useSetChain();
  const customNotification = useNotifications()[1];


  useEffect(() => {
    if(wallet?.type === "evm"){
      setSubstrateProvider(undefined);
      setEvmProvider(new evmApi(wallet.provider as EIP1193Provider));
    }else if( wallet?.type === 'substrate') {
      const {namespace: namespace_, id: chainId} = wallet.chains[0]
      const chainInfo = chains.find(({id, namespace}) => id === chainId && namespace === namespace_);
      if (chainInfo) {
        const ws = NetworkInfo[chainInfo.label as string].wsProvider;
        if (ws) {
          setSubstrateProvider(new substrateApi(ws))
        }
      }
      setEvmProvider(undefined);
    }
  }, [wallet]);


  const handlePermissionsRs = useCallback(
    (response: Maybe<unknown>) => {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const accounts = response[0]?.caveats[0].value as string[] || [];

    },
    []
  );


  const sendTransaction = useCallback(
    async ()=> {
      if(!wallet) return;
      if(wallet?.type === "evm"){
        console.log(evmProvider, 'provider')
        await evmProvider?.sendTransactionByProvider(wallet.accounts[0].address, '0x9Cd900257bFdaf6888826f131E8B0ccB54EdB0be', '1000000000000000' )
      }else{
        const {namespace: namespace_, id: chainId } = wallet.chains[0]
        const chainInfo = chains.find(({id, namespace}) => id === chainId && namespace === namespace_);
        if(chainInfo){
          const ws = NetworkInfo[chainInfo.label as string].wsProvider;
          if(ws){
            substrateProvider?.isReady().then( async ()=>{
              !!wallet.signer ? await substrateProvider.sendTransactionBySigner(
                wallet.accounts[0].address,
                '5GnUABVD7kt1wnmLiSeGcuSd5ESvmVnAjdMRrtvKxUGxuy6N' ,
                wallet.signer,
                '100000000000'
              ) : await substrateProvider?.sendTransactionByProvider(
                wallet.accounts[0].address,
                '5GnUABVD7kt1wnmLiSeGcuSd5ESvmVnAjdMRrtvKxUGxuy6N' ,
                wallet.provider as SubstrateProvider,
                '100000000000'
              )
            })

          }
        }
      }
    }, [wallet,evmProvider, substrateProvider])




  const onSignClicked = useCallback(
     (address: string) => {
      return async () => {
        if(wallet){
          const { update, dismiss } = customNotification({
            type: 'pending',
            message:
              'This is a custom DApp pending notification to use however you want',
            autoDismiss: 0
          });
          try {
            wallet.type === 'evm' ?  await evmProvider?.signMessage(address) : await substrateProvider?.signMessage(address, wallet.provider as SubstrateProvider, wallet.signer);
            update({
              eventCode: 'dbUpdateSuccess',
              message: `success message is success`,
              type: 'success',
              autoDismiss: 0
            })
            setTimeout(()=> dismiss(), 3000)
          }catch (e) {
            update({
              eventCode: 'dbUpdateError',
              message: `Failed, error ${(e as Error).message}`,
              type: 'error',
              autoDismiss: 0
            })
            dismiss()
          }

        }
      };
    },
    [ evmProvider, substrateProvider]
  );

  const onTransactionClicked = useCallback(
    (address: string) => {
      return async () => {
        await sendTransaction();
      };
    }, [wallet, sendTransaction])



  useEffect(() => {
    const accountMap = wallet?.accounts.reduce((acc, account, index)=>{
      acc.push({account: account.address, index})
      return acc
    }, [] as AccountMapType[])

    setAccountMap(accountMap || []);
  }, [wallet]);

  const accountItem = useCallback(({ account, index }: AccountMapType) => {
    const _middleItem = (
      <div className={'__account-item-middle'}>
        <div className={'__account-item-info'}>
          <span className='__account-item__title'>Wallet name:</span>
          <span className='__account-item__content'>Account { index + 1 }</span>
        </div>
        <div className={'__account-item-info'}>
          <span className='__account-item__title'>Address:</span>
          <span className='__account-item__content'>{account}</span>
        </div>
        <div className={'__account-item-info'}>
          <Button
            className={CN('__wallet-btn', 'sub-wallet-sign-btn')}
            onClick={onSignClicked(account)}
            block={true}
          >
            Sign Dummy
          </Button>

          <Button
            className={CN('__wallet-btn', 'sub-wallet-transaction-btn')}
            onClick={onTransactionClicked(account)}
            block={true}
          >
            Transaction
          </Button>
        </div>
      </div>
    )


    return(
      <Web3Block
        key={index}
        className={'__account-item'}
        middleItem={_middleItem}
      />
    )
  }, [wallet, onSignClicked, onTransactionClicked])


  return (
   <SwList
     className={CN('__account-list', className)}
     list={accountsMap}
     renderWhenEmpty={renderEmpty}
     renderItem={accountItem}
   />

  );
}

export const AccountList = styled(Component)<Props>( ({theme: {token}}) => {
    return{

      '&.__account-list': {
        position: 'relative',
        width: '100%'
      },

      '.__account-item': {
        padding: token.padding,
        width: '100%',
        marginBottom: token.marginSM,
        backgroundColor: token.colorBgSecondary,
        borderRadius: 8,
      },

      '.__account-item-middle': {
        display: 'flex',
        flexDirection: 'column',
        gap: token.paddingSM,
        overflow: 'hidden'
      },

      '.__account-item-info': {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        overflow: 'hidden',
        gap: token.paddingSM
      },

      '.__account-item__title': {
        fontSize: token.fontSizeHeading6,
        fontStyle: 'normal',
        fontWeight: 600,
        width: 128,
        lineHeight: '22px',
        overflow: 'hidden'
      },


      '.__account-item__content': {
        textOverflow: 'ellipsis',
        fontSize: token.fontSizeHeading6,
        overflow: 'hidden',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '22px',
        color: token.colorTextLight4
      },

      '.sub-wallet-transaction-btn': {
        backgroundColor: "#252525",

        '&:hover': {
          backgroundColor: "#363636"
        }
      }
    }
})

export default AccountList;
