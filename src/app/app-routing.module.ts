import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GifSearchComponent } from './gif-search/gif-search.component';

const routes: Routes = [
  { path: '', component: GifSearchComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
