import { BadWordsFilterPipe } from './bad-words-filter.pipe';
import { BadWordsFilterService } from './bad-words-filter.service';

describe('BadWordsFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new BadWordsFilterPipe(new BadWordsFilterService());
    expect(pipe).toBeTruthy();
  });
});
