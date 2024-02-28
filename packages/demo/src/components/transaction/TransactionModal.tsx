import { ThemeProps, TransferParams, FormCallbacks, Theme } from "../../types";
import {TRANSACTION_MODAL} from "../../constants/modal";
import {BaseModal} from "../modal";
import {Button, Form, Icon, Input, ModalContext} from '@subwallet/react-ui';
import {useState, useCallback, useMemo, useEffect, useContext} from "react";
import {useConnectWallet, useNotifications, useSetChain} from "@subwallet_connect/react";
import { Rule } from '@subwallet/react-ui/es/form';
import { useWatchTransaction } from "../../hooks";
import styled from 'styled-components';
import BigN from 'bignumber.js';
import { isAddress, isEthereumAddress } from '@polkadot/util-crypto';
import CN from "classnames";
import AccountBriefInfo from "../account/AccountBriefInfo";
import type { Account } from '@subwallet_connect/core/dist/types';
import { PaperPlaneTilt } from "@phosphor-icons/react";
import {NetworkInfo} from "../../utils/network";
import { SubstrateProvider } from "@subwallet_connect/common";
import { substrateApi } from "../../utils/api/substrateApi";
import { evmApi } from "../../utils/api/evmApi";

export interface Props extends ThemeProps {
  senderAccount: Account;
  substrateProvider ?: substrateApi,
  evmProvider ?: evmApi,
};

const modalId = TRANSACTION_MODAL;



function Component ({ className, senderAccount, evmProvider, substrateProvider }: Props) {
  const [{ wallet},] = useConnectWallet();
  const [{ chains }] = useSetChain();
  const [loading, setLoading] = useState(false);
  const [, customNotification, updateNotify,] = useNotifications();
  const [ defaultData, persistData ] = useState<TransferParams>({
      from: senderAccount.address,
      to: '',
      value: ''
    }
  );
  const { inactiveModal } = useContext(ModalContext);



  const [form] = Form.useForm<TransferParams>();
  const formDefault = useMemo((): TransferParams => defaultData
  , [defaultData]);

  const transferAmount = useWatchTransaction('value', form, defaultData);
  const to = useWatchTransaction('to', form, defaultData);

  useEffect(() => {
    persistData({
      from: senderAccount.address,
      to: '',
      value: ''
    })
  }, [senderAccount]);

  const validateRecipientAddress = useCallback((rule: Rule, _recipientAddress: string): Promise<void> => {
    if (!_recipientAddress) {
      return Promise.reject('Recipient address is required');
    }

    if (!isAddress(_recipientAddress)) {
      return Promise.reject('Invalid recipient address');
    }



    return Promise.resolve();
  }, [form]);

  const validateAmount = useCallback((rule: Rule, amount: string): Promise<void> => {
    if (!amount) {
      return Promise.reject('Amount is required');
    }



    return Promise.resolve();
  }, []);

  const onCloseModal = useCallback(() => {
    inactiveModal(modalId)
  }, [])



  // Submit transaction
  const onSubmit: FormCallbacks<TransferParams>['onFinish'] = useCallback(async (values: TransferParams) => {
    setLoading(true);
    const {   to, value } = values;
    let blockHash = '';
    if(!wallet) return;


    try{
      const {namespace: namespace_, id: chainId } = wallet.chains[0]
      const chainInfo = chains.find(({id, namespace}) => id === chainId && namespace === namespace_);
      if(!chainInfo) return;

      const amount = getOutputValuesFromString(value, chainInfo.decimal || 18);

      if(wallet?.type === "evm"){
        blockHash = await evmProvider?.sendTransaction(senderAccount.address, to, amount ) || ''
      }else{
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

        const getSigner = async ()=>{
          const provider = wallet.provider as SubstrateProvider;
          if(wallet.label === 'Ledger') {
            wallet.signer = await substrateProvider?.getLedgerSigner(senderAccount.address, provider)
          }
          if( wallet.label === 'WalletConnect') {
            wallet.signer = await substrateProvider?.getWCSigner(senderAccount.address, provider);
          }
          if(wallet.label === 'Polkadot Vault'){
            wallet.signer = await substrateProvider?.getQrSigner(senderAccount.address, provider, chainId);
          }
          return await substrateProvider?.sendTransaction(
            senderAccount.address,
            to,
            wallet.signer,
            amount
          );
        }

        await substrateProvider?.isReady()
        blockHash = await getSigner() || '';

      }
      setLoading(false)
      blockHash !== '' && onCloseModal();
    }catch (e) {}
  }, [wallet, chains, senderAccount ]);

  const isValidInput = useCallback((input: string) => {
    return !(isNaN(parseFloat(input)) || !input.match(/^-?\d*(\.\d+)?$/));
  }, []);

   const getInputValuesFromString = useCallback((input: string, power: number) => {
    const intValue = input.split('.')[0];
    let valueBigN = new BigN(isValidInput(intValue) ? intValue : '0');

    valueBigN = valueBigN.div(new BigN(10).pow(power));

    return valueBigN.toFixed();
  }, []);

   const getOutputValuesFromString = useCallback((input: string, power: number) => {
    if (!isValidInput(input)) {
      return '';
    }

    let valueBigN = new BigN(input);

    valueBigN = valueBigN.times(new BigN(10).pow(power));

    return valueBigN.toFixed().split('.')[0];
  }, []);

   const suffixAmountInput = useMemo(()=>{
     if(!wallet) return <></>
     const { namespace: namespace_, id: chainId } = wallet.chains[0]
     const chainInfo = chains.find(({id, namespace}) => id === chainId && namespace === namespace_);

     return(
      <span className={'__amount-token'}>{chainInfo?.token}</span>
     )

   }, [wallet, chains])
  return (
    <BaseModal
      id={modalId}
      title={'Transaction'}
      closable={true}
      onCancel={onCloseModal}
      className={CN(className, 'transaction-modal')}
      fullSizeOnMobile={true}
    >
      <div className={'__transaction-content'}>
        <Form
          className={'form-container form-space-sm'}
          form={form}
          onFinish={onSubmit}
          initialValues={formDefault}
        >
          <Form.Item
            className={'__account-address-input'}
            name={'from'}
          >
            <div className={'__address-input-container'}>
              <label className={'__address-input-label'}>Send from</label>
              <AccountBriefInfo
                account={senderAccount}
                className={'__address-input-content'}
                isDetail={true}
              />
            </div>
          </Form.Item>

          <Form.Item
            name={'to'}
            rules={[
              {
                validator: validateRecipientAddress
              }
            ]}
            statusHelpAsTooltip={true}
            validateTrigger='onBlur'
          >
            <Input
              label={'Send to'}
              className={'__account-address-input'}
              placeholder={'Account address'}
              onBlur={form.submit}
            />
          </Form.Item>

          <Form.Item
            name={'value'}
            rules={[
              {
                validator: validateAmount
              }
            ]}
            statusHelpAsTooltip={true}
            validateTrigger='onBlur'
          >
            <Input
              placeholder={'Amount'}
              className={'__amount-transfer-input'}
              onBlur={form.submit}
              tooltip={'Amount'}
              suffix={suffixAmountInput}
            />
          </Form.Item>
        </Form>
      </div>
      <div className={'__transaction-footer'}>
        <Button
          disabled={false}
          icon={(
            <Icon
              phosphorIcon={PaperPlaneTilt}
              weight={'fill'}
            />
          )}
          loading={loading}
          onClick={form.submit}
          block={true}
        >
              Transfer
        </Button>
      </div>
    </BaseModal>
  )
}



const TransactionModal = styled(Component)(({ theme: {token} }) => {
  return ({
    '.__brief': {
      paddingLeft: token.padding,
      paddingRight: token.padding,
      marginBottom: token.marginMD
    },

    '.form-row': {
      gap: 8
    },

    '.__address-input-container': {
      backgroundColor: token.colorBgInput,
      borderRadius: 8,
      border: '2px solid transparent',

      '.__address-input-content': {
        backgroundColor: 'transparent',
        outline: 'none',
        padding: 0,
        flexGrow: 1,
        fontWeight: 'inherit',
        height: 48,
        paddingBottom: token.paddingSM,
        paddingTop: token.paddingSM,
        marginLeft: token.marginSM
      },

      '.__address-input-label': {
        fontSize: token.fontSizeSM,
        lineHeight: token.lineHeightSM,
        color: token.colorTextLight4,
        paddingLeft: token.paddingSM,
        paddingRight: token.paddingSM,
        paddingTop: 4,
        top: 4,
        position: 'relative'
      },

      '&:hover': {
        border: '2px solid',
        borderColor: token.colorPrimaryBorderHover,
      }
    },

    '.middle-item': {
      marginBottom: token.marginSM
    },

    '.__transaction-footer': {
      marginTop: token.marginXXL
    },

    '.__amount-token': {
      color: token.colorSuccessText,
      marginRight: token.marginSM
    }


  });
});

export default TransactionModal;
