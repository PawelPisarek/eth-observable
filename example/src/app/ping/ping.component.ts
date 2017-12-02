import {Component, OnInit} from '@angular/core';
import {AppState, DeployedAndStaticData, EthObservable} from "../eth-observable/eth-observable.service";
import {MyOwnAccount} from "../app.component";
import {PingDeployed, PingStaticData, PingService} from "./ping.service";

@Component({
  selector: 'app-ping',
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.scss']
})
export class PingComponent implements OnInit {

  ping: DeployedAndStaticData<PingDeployed, PingStaticData, MyOwnAccount>;

  constructor(public _ethObservable: EthObservable, private _pingService: PingService) {
  }

  ngOnInit() {
    this._pingService.ping$.subscribe((data) => {
      this.ping = data;
    });
  }

  initialize(appState: AppState) {
    return this._pingService.initialize(this._ethObservable, this._pingService, appState);
  }

  checkBalance() {
    this._ethObservable.refresh(this._pingService);
  }
}
