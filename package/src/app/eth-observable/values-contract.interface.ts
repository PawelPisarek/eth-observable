import {default as Web3} from "web3";
import {InitializeContract} from "./initialize-contract.interface";
import {ContractValues} from "./eth-observable.service";

export interface ValuesContract<D, SD> {
  getContractValuesPromise(deployed: D, web3: Web3, hideVal: InitializeContract<any>, account: string): Promise<ContractValues<D, SD>>;
}
