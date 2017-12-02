
import {Observable} from "rxjs/Observable";
import {AppState, EthObservable} from "./eth-observable.service";

export interface InitializeContract<K> {
  initialize(contractFactoryService: EthObservable, contractsEnum: InitializeContract<K>, app: AppState): Observable<any>;
  getUniqueName(): K;
  hideValues(array: any[]): any[];
}
