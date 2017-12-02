import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {default as Web3} from "web3";
import * as ping_artifacts from "../../../build/contracts/Ping.json";
import {ContractEnum, MyOwnAccount} from "../app.component";
import {InitializeContract} from "../eth-observable/initialize-contract.interface";
import {
  AppState, ContractValues, DeployedAndStaticData, EthObservable,
  TruffleContract
} from "../eth-observable/eth-observable.service";
import {Subject} from "rxjs/Subject";
import {ValuesContract} from "../eth-observable/values-contract.interface";
import {hideValuesHelper, initializeContractHelper} from "../eth-observable/utils/utils";


@Injectable()
export class PingService implements InitializeContract<ContractEnum>, ValuesContract<PingDeployed, PingStaticData> {
  private pingSource = new Subject<DeployedAndStaticData<PingDeployed, PingStaticData, MyOwnAccount>>();
  ping$ = this.pingSource.asObservable();

  public dependsOnModifier = [false, false];

  constructor() {
  }


  getUniqueName(): ContractEnum {
    return ContractEnum.PING;
  }


  initialize(contractFactoryService: EthObservable, contractsEnum: InitializeContract<ContractEnum>, app: AppState): Observable<any> {
    return initializeContractHelper(contractFactoryService, this, this, ping_artifacts, this.pingSource, app);
  }

  hideValues(array: any[]): any[] {
    return hideValuesHelper(array, this.dependsOnModifier);
  }


  getContractValuesPromise(deployed: PingDeployed, web3: Web3, hideVal: InitializeContract<any>): Promise<ContractValues<PingDeployed, PingStaticData>> {
    const values = [deployed.getPongvalRemote(), deployed.getPongAddress()];
    return Promise.all(hideVal.hideValues(values))
      .then(data => {
        return new PingContract(deployed, new PingStaticData(data[0].toNumber(), data[1]));
      });
  }
}


export interface PingDeployed extends TruffleContract {
  getPongvalRemote()
  getPongvalConstant();

  setPongAddress(_pongAddress, from)

  getPongAddress()

  getAddress()
  kill()
}

export class PingStaticData {
  constructor(public pongval: string, public address: string) {
  }
}

export class PingContract implements ContractValues<PingDeployed, PingStaticData> {

  constructor(public deployed: PingDeployed, public contract: PingStaticData) {
  }

  getDeployed(): PingDeployed {
    return this.deployed;
  }

  getStaticData(): PingStaticData {
    return this.contract;
  }
}
