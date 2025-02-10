import { makeAutoObservable } from 'mobx';
import { StatusModel } from './StatusModel.ts';
import { Nullable } from '../types/common.ts';

export interface ICurrencyStore {
  id: Nullable<number>;
  amount: string;
  status: StatusModel;

  setAmount(value: string): void;

  setId(value: number): void;
}

export class CurrencyStore implements ICurrencyStore {
  public amount = '';
  public id = null as Nullable<number>;
  public status = new StatusModel();

  constructor() {
    makeAutoObservable(this);
  }

  setAmount(value: string | number) {
    this.amount = '' + value;
  }

  setId(value: number) {
    this.id = value;
  }
}
