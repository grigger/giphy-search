import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { GiphySearchService } from '../shared/giphy-search.service';
import { GIFObject } from 'giphy-api';
import Constants from '../shared/constants';

@Component({
  selector: 'app-gif-search',
  templateUrl: './gif-search.component.html',
  styleUrls: ['./gif-search.component.scss']
})
export class GifSearchComponent implements OnInit {
  public isLoading = false;
  public searchResults: GIFObject[];
  private searchTextChanged = new Subject<string>();

  constructor(
    private giphySearchSvc: GiphySearchService
  ) { }

  ngOnInit(): void {
    this.searchTextChanged
      .pipe(
        distinctUntilChanged(),
        tap(() => this.isLoading = true),
        debounceTime(Constants.apiDebounceTime),
        switchMap(searchTerm => this.giphySearchSvc.search(searchTerm)),
        tap(() => this.isLoading = false)
      )
      .subscribe(
        result => {
          this.searchResults = result.data;
          // pagination
          console.log('result', result);
        },
        err => {
          console.log('reflect error in the template');
        }
      );
  }

  searchGif(description: string): void {
    this.searchTextChanged.next(description);
  }

}
