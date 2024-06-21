import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoaderComponent } from './common-component/loader/loader.component';
import { sharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpService } from './core/service/http/http.service';



@NgModule({
  declarations: [AppComponent, LoaderComponent],
  imports: [BrowserModule, AppRoutingModule, sharedModule, BrowserAnimationsModule],
  exports: [],
  bootstrap: [AppComponent],
  providers: [
    HttpService,
  ],
})
export class AppModule {}
