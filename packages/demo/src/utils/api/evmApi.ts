import {ethers} from 'ethers'
import type { Web3Provider } from '@ethersproject/providers';
import type { EIP1193Provider } from "@subwallet-connect/common";
import web3Onboard from '../../web3-onboard';
import { RequestArguments } from "../../types";
import { METHOD_MAP, SIGN_METHODS } from "../methods";
import BigNumber from 'bignumber.js'
import type  { TxDetails } from "@subwallet-connect/core/src/types";

export class evmApi {
  private readonly provider ?: Web3Provider;

  constructor (provider: EIP1193Provider){
    this.provider = new ethers.providers.Web3Provider(provider, 'any')
  }

  public async getMaxTransfer (amount: string, senderAddress: string, recipientAddress: string) {
    if(!this.provider) return '0';

    return (await this.provider.getBalance(senderAddress)).toString();
  }

  private async getEstimateGas (txDetails: TxDetails) {
    if(! this.provider) return Promise.resolve('0');

    return  this.provider.estimateGas(txDetails).then((rs) => rs.toString());
  }
  private async getGasPrice () {
    if(! this.provider) return Promise.resolve('0');

    return  this.provider.getGasPrice().then((rs) => rs.toString());
  }



  public async isAvailableAmount ( amount: string, senderAddress: string, recipientAddress: string ) {
    if(!this.provider) return false;
    const txDetails = {
      to: recipientAddress,
      value: amount
    }

    const [ gas, price ] = await Promise.all([
      this.getEstimateGas(txDetails).then(res =>  new BigNumber(res.toString())),
      this.getGasPrice().then(res => new BigNumber(res.toString())),
    ])
    const transactionCost = gas.times(price).plus(amount);
    const balance = new BigNumber(await this.getMaxTransfer(amount, senderAddress, recipientAddress));

    return balance.gt(transactionCost) && balance.gt(new BigNumber(amount));
  }
  public async sendTransaction (senderAddress: string, recipientAddress: string, amount: string ) {
    if(! this.provider) return;

    const signer = this.provider.getSigner(senderAddress);
    const txDetails = {
      to: recipientAddress,
      value: amount
    }
    const sendTransaction = async (fn: (hash: string) => void) => {
      const tx = await signer.sendTransaction(txDetails);
      fn(tx.hash);
      return tx.hash;
    }
    const gasPrice = () => this.getGasPrice();

    const estimateGas = () => this.getEstimateGas(txDetails);


    const balanceValue = await this.getMaxTransfer(amount, senderAddress, recipientAddress)

    // convert to hook when available
    const transactionHash =
      await web3Onboard.state.actions.preflightNotifications({
        sendTransaction,
        gasPrice,
        estimateGas,
        balance: balanceValue,
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
