# eth-observable

Wraper to _web3_ to instatly reload data from _smart contract_ :tada:


# Installation

`npm install eth-observable --save`

# Example:
https://github.com/PawelPisarek/truffle-angular-starter

## 1. Create enum to represent smartcontract data. Every smartcontract service has own enum
```
export enum ContractEnum {
  PING, PONG
}
```

## 2 Create staticData, deployed interface and ContractValues class
### eg PongStaticData, PongDeployed, PongContract
```
export class PongStaticData {
  constructor(public pongval: string, public creator: string) {
  }
}
export interface PongDeployed extends TruffleContract {
  pongval
  getAddress;
  getPongvalTransactional()
  getPongvalConstant()
  setPongval(_pongval, from)
  getPongvalTxRetrievalAttempted()
  kill()
}

export class PongContract implements ContractValues<PongDeployed, PongStaticData> {

  constructor(public deployed: PongDeployed, public contract: PongStaticData) {
  }

  getDeployed(): PongDeployed {
    return this.deployed;
  }

  getStaticData(): PongStaticData {
    return this.contract;
  }
}
```


##  3. Create service to manage smart contract
```
import {default as Web3} from "web3";
import {InitializeContract, DeployedAndStaticData, ValuesContract, EthObservable, initializeContractHelper,
  hideValuesHelper,
  AppState,
  ContractValues, TruffleContract} from "eth-observable";
import * as pong_artifacts from "../../../build/contracts/Pong.json";

@Injectable()
export class PongService implements InitializeContract<ContractEnum>, ValuesContract<PongDeployed, PongStaticData> {
  private pongSource = new Subject<DeployedAndStaticData<PongDeployed, PongStaticData, string>>();
  pong$ = this.pongSource.asObservable();
  public dependsOnModifier = [true, true];

  constructor() {
  }

  getUniqueName(): ContractEnum {
    return ContractEnum.PONG;
  }

  initialize(contractFactoryService: EthObservable, contractsEnum: InitializeContract<ContractEnum>, app: AppState): Observable<any> {
    return initializeContractHelper(contractFactoryService, this, this, pong_artifacts, this.pongSource, app);
  }

  hideValues(array: any[]): any[] {
    return hideValuesHelper(array, this.dependsOnModifier);
  }

  getContractValuesPromise(deployed: PongDeployed, web3: Web3, hideVal: InitializeContract<any>): Promise<ContractValues<PongDeployed, PongStaticData>> {
    const values = [deployed.pongval, deployed.getAddress.call()];
    return Promise.all(hideVal.hideValues(values))
      .then(data => {
        return new PongContract(deployed, new PongStaticData(data[0], data[1]));
      });
  }
}
```

## 4. Enjoy observable data from smart contract
```
 export class ContractSenderComponent implements OnInit {
  pong: DeployedAndStaticData<PongDeployed, PongStaticData, string>;
  amount: number;

  constructor(public _ethObservable: EthObservable, private _pongService: PongService) {
  }

  ngOnInit() {
    this._pongService.pong$.subscribe((data) => {
      this.pong = data;
    });
  }

  onSubmit() {
    this.pong.deployed.setPongval(this.amount, {from: this.pong.yoursAccounts});
    this._ethObservable.refresh(this._pongService);
  }

  initialize(appState: AppState) {
    return this._pongService.initialize(this._ethObservable, this._pongService, appState);
  }
}

```

## 5. Initialize all data
```
export class AppComponent {
    this._ethObservable.createConnection(new Web3(new Web3.providers.HttpProvider('http://localhost:8545')));
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
      this.ping.initialize(appState).subscribe();
      this.pong.initialize(appState).subscribe();
    });
  }
}
```

```
{{ ping?.staticData.address  }}
```


