import { Injectable } from '@angular/core';
import BadWordsFilter from 'bad-words';

@Injectable({
  providedIn: 'root'
})
export class BadWordsFilterService {
  private filler = '*';
  private badWordsFilter = new BadWordsFilter({ placeholder: this.filler });

  constructor() { }

  isProfane(text: string): boolean {
    return this.badWordsFilter.isProfane(text);
  }

  clean(text: string): string {
    return this.badWordsFilter.clean(text);
  }
}
