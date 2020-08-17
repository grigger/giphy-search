import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {GIFObject, MultiResponse} from 'giphy-api';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment' ;
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GiphySearchService {
  private giphyApiUrl = 'https://api.giphy.com/v1/gifs/search';

  constructor(
    private http: HttpClient
  ) { }

  search(term: string): Observable<MultiResponse> {
    return this.http
      .get<MultiResponse>(this.giphyApiUrl, {
        params: {
          api_key: environment.giphyApiKey,
          q: term,
          limit: '20',
          offset: '0',
          rating: 'g'
        }
      });
      // .pipe(
      //   map(
      //     response => response.data
      //   )
      // );
  }
}
