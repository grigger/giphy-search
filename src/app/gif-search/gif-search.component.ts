import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { GiphySearchService } from '../shared/giphy-search.service';

@Component({
  selector: 'app-gif-search',
  templateUrl: './gif-search.component.html',
  styleUrls: ['./gif-search.component.scss']
})
export class GifSearchComponent implements OnInit {
  public isLoading = false;
  private searchTextChanged = new Subject<string>();

  constructor(
    // private formBuilder: FormBuilder,
    private giphySearchSvc: GiphySearchService
  ) { }

  ngOnInit(): void {
    this.searchTextChanged
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(searchTerm => this.giphySearchSvc.search(searchTerm))
      )
      .subscribe(
        result => {
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
