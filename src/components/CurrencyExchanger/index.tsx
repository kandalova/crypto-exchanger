import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore.ts';
import classes from './currencyExchanger.module.css';
import { Button } from 'antd';
import { SelectableInput } from '../SelectableInput';
import { SwapOutlined } from '@ant-design/icons';
import { ExchangerCurrencyKeys } from '../../store/ExchangeStore.ts';
import { ICoinOption } from '../../types/coins.ts';

export const CurrencyExchanger = observer(() => {
  const { exchangeStore, coinStore } = useStore();
  const { from, to } = exchangeStore;

  const onInputChange = (value: string, target: ExchangerCurrencyKeys) => {
    if (/^\d*\.?\d*$/.test(value)) {
      exchangeStore.setAmount(value, target);
    }
  };

  const onSelectChange = (value: number, target: ExchangerCurrencyKeys) => {
    exchangeStore.setId(value, target);
  };

  const filterFunc = (coin: ICoinOption, search: string) => {
    return (
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.label.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <div className={classes.exchanger}>
      <SelectableInput
        inputValue={from.amount}
        onInputChange={(value) => onInputChange(value, 'from')}
        selectValue={from.id}
        onSelectChange={(value) => onSelectChange(value, 'from')}
        disabled={from.status.isLoading}
        options={coinStore.coinsOptions}
        filterFunc={filterFunc}
      />
      <div className={classes.panel}>
        <div>{exchangeStore.rate && <span>Rate: {exchangeStore.rate} </span>}</div>
        <Button
          disabled={exchangeStore.isBusy}
          type="dashed"
          onClick={() => exchangeStore.startSwap()}
          icon={<SwapOutlined rotate={90} />}
        />
      </div>
      <SelectableInput
        inputValue={to.amount}
        onInputChange={(value) => onInputChange(value, 'to')}
        selectValue={to.id}
        onSelectChange={(value) => onSelectChange(value, 'to')}
        disabled={to.status.isLoading}
        options={coinStore.coinsOptions}
        filterFunc={filterFunc}
      />
    </div>
  );
});
