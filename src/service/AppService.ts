import { autorun, reaction } from 'mobx';
import { AppStore } from '../store/AppStore.ts';
import { getCoins, getConversion } from '../api/coin.api.ts';
import { IConversionRequest } from '../types/conversion.ts';
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
    ([fromId, fromAmount]) => {
      if (exchangeStore.from.status.isLoading) return;
      if (!fromId || !exchangeStore.to.id || !fromAmount) return;
      exchangeStore.to.status.start();
      debouncedFetch({
        from: Number(fromId),
        to: exchangeStore.to.id,
        fromAmount: Number(fromAmount),
      });
    },
  );

  const debouncedFetch = debounce((args: IConversionRequest) => fetchConversion(args), 300);

  const fetchConversion = async (request: IConversionRequest) => {
    try {
      const { rate, estimatedAmount } = await getConversion(request);
      if (request.fromAmount) {
        exchangeStore.to.setAmount(estimatedAmount);
      }
      if (request.toAmount) {
        exchangeStore.from.setAmount(request.toAmount);
      }
      exchangeStore.setRate(rate);
    } catch (e) {
      console.error(e);
    } finally {
      exchangeStore.to.status.finish();
      exchangeStore.from.status.finish();
    }
  };

  reaction(
    () => [exchangeStore.to.id, exchangeStore.to.amount],
    ([toId, toAmount]) => {
      if (exchangeStore.to.status.isLoading) return;
      if (!toId || !exchangeStore.from.id || !toAmount) return;
      exchangeStore.from.status.start();
      debouncedFetch({
        from: exchangeStore.from.id,
        to: Number(toId),
        toAmount: Number(toAmount),
      });
    },
  );
}
