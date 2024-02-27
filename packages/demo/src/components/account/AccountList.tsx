/* eslint-disable @typescript-eslint/no-floating-promises */
// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line header/header
import { Button, SwList, Web3Block } from "@subwallet/react-ui";
import React, { useCallback, useEffect, useState } from 'react';

import { useConnectWallet, useNotifications, useSetChain } from "@subwallet_connect/react";
import { SubstrateProvider } from "@subwallet_connect/common";
import { GeneralEmptyList } from "../empty";
import { ThemeProps } from "../../types";
import CN from "classnames";
import styled from "styled-components";
import { evmApi } from "../../utils/api/evmApi";
import { substrateApi } from "../../utils/api/substrateApi";
import { NetworkInfo } from "../../utils/network";



interface Props extends ThemeProps{
  substrateProvider ?: substrateApi,
  evmProvider ?: evmApi
};


type AccountMapType = {
  account: string,
  index: number
}

function Component ({className, substrateProvider, evmProvider}: Props): React.ReactElement {
  const [{ wallet},] = useConnectWallet();
  const renderEmpty = useCallback(() => <GeneralEmptyList />, []);
  const [ accountsMap, setAccountMap ] = useState<AccountMapType[]>([])
  const [{ chains }] = useSetChain();
  const [, customNotification, updateNotify,] = useNotifications();




  const sendTransaction = useCallback(
    async ( address: string)=> {
      if(!wallet) return;
      try{

        if(wallet?.type === "evm"){
          await evmProvider?.sendTransaction(address, '0x9Cd900257bFdaf6888826f131E8B0ccB54EdB0be', '1000000000000000' )
        }else{
          const {namespace: namespace_, id: chainId } = wallet.chains[0]
          const chainInfo = chains.find(({id, namespace}) => id === chainId && namespace === namespace_);
          if(chainInfo){
            const ws = NetworkInfo[chainInfo.label as string].wsProvider;
            if(! ws) {
              const {} = customNotification({
                type: 'error',
                message:
                  'This network is not provide api',
                autoDismiss: 2000
              })

              return ;
            }

            substrateProvider?.isReady().then( async ()=>{
              const provider = wallet.provider as SubstrateProvider;
              if(wallet.label === 'Ledger') {
                wallet.signer = await substrateProvider?.getLedgerSigner(address, provider)
              }
              if( wallet.label === 'WalletConnect') {
                wallet.signer = await substrateProvider?.getWCSigner(address, provider);
              }
              if(wallet.label === 'Polkadot Vault'){
                wallet.signer = await substrateProvider?.getQrSigner(address, provider, chainId);
              }
              await substrateProvider.sendTransaction(
                address,
                '5GnUABVD7kt1wnmLiSeGcuSd5ESvmVnAjdMRrtvKxUGxuy6N',
                wallet.signer,
                '0'
              )
            })

          }
        }
      }catch (e) {}
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
            wallet.type === 'evm' ?  await evmProvider?.signMessage(address)
              : await substrateProvider?.signMessage(address, wallet.provider as SubstrateProvider, wallet.signer, wallet.chains[0].id);
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
        await sendTransaction(address);
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
            className={CN('__wallet-btn', '__sub-wallet-sign-btn')}
            onClick={onSignClicked(account)}
            block={true}
          >
            Sign Dummy
          </Button>

          <Button
            className={CN('__wallet-btn', '__sub-wallet-transaction-btn')}
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

      '.__sub-wallet-transaction-btn': {
        backgroundColor: "#252525",

        '&:hover': {
          backgroundColor: "#363636"
        }
      }
    }
})

export default AccountList;
