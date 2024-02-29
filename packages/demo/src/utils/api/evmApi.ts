import {ethers} from 'ethers'
import type {Web3Provider} from '@ethersproject/providers';
import type {EIP1193Provider} from "@subwallet_connect/common";
import web3Onboard from '../../web3-onboard';
import {RequestArguments} from "../../types";
import {METHOD_MAP, SIGN_METHODS} from "../methods";
import BigNumber from 'bignumber.js'

export class evmApi {
  private readonly provider ?: Web3Provider;

  constructor (provider: EIP1193Provider){
    this.provider = new ethers.providers.Web3Provider(provider, 'any')
  }


  public async isAvailableAmount ( amount: string, senderAddress: string, recipientAddress: string ) {
    if(!this.provider) return false;
    const txDetails = {
      to: recipientAddress,
      value: amount
    }

    const [ gas, price, balance ] = await Promise.all([
      this.provider.getGasPrice().then(res => new BigNumber(res.toString())),
      this.provider.estimateGas(txDetails).then(res =>  new BigNumber(res.toString())),
      this.provider.getBalance(senderAddress)
    ])
    const transactionCost = gas.times(price).plus(amount);

    return new BigNumber(balance.toString()).gt(transactionCost);
  }
  public async sendTransaction (senderAddress: string, recipientAddress: string, amount: string ) {
    if(! this.provider) return;

    const signer = this.provider.getUncheckedSigner();
    const txDetails = {
      to: recipientAddress,
      value: amount
    }
    const sendTransaction = async (fn: (hash: string) => void) => {
      const tx = await signer.sendTransaction(txDetails);
      fn(tx.hash);
      return tx.hash;
    }

    return await web3Onboard.state.actions.preflightNotifications({
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
