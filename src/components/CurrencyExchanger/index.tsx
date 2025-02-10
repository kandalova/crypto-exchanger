import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore.ts';
import { CurrencyInput } from '../CurrencyInput';
import classes from './currencyExchanger.module.css';

export const CurrencyExchanger = observer(() => {
  const { exchangeStore } = useStore();

  return (
    <div className={classes.exchanger}>
      <CurrencyInput store={exchangeStore.from} />
      <div className={classes.rate}>
        {exchangeStore.rate && <span>Rate: {exchangeStore.rate} </span>}
      </div>
      <CurrencyInput store={exchangeStore.to} />
    </div>
  );
});
