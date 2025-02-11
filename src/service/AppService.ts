import { autorun, reaction } from 'mobx';
import { AppStore } from '../store/AppStore.ts';
import { getCoins, getConversion } from '../api/coin.api.ts';
import { IConversionRequest, IConversionResponse } from '../types/conversion.ts';
import { debounce } from 'lodash';

export function setupStoreReactions({ coinStore, exchangeStore }: AppStore) {
  //todo disposers
  autorun(async () => {
    try {
      const coins = await getCoins();
      coinStore.setCoins(coins);
      if (coins.length > 2) {
        exchangeStore.from.setId(coins[0].id);
        exchangeStore.to.setId(coins[1].id);
      }
    } catch (e) {
      console.error(e);
    }
  });

  reaction(
    () => [exchangeStore.from.id, exchangeStore.from.amount],
    async ([fromId, fromAmount]) => {
      const { from, to } = exchangeStore;
      if (from.status.isLoading) return;
      if (!fromId || !to.id || !fromAmount) return;
      to.status.start();
      debouncedFetch(
        {
          from: Number(fromId),
          to: to.id,
          fromAmount: Number(fromAmount),
        },
        ({ rate, estimatedAmount }: IConversionResponse) => {
          to.setAmount(estimatedAmount);
          exchangeStore.setRate(rate);
        },
        () => {
          to.status.finish();
        },
      );
    },
  );

  reaction(
    () => [exchangeStore.to.id, exchangeStore.to.amount],
    async ([toId, toAmount]) => {
      const { from, to } = exchangeStore;
      if (to.status.isLoading) return;
      if (!toId || !from.id || !toAmount) return;
      from.status.start();
      debouncedFetch(
        {
          from: from.id,
          to: Number(toId),
          toAmount: Number(toAmount),
        },
        ({ rate, estimatedAmount }: IConversionResponse) => {
          from.setAmount(estimatedAmount);
          exchangeStore.setRate(rate);
        },
        () => {
          from.status.finish();
        },
      );
    },
  );

  reaction(
    () => exchangeStore.swap.isLoading,
    (isStarted) => {
      if (!isStarted) return;
      const { from, to, swap } = exchangeStore;
      if (!from.id || !to.id) return;

      if (from.amount) {
        to.status.start();
      }
      const oldToId = to.id;
      to.setId(from.id);
      from.setId(oldToId);
      swap.finish();
    },
  );

  const fetchConversion = async (
    request: IConversionRequest,
    onSuccess: (results: IConversionResponse) => void,
    onFinally?: VoidFunction,
  ) => {
    try {
      const res = await getConversion(request);
      onSuccess(res);
    } catch (e) {
      console.error(e);
    } finally {
      onFinally?.();
    }
  };

  const debouncedFetch = debounce(fetchConversion, 500);
}
