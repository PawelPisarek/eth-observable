import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {EthObservable} from "./eth-observable.service";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [EthObservable],
  declarations: []
})
export class EthObservableModule {
}
