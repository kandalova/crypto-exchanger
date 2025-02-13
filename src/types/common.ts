export type Nullable<T> = T | null;

export interface IOption {
  value: number;
  label: string;

  [key: string]: unknown;
}
