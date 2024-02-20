import { BigNumber, ethers } from 'ethers'
import type { Web3Provider } from '@ethersproject/providers';
import type { EIP1193Provider } from "@subwallet_connect/common";
import web3Onboard from '../../web3-onboard';
import {RequestArguments} from "../../types";
import {METHOD_MAP, SIGN_METHODS} from "../methods";



export class evmApi {
  private readonly provider ?: Web3Provider;

  constructor (provider: EIP1193Provider){
    this.provider = new ethers.providers.Web3Provider(provider, 'any')
  }

  public async sendTransaction (senderAddress: string, recipientAddress: string, amount: string ) {
    if(! this.provider) return;

    const signer = this.provider.getUncheckedSigner();
    const txDetails = {
      to: recipientAddress,
      value: amount
    }

    const sendTransaction = async () => {
      const tx = await signer.sendTransaction(txDetails);
      return tx.hash;
    }

    const transactionHash =
      await web3Onboard.state.actions.preflightNotifications({
        sendTransaction,
        txDetails: txDetails
      })
  }


  public async signMessage( recipientAddress: string ) {
    const from = recipientAddress;
    const args = {} as RequestArguments;

    args.method = SIGN_METHODS.personalSign.method;
    args.params = [SIGN_METHODS.personalSign.getInput('This is personal sign message'), from];

    const signature = await this.provider?.send(args.method, args.params as any[]);
    console.log('Personal Sign', signature);

    return signature

  }

  public async requestPermissions () {
    const args = METHOD_MAP['requestPermissions']
      return await this.provider?.send(args.method, args.params as any[]);
  }

}
