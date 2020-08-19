import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { MultiResponse as GiphyResponse } from 'giphy-api';
import { GiphySearchService } from './giphy-search.service';
import { environment } from '../../environments/environment';
import constants from '../shared/constants';

describe('GiphySearchService', () => {
  const giphyApiUrl = 'https://api.giphy.com/v1/gifs/search';
  let service: GiphySearchService;
  let httpSpy: { get: jasmine.Spy };

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new GiphySearchService(httpSpy as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the Giphy api just once', () => {
    service.search('test', 1);
    expect(httpSpy.get.calls.count()).toBe(1);
    expect(httpSpy.get.calls.first().args[0]).toEqual(giphyApiUrl);
  });

  it('should use the environment key', () => {
    service.search('test', 1);
    expect(httpSpy.get.calls.first().args[1].params.api_key).toEqual(environment.giphyApiKey);
  });

  it('should send the proper search term', () => {
    const term = 'testTerm';
    service.search(term, 1);
    expect(httpSpy.get.calls.first().args[1].params.q).toEqual(term);
  });

  it('should send the g rating', () => {
    service.search('test', 1);
    expect(httpSpy.get.calls.first().args[1].params.rating).toEqual('g');
  });

  it('should send the limit set in constants', () => {
    service.search('test', 1);
    expect(httpSpy.get.calls.first().args[1].params.limit).toEqual(constants.searchResultsPerPage.toString());
  });

  it('should calculate the offset based on the page', () => {
    const testPage = (page: number, offset: number) => {
      service.search('test', page);
      expect(httpSpy.get.calls.first().args[1].params.offset).toEqual(offset.toString());
      httpSpy.get.calls.reset();
    };

    testPage(1, 0);
    testPage(2, 20);
    testPage(4, 60);
    testPage(500, 9980);
  });

  it('should return the expected Giphy Api response', () => {
    const expectedResponse: GiphyResponse = {
      data: [{}],
      pagination: { total_count: 20, count: 20, offset: 30 },
      meta: { status: 200 }
    } as GiphyResponse;

    httpSpy.get.and.returnValue(of(expectedResponse));

    service.search('test', 1).subscribe(
      response => expect(response).toEqual(expectedResponse),
      fail
    );
  });

  it('should return an error in case it fails', () => {
    const errorResponse = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found'
    });

    httpSpy.get.and.returnValue(throwError(errorResponse));

    service.search('test', 1).subscribe(
      fail,
      error => {
        expect(error.status).toEqual(404);
        expect(error.statusText).toEqual('Not Found');
      }
    );
  });
});
