import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GifSearchComponent } from './gif-search/gif-search.component';
import { GifSearchResultComponent } from './gif-search-result/gif-search-result.component';

@NgModule({
  declarations: [
    AppComponent,
    GifSearchComponent,
    GifSearchResultComponent
  ],
  imports: [
    BrowserModule,
    NgbPaginationModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
