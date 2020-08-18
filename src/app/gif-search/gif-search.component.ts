import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, filter, map } from 'rxjs/operators';
import { GIFObject, MultiResponse as GiphyResponse } from 'giphy-api';
import { GiphySearchService } from '../shared/giphy-search.service';
import { BadWordsFilterService } from '../shared/bad-words-filter.service';
import constants from '../shared/constants';

@Component({
  selector: 'app-gif-search',
  templateUrl: './gif-search.component.html',
  styleUrls: ['./gif-search.component.scss']
})
export class GifSearchComponent implements OnInit {
  public isLoading: boolean;
  public searchResults: GIFObject[];
  public searchResultsMeta: GiphyResponse['pagination'] & { page: number };
  public searchResultsPerPage = constants.searchResultsPerPage;
  public currentSearchTerm: string;
  private searchTermChanged = new Subject<string>();
  private pageChanged = new Subject<number>();

  constructor(
    private giphySearchSvc: GiphySearchService,
    private badWordsFilterSvc: BadWordsFilterService
  ) { }

  ngOnInit(): void {
    // TODO: unsubscribe
    // this.subscriptions.push()
    this.searchTermChanged
      .pipe(
        distinctUntilChanged(),
        tap(searchTerm => this.currentSearchTerm = searchTerm),
        filter(searchTerm => !!searchTerm),
        debounceTime(constants.apiDebounceTime),
        filter(searchTerm => !this.badWordsFilterSvc.isProfane(searchTerm)),
        switchMap(searchTerm => this.searchGifs(searchTerm, 1))
      )
      .subscribe(results => this.renderSearchResults(results), e => this.showError(e));

    this.pageChanged
      .pipe(
        distinctUntilChanged(),
        switchMap(page => this.searchGifs(this.currentSearchTerm, page))
      )
      .subscribe(results => this.renderSearchResults(results), e => this.showError(e));
  }

  searchGifs(searchTerm: string, searchPage: number): Observable<GiphyResponse> {
    return of({ searchTerm, searchPage })
      .pipe(
        tap(() => this.isLoading = true),
        switchMap(searchParams => this.giphySearchSvc.search(searchParams.searchTerm, searchParams.searchPage)),
        tap(() => this.isLoading = false)
      );
  }

  renderSearchResults(results: GiphyResponse): void {
    this.searchResults = results.data;
    this.searchResultsMeta = {
      ...results.pagination,
      page: 1
    };

    // Giphy is limiting beta keys to an offset of up to 5000, so only first 5000 results will be shown for now
    // 4 years after the change, they still didn't add it to the documentation - https://github.com/Giphy/GiphyAPI/issues/88
    if (this.searchResultsMeta.total_count >= 5000) {
      this.searchResultsMeta.total_count = 5000;
    }
  }

  // TODO: show error in the template
  showError(e): void {
    console.log('reflect error in the template');
    throw e;
  }

  searchInputChanged(description: string): void {
    this.searchTermChanged.next(description);
  }

  changePage(page: number): void {
    this.pageChanged.next(page);
  }

}
