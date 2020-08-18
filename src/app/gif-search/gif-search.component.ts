import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, filter, catchError } from 'rxjs/operators';
import { GIFObject, MultiResponse as GiphyResponse } from 'giphy-api';
import { GiphySearchService } from '../shared/giphy-search.service';
import { BadWordsFilterService } from '../shared/bad-words-filter.service';
import constants from '../shared/constants';

@Component({
  selector: 'app-gif-search',
  templateUrl: './gif-search.component.html',
  styleUrls: ['./gif-search.component.scss']
})
export class GifSearchComponent implements OnInit, OnDestroy {
  public isLoading: boolean;
  public searchResults: GIFObject[];
  public searchResultsMeta: GiphyResponse['pagination'] & { page: number };
  public searchResultsPerPage = constants.searchResultsPerPage;
  public currentSearchTerm: string;
  public error: string;
  private searchTermChanged = new Subject<string>();
  private pageChanged = new Subject<number>();
  private subscriptions: Subscription[] = [];

  constructor(
    private giphySearchSvc: GiphySearchService,
    private badWordsFilterSvc: BadWordsFilterService
  ) { }

  ngOnInit(): void {
    const $searchTermChangedSubscription = this.searchTermChanged
      .pipe(
        distinctUntilChanged(),
        tap(searchTerm => {
          this.currentSearchTerm = searchTerm;
          this.error = undefined;
        }),
        filter(searchTerm => !!searchTerm),
        // this tap is again before the debounce so it gives the user the impression of faster speed
        tap(() => this.isLoading = true),
        debounceTime(constants.apiDebounceTime),
        filter(searchTerm => !this.badWordsFilterSvc.isProfane(searchTerm)),
        switchMap(searchTerm => this.searchGifs(searchTerm, 1))
      )
      .subscribe(results => this.renderSearchResults(results), e => this.showError(e));

    const $pageChangedSubscription = this.pageChanged
      .pipe(
        distinctUntilChanged(),
        switchMap(page => this.searchGifs(this.currentSearchTerm, page))
      )
      .subscribe(results => this.renderSearchResults(results), e => this.showError(e));

    this.subscriptions.push($searchTermChangedSubscription, $pageChangedSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach(s$ => s$.unsubscribe());
    this.subscriptions = [];
  }

  searchGifs(searchTerm: string, searchPage: number): Observable<GiphyResponse> {
    return of({ searchTerm, searchPage })
      .pipe(
        tap(() => this.isLoading = true),
        switchMap(searchParams => this.giphySearchSvc.search(searchParams.searchTerm, searchParams.searchPage)),
        tap(() => this.isLoading = false),
        catchError(err => this.showError(err) && of({ data: [], pagination: {} } as GiphyResponse))
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

  showError(e): true {
    this.error = e.message || e;
    return true;
  }

  searchInputChanged(description: string): void {
    this.searchTermChanged.next(description);
  }

  changePage(page: number): void {
    this.pageChanged.next(page);
  }

}
