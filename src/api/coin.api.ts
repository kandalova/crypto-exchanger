import { apiClient } from './ApiClient.ts';
import { ICoin } from '../types/coins.ts';
import { IConversionRequest, IConversionResponse } from '../types/conversion.ts';
import { debounce } from 'lodash';

export const getCoins = async (): Promise<ICoin[]> => {
  const response = await apiClient.get<ICoin[]>('/coins');
  return response.data;
};

export const getConversion = async (params: IConversionRequest): Promise<IConversionResponse> => {
  const response = await apiClient.get<IConversionResponse>('/conversion', { params });
  return response.data;
};

export const debouncedGetConversion = debounce(async (params: IConversionRequest) => {
  let res = await getConversion(params);
  return res;
}, 300);
