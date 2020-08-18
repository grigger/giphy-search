import { TestBed } from '@angular/core/testing';

import { BadWordsFilterService } from './bad-words-filter.service';
import { array as badWordsArray } from 'badwords-list';

describe('BadWordsFilterService', () => {
  let service: BadWordsFilterService;

  beforeEach(() => {
    service = new BadWordsFilterService();
    // service.badWordsFilter = jasmine.createSpyObj('HttpClient', ['isProfane', 'clean']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('detects the most common swear words', () => {
    badWordsArray
      .slice(0, 30)
      .forEach(word => expect(service.isProfane(word)).toBe(true, word));
  });

  it('replaces some common swear words', () => {
    badWordsArray
      .reverse()
      .slice(0, 30)
      .forEach(word => expect(service.clean(word)).toMatch(/^[*\s]+$/, word));
  });
});
