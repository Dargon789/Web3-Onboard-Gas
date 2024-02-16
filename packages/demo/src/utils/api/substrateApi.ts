import { ApiPromise, WsProvider } from '@polkadot/api';
import type { Signer } from '@polkadot/types/types';
import { BehaviorSubject } from "rxjs";
import { SubstrateProvider } from "@subwallet_connect/common";
import web3Onboard from "../../web3-onboard";
import {RequestArguments} from "../../types";
import {SIGN_METHODS} from "../methods";

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

  public async sendTransaction (senderAddress: string, recipientAddress: string, amount: string, provider: SubstrateProvider, signer?: Signer ) {
    if(signer) {
      return await this.sendTransactionBySigner(senderAddress, recipientAddress, signer, amount)
    }

    return await this.sendTransactionByProvider(senderAddress, recipientAddress, provider, amount)
  }

  private async sendTransactionBySigner (senderAddress: string, recipientAddress: string, signer: Signer, amount: string ){
    if(!this.api || !this.api.isReady) return;

    const transferExtrinsic = this.api.tx.balances.transferKeepAlive(recipientAddress, amount)

    try{
      const sendTransaction = async () => {
        let txHash_  = '';
         await transferExtrinsic.signAndSend(senderAddress, { signer }, ({ status, txHash }) => {
          if (status.isInBlock) {
            txHash_ = txHash.toString();
            console.log(`Completed at block hash #${status.asInBlock.toString()}`);
          } else {
            console.log(`Current status: ${status.type}`);
          }
        })
        return txHash_
      }
        const txDetails = {
          to: recipientAddress,
          value: amount
        }

         const transactionHash =
           await web3Onboard.state.actions.preflightNotifications({
             sendTransaction,
             txDetails: txDetails
           })
         console.log(transactionHash)
       } catch (e) {
      console.log(':( transaction failed', e);
    }

  }


  private async sendTransactionByProvider (senderAddress: string, recipientAddress: string, provider: SubstrateProvider, amount: string) {
    if(!this.api) return;

    const lastHeader = await this.api.rpc.chain.getHeader()
    const blockNumber = this.api.registry.createType('BlockNumber', lastHeader.number.toNumber())
    const tx = this.api.tx.balances.transferKeepAlive(recipientAddress, amount)



    const method = this.api.createType('Call', tx)
    const era = this.api.registry.createType('ExtrinsicEra', {
      current: lastHeader.number.toNumber(),
      period: 64
    })

    const accountNonce =  0
    const nonce = this.api.registry.createType('Compact<Index>', accountNonce)

    const unsignedTransaction = {
      specVersion: this.api.runtimeVersion.specVersion.toHex(),
      transactionVersion: this.api.runtimeVersion.transactionVersion.toHex(),
      address: senderAddress,
      blockHash: lastHeader.hash.toHex(),
      blockNumber: blockNumber.toHex(),
      era: era.toHex(),
      genesisHash: this.api.genesisHash.toHex(),
      method: method.toHex(),
      nonce: nonce.toHex(),
      signedExtensions: [
        'CheckNonZeroSender',
        'CheckSpecVersion',
        'CheckTxVersion',
        'CheckGenesis',
        'CheckMortality',
        'CheckNonce',
        'CheckWeight',
        'ChargeTransactionPayment'
      ],
      tip: this.api.registry.createType('Compact<Balance>', 0).toHex(),
      version: tx.version
    }

    const args = {} as RequestArguments;

    args.method = 'polkadot_sendTransaction';
    args.params = {
      address: senderAddress,
      transactionPayload: unsignedTransaction
    };

    try {
      await provider.request(args)
    }catch (e) {
      console.log(e);
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



