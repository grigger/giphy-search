import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GifSearchResultComponent } from './gif-search-result.component';
import { GIFObject } from 'giphy-api';

describe('GifSearchResultComponent', () => {
  let component: GifSearchResultComponent;
  let fixture: ComponentFixture<GifSearchResultComponent>;
  const gif = {

  } as GIFObject;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GifSearchResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GifSearchResultComponent);
    component = fixture.componentInstance;
    component.gif = {
      title: 'Gif Title',
      images: {
        fixed_height: {size: 100, url: 'fhgifurl', webp_size: 50, webp: 'fhwebpurl'},
        original: {size: 100, url: 'ogifurl', webp_size: 50, webp: 'owebpurl'},
      },
      url: 'gifPageUrl'
    } as unknown as GIFObject;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select original format if fixed_height not available', () => {
    component.ngOnInit();
    expect(component.imageSources).toEqual(component.gif.images.fixed_height);

    component.gif.images.fixed_height = undefined;
    component.ngOnInit();
    expect(component.imageSources).toEqual(component.gif.images.original);
  });

  it('should select webp if a smaller format', () => {
    component.imageSources.webp_size = '200';
    component.ngOnInit();
    expect(component.displayType).toEqual('gif');

    component.imageSources.webp_size = '20';
    component.ngOnInit();
    expect(component.displayType).toEqual('webp');
  });

  describe('goToGifPage', () => {
    it('goes to the page specified in the gif details', () => {
      component.goToUrl = jasmine.createSpy('goToUrl');
      component.goToGifPage();

      expect((component.goToUrl as jasmine.Spy).calls.first().args).toEqual(['gifPageUrl']);
    });
  });
});
