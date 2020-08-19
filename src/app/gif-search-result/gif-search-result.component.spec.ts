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
      }
    } as unknown as GIFObject;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
