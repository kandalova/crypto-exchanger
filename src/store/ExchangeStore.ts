import { makeAutoObservable } from 'mobx';
import { CurrencyStore } from './CurrencyStore.ts';
import { Nullable } from '../types/common.ts';
import { StatusModel } from './StatusModel.ts';

export interface IExchangerStore {
  from: CurrencyStore;
  to: CurrencyStore;
  rate: Nullable<number>;
  swap: StatusModel;
  isBusy: boolean;

  setRate: (rate: number) => void;
  startSwap: VoidFunction;
}

export type ExchangerCurrencyKeys = 'from' | 'to';

export class ExchangeStore implements IExchangerStore {
  public from = new CurrencyStore();
  public to = new CurrencyStore();
  public rate = null as Nullable<number>;
  public swap = new StatusModel();

  constructor() {
    makeAutoObservable(this);
  }

  get isBusy() {
    return this.swap.isLoading || this.to.status.isLoading || this.from.status.isLoading;
  }

  setRate(rate: number) {
    this.rate = rate;
  }

  startSwap(): void {
    this.swap.start();
  }
}
