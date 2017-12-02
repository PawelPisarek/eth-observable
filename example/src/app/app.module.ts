import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {AppComponent} from "./app.component";
import {ContractModuleModule} from "./contract-module/contract-module.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ContractModuleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
