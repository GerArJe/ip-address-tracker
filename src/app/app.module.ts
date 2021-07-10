import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { IpifyService } from './services/ipify.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, MapComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  providers: [IpifyService],
  bootstrap: [AppComponent],
})
export class AppModule {}
