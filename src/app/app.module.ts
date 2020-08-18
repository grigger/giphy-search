import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GifSearchComponent } from './gif-search/gif-search.component';
import { GifSearchResultComponent } from './gif-search-result/gif-search-result.component';
import { BadWordsFilterPipe } from './shared/bad-words-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    GifSearchComponent,
    GifSearchResultComponent,
    BadWordsFilterPipe
  ],
  imports: [
    BrowserModule,
    NgbPaginationModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
