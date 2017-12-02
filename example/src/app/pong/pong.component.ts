import {Component, OnInit} from '@angular/core';
import {AppState, DeployedAndStaticData, EthObservable} from "../eth-observable/eth-observable.service";
import {MyOwnAccount} from "../app.component";
import {PongDeployed, PongService, PongStaticData} from "./pong.service";

@Component({
  selector: 'app-pong',
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.scss']
})
export class PongComponent implements OnInit {

  pong: DeployedAndStaticData<PongDeployed, PongStaticData, MyOwnAccount>;
  amount: number;

  constructor(public _ethObservable: EthObservable, private _pongService: PongService) {
  }

  ngOnInit() {
    this._pongService.pong$.subscribe((data) => {
      this.pong = data;
    });
  }

  onSubmit() {
    this.pong.deployed.setPongval(this.amount, {from: this.pong.yoursAccounts.getAccounts()});
    this._ethObservable.refresh(this._pongService);
  }


  initialize(appState: AppState) {
    return this._pongService.initialize(this._ethObservable, this._pongService, appState);
  }

}
