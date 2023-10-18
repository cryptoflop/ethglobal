import { writable } from 'svelte/store'
import {
  ComethProvider,
  ComethWallet,
  ConnectAdaptor,
  SupportedNetworks
} from '@cometh/connect-sdk';
import { cachedStore } from '../helpers/reactivity-helpers';
import { type BigNumberish, Contract, providers, utils, ethers } from "ethers"
import {sDAIabi} from '../shared/abis/sDAIabi'

enum PoolToken {
  EURe,
  wxDAI,
  USDC
}

export function createFauxBackendCtx() {

  let walletAdaptor: ConnectAdaptor;
  let walletInstance: ComethWallet;
  let sDAIMainnetContract = '0x83F20F44975D03b1b09e64809B757c47f942BEeA';
  let sDAIChiadoContract = '0x20e5eB701E8d711D419D444814308f8c2243461F';
  let provider: ComethProvider;
  let localStorageAddress: any;

  const ctx = {
    
    address: cachedStore(writable<string | null>(null)),
    
		async createAccount() {
      
      walletAdaptor = new ConnectAdaptor({
        chainId: SupportedNetworks.CHIADO,
				apiKey: import.meta.env.VITE_COMMETH_CHIADO,
			});
			
			walletInstance = await new ComethWallet({
        authAdapter: walletAdaptor,
				apiKey: import.meta.env.VITE_COMMETH_CHIADO,
        rpcUrl: import.meta.env.VITE_RPC_GNOSIS,
			});
      
      
		},

    async createWallet() {
        
      localStorageAddress = window.localStorage.getItem("walletAddress");
  
        if (localStorageAddress) {
        await walletInstance.connect(localStorageAddress);
        } else {
        await walletInstance.connect();
        const walletAddress = await walletInstance.getAddress();
        console.log(walletAddress);
        // window.localStorage.setItem("walletAddress", walletAddress);
        }
    },
    
		async swap(tokenIn: PoolToken, tokenOut: PoolToken, amountIn: BigNumberish) {
			// TODO: not finished
			const erc20 = new Contract("", ["function approve(address, uint256)", "function balanceOf(address) returns(uint256)"]);
			const tx = await erc20.populateTransaction.balanceOf("")

			walletInstance.sendTransaction({ to: tx.to!, data: tx.data!, value: (tx.value ?? 0).toString() })
		},

    async testTransaction() {
      const USER = await walletInstance.getAddress();

      provider = new ComethProvider(walletInstance);

      // const sDAIContract = new Contract(sDAIChiadoContract, "approve(address, uint256)") // get contract
      // const encodedData = await sDAIContract.populateTransaction.approve(USER, 123); //encoded functioncall
      
      const sDAIiFace = new ethers.utils.Interface(sDAIabi)
      const data = sDAIiFace.encodeFunctionData("approve", [USER, 123]) ;

      const txValues =  {
        to: sDAIChiadoContract, //deposit xDAI for sDAI
        data: data, // Calldata
        value: "0x00", //User Input
      };

      const tx = await walletInstance.sendTransaction(txValues);
      const txPending = await provider.getTransaction(tx.safeTxHash);
      await txPending.wait();
    },
   

    async stakeSDAI(amount: number) {
      const value = amount;
      const USER = localStorageAddress;

      provider = new ComethProvider(walletInstance);
      
      //TODO 
      // EURe curve swap to WxDAI
      const encoder = new ethers.utils.Interface(sDAIabi) // get contract
      const encodedApprove = encoder.encodeFunctionData('approve', [USER, value]) //encoded functioncall
      const encodedDeposit = encoder.encodeFunctionData('deposit', [USER, value]) //encoded functioncall
      //TODO - Check the values of these tx and format correctly

      const txValues =  [{
        //Approve function call
        to: sDAIMainnetContract, 
        data: encodedApprove, // Calldata
        value: "0x00", //User Input
      },
      { //deposit function call
        to: sDAIMainnetContract, //deposit xDAI for sDAI
        data: encodedDeposit, // Calldata
        value: "0x00", //User Input
      },]
    
      
      const tx = await walletInstance.sendBatchTransactions(txValues);
      const txPending = await provider.getTransaction(tx.safeTxHash);
      await txPending.wait();
    },

  
    async unstakeSDAI(amount:number) {
      const value = amount;
      const USER = localStorageAddress;
      provider = new ComethProvider(walletInstance);
      
      const encoder = new ethers.utils.Interface(sDAIabi) // get contract
      const encodedApprove = encoder.encodeFunctionData('approve', [USER, value]) //encoded functioncall
      const encodedDeposit = encoder.encodeFunctionData('deposit', [USER, value]) //encoded functioncall
      //TODO - Check the values of these tx and format correctly

      const txValues =  [{
        //Approve function call
        to: sDAIMainnetContract, 
        data: encodedApprove, // Calldata
        value: "0x00", //User Input
      },
      { //deposit function call
        to: sDAIMainnetContract, //deposit xDAI for sDAI
        data: encodedDeposit, // Calldata
        value: "0x00", //User Input
      },]
      
      const tx = await walletInstance.sendBatchTransactions(txValues);
      const txPending = await provider.getTransaction(tx.safeTxHash);
      await txPending.wait();
  },
  async stakeUSDC (amount:number) {
    const value = amount;
    const USER = localStorageAddress;
    provider = new ComethProvider(walletInstance);
    
    const encoder = new ethers.utils.Interface(sDAIabi) // get contract
    const encodedApprove = encoder.encodeFunctionData('approve', [USER, value]) //encoded functioncall
    const encodedDeposit = encoder.encodeFunctionData('deposit', [USER, value]) //encoded functioncall
    //TODO - Check the values of these tx and format correctly

    const txValues =  [{
      //Approve function call
      to: sDAIMainnetContract, 
      data: encodedApprove, // Calldata
      value: "0x00", //User Input
    },
    { //deposit function call
      to: sDAIMainnetContract, //deposit xDAI for sDAI
      data: encodedDeposit, // Calldata
      value: "0x00", //User Input
    },]
    
    const tx = await walletInstance.sendBatchTransactions(txValues);
    const txPending = await provider.getTransaction(tx.safeTxHash);
    await txPending.wait();
},

    async makeSwapAndDeposit() {
      provider = new ComethProvider(walletInstance);
      const txValues = [{
        to: "targetAddress2", //make a swap to ETH to xDAI(if we build it with EURe)
        value: "0x00", //User Input
        data: "0x", //Calldata of the tx
      }, {
        to: sDAIMainnetContract, //deposit xDAI for sDAI
        value: "0x00", //User Input
        data: "0x", //
      }];
           

      const txBatch = await walletInstance.sendBatchTransactions(txValues);
      const txPending = await provider.getTransaction(txBatch.safeTxHash);
      await txPending.wait();
    },
  
  }
  return ctx
}