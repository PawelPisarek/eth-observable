# eth-observable

##  1. Create service to manage smart contract

```
import {InitializeContract, DeployedAndStaticData, ValuesContract, EthObservable, initializeContractHelper,
  hideValuesHelper,
  AppState,
  ContractValues, TruffleContract} from "eth-observable";
import * as pong_artifacts from "../../../build/contracts/Pong.json";

@Injectable()
export class PongService implements InitializeContract<ContractEnum>, ValuesContract<PongDeployed, PongStaticData> {
  private pongSource = new Subject<DeployedAndStaticData<PongDeployed, PongStaticData, MyOwnAccount>>();
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
## 2. Create class to data from web3 
### eg. accounts
```
export class MyOwnAccount implements YoursAccounts<number> {

  constructor(public accounts: number) {
  }

  getAccounts(): any {
    return this.accounts;
  }
}

```

## 3. Create enum to represent refresh smartcontract data. Every smartcontract service has own enum
```
export enum ContractEnum {
  PING, PONG
}
```


## 4. Resolve first time promise
```
export class AppComponent {
  accounts: number[];
  account: number;
  @ViewChild(ContractCheckerComponent) ping: ContractCheckerComponent;
  @ViewChild(ContractSenderComponent) pong: ContractSenderComponent;

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
    }).then((k: number) => {
      const appState = new AppState(new Map(), new Map(), new Map(), new MyOwnAccount(k));
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

## 5. Enjoy observable data from smart contract
```
 export class ContractSenderComponent implements OnInit {
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

```
```
{{ pong?.deployed.address}}
```


