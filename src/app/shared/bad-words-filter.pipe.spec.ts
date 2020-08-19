import { BadWordsFilterPipe } from './bad-words-filter.pipe';
import { BadWordsFilterService } from './bad-words-filter.service';

describe('BadWordsFilterPipe', () => {
  let pipe: BadWordsFilterPipe;
  let badWordsSvcSpy: { clean: jasmine.Spy };

  beforeEach(() => {
    badWordsSvcSpy = jasmine.createSpyObj('badWordsFilterSvc', ['clean']);
    badWordsSvcSpy.clean.and.returnValue('test');
    pipe = new BadWordsFilterPipe(badWordsSvcSpy as unknown as BadWordsFilterService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns empty string if no value', () => {
    expect(pipe.transform('')).toEqual('');
    expect(badWordsSvcSpy.clean.calls.count()).toEqual(0);
  });

  it('it cleans the string with the bad ', () => {
    expect(pipe.transform('test')).toEqual('test');
    expect(badWordsSvcSpy.clean.calls.count()).toEqual(1);
  });
});
