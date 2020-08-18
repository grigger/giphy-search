import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, filter } from 'rxjs/operators';
import { GiphySearchService } from '../shared/giphy-search.service';
import { GIFObject, MultiResponse as GiphyResponse } from 'giphy-api';
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
    private giphySearchSvc: GiphySearchService
  ) { }

  ngOnInit(): void {
    // TODO: unsubscribe
    // this.subscriptions.push()
    this.searchTermChanged
      .pipe(
        distinctUntilChanged(),
        // filtru swear words
        tap(searchTerm => this.currentSearchTerm = searchTerm),
        debounceTime(constants.apiDebounceTime),
        switchMap(searchTerm => this.searchGifs(searchTerm, 1))
      )
      .subscribe(results => this.renderSearchResults(results), () => this.showError());

    this.pageChanged
      .pipe(
        distinctUntilChanged(),
        switchMap(page => this.searchGifs(this.currentSearchTerm, page))
      )
      .subscribe(results => this.renderSearchResults(results), () => this.showError());
  }

  searchGifs(searchTerm: string, searchPage: number): Observable<GiphyResponse> {
    return of({ searchTerm, searchPage })
      .pipe(
        filter(searchParams => !!searchParams.searchTerm),
        // do a min char filter here or something like this;
        // better than to base it on isLoading going from undefined to false in the template
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
  showError(): void {
    console.log('reflect error in the template');
  }

  searchInputChanged(description: string): void {
    this.searchTermChanged.next(description);
  }

  changePage(page: number): void {
    this.pageChanged.next(page);
  }

}
