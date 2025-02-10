import { makeAutoObservable } from 'mobx';
import { ICoin, ICoinOption } from '../types/coins.ts';

export interface ICoinStore {
  coins: ICoin[];
  coinsOptions: ICoinOption[];

  setCoins(value: ICoin[]): void;
}

export class CoinStore implements ICoinStore {
  public coins = [] as ICoin[];

  constructor() {
    makeAutoObservable(this);
  }

  get coinsOptions() {
    return this.coins.map(
      (coin) => ({ value: coin.id, label: coin.symbol, name: coin.name }) as ICoinOption,
    );
  }

  setCoins(value: ICoin[]) {
    this.coins = value;
  }
}
