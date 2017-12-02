import {Subject} from "rxjs/Subject";
import "rxjs/add/operator/map";
import {InitializeContract} from "../initialize-contract.interface";
import {AppState, ContractFunction, DeployedAndStaticData, EthObservable} from "../eth-observable.service";
import {ValuesContract} from "../values-contract.interface";


export const refresh = (contractsEnum: InitializeContract<any>, subject: Subject<any>, map: Map<any, any>) => {
  subject.next(map.get(contractsEnum.getUniqueName()));
};
export const initializeContractHelper = (contractFactoryService: EthObservable,
                                         initializeContract: InitializeContract<any>,
                                         contractPromiseInterface: ValuesContract<any, any>,
                                         imports: any,
                                         subject: Subject<any>, app: AppState) => {
  const contractFunction = new ContractFunction(initializeContract, contractPromiseInterface, imports);
  contractFactoryService.initialize(contractFunction, app);
  contractFactoryService.getContract(contractFunction, app);
  return contractFactoryService.contract$.map((name: Map<string, DeployedAndStaticData<any, any, any>>) => {
    refresh(initializeContract, subject, name);
  });
};
export const hideValuesHelper = (array: any[], array2: any[]) => {
  if (array.length !== array2.length) {
    throw Error("method is more than hidden/shows values");
  }
  return array2.map((k, index) => {
    return k ? null : array[index];
  });
}
