import { makeAutoObservable } from 'mobx';
import { CurrencyStore } from './CurrencyStore.ts';
import { Nullable } from '../types/common.ts';
import { StatusModel } from './StatusModel.ts';
//
// export interface IExchangerStore {
//   from: CurrencyStore;
//   to: CurrencyStore;
//   rate: Nullable<number>;
//   swap: StatusModel;
//   isBusy: boolean;
//
//   setRate: (rate: number) => void;
//   startSwap: VoidFunction;
// }

export type ExchangerCurrencyKeys = 'from' | 'to';

export class ExchangeStore {
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

  setAmount(amount: string, key: ExchangerCurrencyKeys) {
    if (key === 'from') {
      this.from.setAmount(amount);
    } else {
      this.to.setAmount(amount);
    }
  }

  setId(amount: number, key: ExchangerCurrencyKeys) {
    if (key === 'from') {
      this.from.setId(amount);
    } else {
      this.to.setId(amount);
    }
  }
}
