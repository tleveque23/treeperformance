import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { TreeModule } from 'primeng/tree';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
