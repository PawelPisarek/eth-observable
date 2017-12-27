import {Component, ViewChild} from '@angular/core';
import {AppState, EthObservable, YoursAccounts} from "./eth-observable/eth-observable.service";
import {default as Web3} from "web3";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  accounts: number[];
  account: number;
  constructor(private _ethObservable: EthObservable) {
  }

  ngOnInit(): void {
    this._ethObservable.createConnection(new Web3(new Web3.providers.HttpProvider('http://localhost:9545')));
    new Promise(res => {
      this._ethObservable.web3.eth.getAccounts((err, accs) => {
        if (err != null) {
          alert("There was an error fetching your accounts.");
          return;
        }
        if (accs.length === 0) {
          alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
          return;
        }
        this.accounts = accs;
        this.account = this.accounts[0];
        console.dir(this.accounts);
        return res(this.account);
      });
    }).then((k: string) => {
      const appState = new AppState(new Map(), new Map(), new Map(), k);
      this._ethObservable.getAccounts()
        .map(contractEnum => {
          this._ethObservable.getContract(appState.mapAllContractFunction.get(contractEnum), appState);
          return contractEnum;
        })
        .subscribe();
    });
  }
}

export enum ContractEnum {
  PING, PONG
}

