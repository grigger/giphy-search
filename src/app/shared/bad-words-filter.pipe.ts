import { Pipe, PipeTransform } from '@angular/core';
import { BadWordsFilterService } from './bad-words-filter.service';

@Pipe({
  name: 'badWordsFilter'
})
export class BadWordsFilterPipe implements PipeTransform {
  constructor(
    private badWordsFilterSvc: BadWordsFilterService
  ) {}

  transform(value: string): string {

    return value ? this.badWordsFilterSvc.clean(value) : '';
  }

}
