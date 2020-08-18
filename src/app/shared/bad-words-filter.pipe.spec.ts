import { BadWordsFilterPipe } from './bad-words-filter.pipe';

describe('BadWordsFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new BadWordsFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
