import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { GiphySearchService } from '../shared/giphy-search.service';
import { GIFObject, MultiResponse as GiphyResponse } from 'giphy-api';
import constants from '../shared/constants';

@Component({
  selector: 'app-gif-search',
  templateUrl: './gif-search.component.html',
  styleUrls: ['./gif-search.component.scss']
})
export class GifSearchComponent implements OnInit {
  public isLoading = false;
  public searchResults: GIFObject[];
  public searchResultsMeta: GiphyResponse['pagination'];
  private searchTextChanged = new Subject<string>();

  constructor(
    private giphySearchSvc: GiphySearchService
  ) { }

  ngOnInit(): void {
    this.searchTextChanged
      .pipe(
        distinctUntilChanged(),
        tap(() => this.isLoading = true),
        debounceTime(constants.apiDebounceTime),
        switchMap(searchTerm => this.giphySearchSvc.search(searchTerm, 1)),
        tap(() => this.isLoading = false)
      )
      .subscribe(
        result => {
          this.searchResults = result.data;
          this.searchResultsMeta = result.pagination;
          // ^ mai bine fa this.pagination ... ca sa calculezi 140 out of 160 iti trebuie si offset ... count + offset

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
