import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PingComponent} from "../ping/ping.component";
import {EthObservableModule} from "../eth-observable/eth-observable.module";
import {PingService} from "../ping/ping.service";
import {PongComponent} from "../pong/pong.component";
import {PongService} from "../pong/pong.service";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EthObservableModule
  ],
  providers: [PingService, PongService],
  declarations: [PingComponent, PongComponent],
  exports: [PingComponent, PongComponent]
})
export class ContractModuleModule {
}
