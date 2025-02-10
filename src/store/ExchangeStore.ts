import { makeAutoObservable } from 'mobx';
import { CurrencyStore } from './CurrencyStore.ts';
import { Nullable } from '../types/common.ts';

export interface ICurrencyExchangerStore {
  from: CurrencyStore;
  to: CurrencyStore;
  rate: Nullable<number>;

  setRate: (rate: number) => void;
}

export class ExchangeStore implements ICurrencyExchangerStore {
  public from = new CurrencyStore();
  public to = new CurrencyStore();
  public rate = null as Nullable<number>;

  constructor() {
    makeAutoObservable(this);
  }

  setRate(rate: number) {
    this.rate = rate;
  }
}
