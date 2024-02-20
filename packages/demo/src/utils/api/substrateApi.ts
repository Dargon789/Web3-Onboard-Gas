import {ApiPromise, WsProvider} from '@polkadot/api';
import type {Signer, SignerPayloadJSON, SignerResult} from '@polkadot/types/types';
import {SubstrateProvider} from "@subwallet_connect/common";
import web3Onboard from "../../web3-onboard";
import {RequestArguments} from "../../types";
import {SIGN_METHODS} from "../methods";
import {LedgerSignature} from "@polkadot/hw-ledger/types";

export class substrateApi {
  private readonly api ?: ApiPromise;


  constructor (chainEndpoint: string){
    this.api = new ApiPromise({
      provider: new WsProvider(chainEndpoint),
    });
  }

  public async isReady(){
    return this.api?.isReady
  }


  public async sendTransaction (senderAddress: string, recipientAddress: string, signer: Signer | undefined, amount: string ){
    if(!this.api || !this.api.isReady || !signer) return;

    const transferExtrinsic = this.api.tx.balances.transferKeepAlive(recipientAddress, amount)
    try{
      const sendTransaction = async () => {
        let txHash_ = ''
        await transferExtrinsic.signAndSend(senderAddress, { signer }, ({ status, txHash }) => {
          if (status.isInBlock) {
            txHash_ = txHash.toString();
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

  public async getSignerWC (senderAddress: string, provider: SubstrateProvider) : Promise<Signer > {
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

  public async getSignerLedger ( senderAddress: string, provider: SubstrateProvider) : Promise<Signer> {
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

  public async signMessage ( address: string, provider: SubstrateProvider,  signer ?: Signer ) {
    if(signer && signer.signRaw) {
      const signPromise = signer.signRaw({ address, data: 'This is dummy message', type: 'bytes' });
      return await signPromise
    }
    const args = {} as RequestArguments;

    args.method = SIGN_METHODS.substrateSign.method;
    args.params = [address, SIGN_METHODS.substrateSign.getInput('This is sign message')];

    await provider.request(args);

  }

}


