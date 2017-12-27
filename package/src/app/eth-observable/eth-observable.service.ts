import {Injectable} from "@angular/core";
import {default as contract} from "truffle-contract";

import {default as Web3} from "web3";
import {Subject} from "rxjs/Subject";
import {InitializeContract} from "./initialize-contract.interface";
import {ValuesContract} from "./values-contract.interface";
import "rxjs/add/operator/map";

@Injectable()
export class EthObservable {
  web3: Web3;
  private contractSource = new Subject<Map<string, DeployedAndStaticData<any, any, any>>>();
  contract$ = this.contractSource.asObservable();

  private refreshSource = new Subject<string>();
  refresh$ = this.refreshSource.asObservable();

  constructor() {
  }

  createConnection(web: Web3) {
    this.web3 = web;
  }

  getAccounts() {
    return this.refresh$.map(data => {
      return data;
    });
  }

  initialize(data: ContractFunction, app: AppState) {
    const json = contract(data.contractJson);
    json.setProvider(this.web3.currentProvider);
    app.mapAllContractImports.set(data.contractEnum.getUniqueName(), json);
    app.mapAllContractFunction.set(data.contractEnum.getUniqueName(), data);
  }

  refresh(name: InitializeContract<any>) {
    this.refreshSource.next(name.getUniqueName());
  }


  getContract(contract: ContractFunction, app: AppState) {
    app.mapAllContractImports.get(contract.contractEnum.getUniqueName())
      .deployed()
      .then((contractJson: any) =>
        contract.contractValues.getContractValuesPromise(contractJson, this.web3, contract.contractEnum, app.account))
      .then((contractData: ContractValues<any, any>) =>
        new DeployedAndStaticData(contractData.getDeployed(), contractData.getStaticData(), app.account))
      .then((solidityModel: DeployedAndStaticData<any, any, any>) => {
        app.mapAllContract.set(contract.contractEnum.getUniqueName(), solidityModel);
        return this.contractSource.next(app.mapAllContract);
      });
  }
}

export class DeployedAndStaticData<D, SD, YA> {
  constructor(public deployed: D, public staticData: SD, public yoursAccounts: YA) {
  }

  getYourAccount(): YA {
    return this.yoursAccounts;
  }
}


export class ContractFunction {
  constructor(public contractEnum: InitializeContract<any>, public contractValues: ValuesContract<any, any>, public contractJson: TruffleContract) {
  }
}

export interface ContractValues<D, SD> {
  getDeployed(): D;

  getStaticData(): SD;
}

export interface TruffleContract {
  abi;
  address;
}

export interface YoursAccounts<K> {
  getAccounts(): K;
}

export class AppState {
  constructor(public mapAllContractImports: Map<string, any>,
              public mapAllContract: Map<string, any>,
              public mapAllContractFunction: Map<string, ContractFunction>,
              public account: string) {
  }
}
