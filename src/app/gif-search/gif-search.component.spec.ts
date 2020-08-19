import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { GIFObject, MultiResponse as GiphyResponse } from 'giphy-api';
import { GifSearchComponent } from './gif-search.component';
import { GifSearchResultComponent } from '../gif-search-result/gif-search-result.component';
import { BadWordsFilterPipe } from '../shared/bad-words-filter.pipe';
import { BadWordsFilterService } from '../shared/bad-words-filter.service';
import { GiphySearchService } from '../shared/giphy-search.service';

describe('GifSearchComponent', () => {
  let component: GifSearchComponent & { renderSearchResults: any, searchGifs: any };
  let fixture: ComponentFixture<GifSearchComponent>;
  let searchSvcSpy: { search: jasmine.Spy };
  let badWordsSvcSpy: { isProfane: jasmine.Spy };

  // Api calls are debounced
  const debounceTimeout = 300;
  const apiDebouncetimeout = () => new Promise(r => setTimeout(() => r(), debounceTimeout));

  const searchResponse = {
    data: [
      {
        title: 'gif 1',
        images: {
          fixed_height: { size: 100, url: 'fhgifurl1', webp_size: 50, webp: 'fhwebpurl1' },
          original: { size: 100, url: 'ogifurl1', webp_size: 50, webp: 'owebpurl1' },
        }
      },
      {
        title: 'gif 2',
        images: {
          fixed_height: { size: 100, url: 'fhgifurl2', webp_size: 50, webp: 'fhwebpurl2' },
          original: { size: 100, url: 'ogifurl2', webp_size: 50, webp: 'owebpurl2' },
        }
      }
    ],
    meta: {
      status: 200
    },
    pagination: {
      count: 3,
      total_count: 10,
      offset: 0
    }
  };


  beforeEach(async(() => {
    searchSvcSpy = jasmine.createSpyObj('searchSvcSpy', ['search']);
    searchSvcSpy.search.and.returnValue(of(searchResponse));

    badWordsSvcSpy = jasmine.createSpyObj('badWordsFilterSvc', ['isProfane']);

    TestBed.configureTestingModule({
      declarations: [ GifSearchComponent, GifSearchResultComponent, BadWordsFilterPipe ],
      imports: [ HttpClientModule, FormsModule ],
      providers: [
        { provide: GiphySearchService, useValue: searchSvcSpy },
        { provide: BadWordsFilterService, useValue: badWordsSvcSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GifSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('changing the search input', () => {
    beforeEach(async(() => {
      component.renderSearchResults = jasmine.createSpy('renderSearchResults');
    }));

    it('(searchInputChanged) should emit a new value and render', async () => {
      component.searchInputChanged('search');

      await apiDebouncetimeout();
      expect(component.renderSearchResults.calls.count()).toEqual(1);
    });

    it('should not search again if same value', async () => {
      component.searchInputChanged('search term');
      await apiDebouncetimeout();
      component.searchInputChanged('search term');

      await apiDebouncetimeout();
      expect(component.renderSearchResults.calls.count()).toEqual(1);
    });

    it('should set currentSearchTerm, error and isLoding', () => {
      component.currentSearchTerm = undefined;
      component.error = 'test';
      component.isLoading =  false;
      component.searchInputChanged('search_term');

      expect(component.error).toBeUndefined();
      expect(component.currentSearchTerm).toEqual('search_term');
      expect(component.isLoading).toBeTrue();
    });

    it('should not render anything if no search term', () => {
      component.currentSearchTerm = undefined;
      component.error = 'test';
      component.searchInputChanged('');

      expect(component.renderSearchResults.calls.count()).toEqual(0);
    });

    it('should debounce subsequent calls', async () => {
      component.searchInputChanged('search 1');
      component.searchInputChanged('search 2');
      component.searchInputChanged('search 3');

      await apiDebouncetimeout();
      expect(component.renderSearchResults.calls.count()).toEqual(1);
    });

    it('should filter profane words and allow non-profane', async () => {
      badWordsSvcSpy.isProfane.and.returnValue(false);
      component.searchInputChanged('non-profane');

      await apiDebouncetimeout();

      badWordsSvcSpy.isProfane.and.returnValue(true);
      component.searchInputChanged('profane');

      await apiDebouncetimeout();
      expect(component.renderSearchResults.calls.count()).toEqual(1);
    });

    it('should call searchGifs with the appropriate term and page 1', async () => {
      component.searchGifs = jasmine.createSpy('searchGifs');
      component.searchGifs.and.returnValue(of(searchResponse));

      component.searchInputChanged('search gif');

      await apiDebouncetimeout();
      expect(component.searchGifs.calls.count()).toEqual(1);
      expect(component.searchGifs.calls.first().args).toEqual(['search gif', 1]);
    });

    it('should handle the error', async () => {
      component.searchGifs = jasmine.createSpy('searchGifs').and.throwError('err');
      component.showError = jasmine.createSpy('showError');

      component.searchInputChanged('search gif');
      await apiDebouncetimeout();

      expect((component.showError as jasmine.Spy).calls.count()).toEqual(1);
      expect((component.showError as jasmine.Spy).calls.first().args[0].message).toEqual('err');
    });
  });

  describe('changing the page', () => {
    beforeEach(async(() => {
      component.renderSearchResults = jasmine.createSpy('renderSearchResults');
    }));

    it('(changePage) should emit a new value and render', async () => {
      component.changePage(2);
      expect(component.renderSearchResults.calls.count()).toEqual(1);
    });

    it('should search using the specified page and currentSearchTerm', async () => {
      component.searchGifs = jasmine.createSpy('searchGifs');
      component.searchGifs.and.returnValue(of(searchResponse));

      component.currentSearchTerm = 'test';
      component.changePage(2);

      expect(component.searchGifs.calls.first().args).toEqual(['test', 2]);
    });

    it('should not search the same page twice', async () => {
      component.changePage(2);
      component.changePage(2);

      expect(component.renderSearchResults.calls.count()).toEqual(1);
    });

    it('should handle errors', async () => {
      component.searchGifs = jasmine.createSpy('searchGifs').and.throwError('err');
      component.showError = jasmine.createSpy('showError');

      component.changePage(2);
      await apiDebouncetimeout();

      expect((component.showError as jasmine.Spy).calls.count()).toEqual(1);
      expect((component.showError as jasmine.Spy).calls.first().args[0].message).toEqual('err');
    });
  });

  describe('subscriptions', () => {
    it('(ngOnInit) should store the two subscriptions it creates', () => {
      const wrapper = { ...component } as any;

      wrapper.subscriptions = [];
      component.constructor.prototype.ngOnInit.call(wrapper);

      expect(wrapper.subscriptions.length).toEqual(2);
    });


    it('(ngOnDestroy) should unsubscribe all subscriptions', () => {
      const wrapper = { ...component } as any;
      const subscriptionSpy = jasmine.createSpyObj('subscriptionSpy', ['unsubscribe']);

      wrapper.subscriptions = [ subscriptionSpy, subscriptionSpy ];
      component.constructor.prototype.ngOnDestroy.call(wrapper);

      expect(wrapper.subscriptions.length).toEqual(0);
      expect(subscriptionSpy.unsubscribe.calls.count()).toEqual(2);
    });
  });

  describe('searchGifs', () => {
    it('changes isLoading twice', () => {
      const spy = jasmine.createSpy('set');
      Object.defineProperty(component, 'isLoading', {
        set: val => spy(val),
        get(): boolean { return true; }
      });

      component.searchGifs('test' , 1).subscribe();

      expect(spy.calls.count()).toEqual(2);
      expect(spy.calls.allArgs()).toEqual([ [ true ], [ false ] ] as any);
    });

    it('should call search service', () => {
      component.searchGifs('test' , 1).subscribe();

      expect(searchSvcSpy.search.calls.count()).toEqual(1);
      expect(searchSvcSpy.search.calls.first().args).toEqual([ 'test', 1 ]);
    });

    it('should call showError on error', () => {
      searchSvcSpy.search.and.throwError('err');
      component.showError = jasmine.createSpy('showError');

      component.searchGifs('test' , 1).subscribe();

      expect((component.showError as jasmine.Spy).calls.count()).toEqual(1);
      expect((component.showError as jasmine.Spy).calls.first().args[0].message).toEqual('err');
    });
  });

  describe('renderSearchResults', () => {
    it('sets the search results and search results meta', () => {
      const responseData = [ {} as GIFObject ];
      const responsePagination = {} as GiphyResponse['pagination'];
      component.searchResults = undefined;
      component.searchResultsMeta = undefined;
      component.renderSearchResults({ data: responseData, pagination: responsePagination });

      expect(component.searchResults).toBe(responseData);
      expect(component.searchResultsMeta).toBe(responsePagination);
    });

    it('sets the total count to a max of 5000', () => {
      const responseData = [ {} as GIFObject ];
      component.renderSearchResults({
        data: responseData,
        pagination: { total_count: 3000 } as GiphyResponse['pagination']
      });
      expect(component.searchResultsMeta.total_count).toBe(3000);

      component.renderSearchResults({
        data: responseData,
        pagination: { total_count: 6000 } as GiphyResponse['pagination']
      });
      expect(component.searchResultsMeta.total_count).toBe(5000);
    });
  });
});
