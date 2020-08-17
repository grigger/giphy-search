import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GifSearchResultComponent } from './gif-search-result.component';

describe('GifSearchResultComponent', () => {
  let component: GifSearchResultComponent;
  let fixture: ComponentFixture<GifSearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GifSearchResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GifSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
