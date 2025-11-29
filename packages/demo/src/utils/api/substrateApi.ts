import { ApiPromise, WsProvider } from '@polkadot/api';
import type { Signer, SignerPayloadJSON, SignerResult } from '@polkadot/types/types';
import { SubstrateProvider } from "@subwallet-connect/common";
import web3Onboard from "../../web3-onboard";
import { RequestArguments } from "../../types";
import { SIGN_METHODS } from "../methods";
import { LedgerSignature } from "@polkadot/hw-ledger/types";
import { blake2AsU8a } from '@polkadot/util-crypto';
import { BN_HUNDRED, BN_ZERO, isFunction, nextTick } from '@polkadot/util';
import BN from 'bn.js';
import EventEmitter from 'eventemitter3';
import status from "@subwallet-connect/injected-wallets/dist/icons/status";
export class substrateApi {
  private readonly api ?: ApiPromise;
  private _transactionState = new EventEmitter();


  constructor (chainEndpoint: string){
    this.api = new ApiPromise({
      provider: new WsProvider(chainEndpoint),
    });
  }

  get transactionState():  EventEmitter<string | symbol, any> {
    return this._transactionState;
  }

  public async isReady(){
    return this.api?.isReady
  }

  public async getMaxTransfer (amount: string, senderAddress: string, recipientAddress: string) {
    if(!this.api || !this.api.isReady ) return '0';

    const transferExtrinsic = this.api.tx.balances.transferKeepAlive(recipientAddress, amount)
    const  balances  = await this.api.derive.balances?.all(senderAddress)
    const maxTransfer = balances.availableBalance

    return maxTransfer.toString();
  }

  public async isAvailableAmount ( amount: string, senderAddress: string, recipientAddress: string ) {
    if(!this.api) return false;
    const transferExtrinsic = this.api.tx.balances.transferKeepAlive(recipientAddress, amount)
    const [ { partialFee }, balances ] = await Promise.all([
      transferExtrinsic.paymentInfo(senderAddress),
      this.getMaxTransfer(amount, senderAddress, recipientAddress)
    ])

    const adjFee = partialFee.muln(110).div(BN_HUNDRED);

    const maxTransfer = (new BN(balances)).sub(adjFee);


    return !!(maxTransfer.gt(new BN(this.api?.consts.balances.existentialDeposit as any)) && maxTransfer.gt(new BN(amount)))
  }


  public async sendTransaction (senderAddress: string, recipientAddress: string, signer: Signer | undefined, amount: string ){
    if(!this.api || !this.api.isReady || !signer) return;

    const transferExtrinsic = this.api.tx.balances.transferKeepAlive(recipientAddress, amount)
    try{
      const sendTransaction = async (fn: (hash: string) => void) => {
        let txHash_ = ''

        await transferExtrinsic.signAndSend(senderAddress, { signer }, ({ status, txHash }) => {
          if (status.isInBlock) {
            fn(txHash.toString());
            this._transactionState.emit('transaction-success', txHash.toString());
            console.log(`Completed at block hash #${status.asInBlock.toString()}`);
          } else {
            console.log(`Current status: ${status.type}`);
          }
        })
        return txHash_;
      }
      const txDetails = {
        to: recipientAddress,
        value: amount
      }

      return await web3Onboard.state.actions.preflightNotifications({
        sendTransaction,
        txDetails: txDetails
      });
    } catch (e) {
      console.log(':( transaction failed', e);
    }

  }

  public async getWCSigner (senderAddress: string, provider: SubstrateProvider) : Promise<Signer > {
    if(!this.api) return {} ;

    return {
      signPayload : async (payload: SignerPayloadJSON): Promise<SignerResult>  => {
        const args = {} as RequestArguments;

        args.method = 'polkadot_signTransaction';
        args.params = {
          address: senderAddress,
          transactionPayload: payload
        };

        const { signature }  = (await provider.request(args)) as Pick<SignerResult, 'signature'>;
        return { id: 0, signature };
      }
    }
  }

  public async getLedgerSigner ( senderAddress: string, provider: SubstrateProvider) : Promise<Signer> {
    if(!this.api) return {} ;

    return {
      signPayload : async (payload: SignerPayloadJSON): Promise<SignerResult>  => {
        const raw = this.api?.registry.createType('ExtrinsicPayload', payload, { version: payload.version });
        const args = {} as RequestArguments;

        args.method = 'polkadot_sendTransaction';
        args.params = {
          address: senderAddress,
          transactionPayload: raw?.toU8a(true)
        };

        const { signature }   = (await provider.request(args)) as LedgerSignature
        return { id: 0, signature };
      }
    }

  }

  public async getQrSigner ( senderAddress: string, provider: SubstrateProvider, chainId: string) : Promise<Signer> {
    if(!this.api) return {} ;

    return {
      signPayload : async (payload: SignerPayloadJSON): Promise<SignerResult>  => {
        const raw = this.api?.registry.createType('ExtrinsicPayload', payload, { version: payload.version });
        const args = {} as RequestArguments;
        args.method = 'polkadot_sendTransaction';
        const isQrHashed = (payload.method.length > 5000);
        const qrPayload = isQrHashed
          ? blake2AsU8a(raw?.toU8a(true) || '')
          : raw?.toU8a();
        args.params = {
          transactionPayload: qrPayload,
          genesisHash: chainId,
          address: senderAddress
        };
        const { signature }   = (await provider.request(args)) as any
        return { id: 0, signature };
      }
    }

  }

  public async signMessage ( address: string, provider: SubstrateProvider,  signer ?: Signer, genesisHash ?: string ) {
    if(signer && signer.signRaw) {
      const signPromise = signer.signRaw({ address, data: 'This is dummy message', type: 'bytes' });
      return await signPromise
    }
    const args = {} as RequestArguments;

    args.method = SIGN_METHODS.substrateSign.method;
    args.params = [address, SIGN_METHODS.substrateSign.getInput('This is sign message'), genesisHash ];

    await provider.request(args);

  }

}


