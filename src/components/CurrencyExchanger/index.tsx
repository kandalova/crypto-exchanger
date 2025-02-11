import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore.ts';
import { CurrencyInput } from '../CurrencyInput';
import classes from './currencyExchanger.module.css';
import { Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

export const CurrencyExchanger = observer(() => {
  const { exchangeStore } = useStore();

  return (
    <div className={classes.exchanger}>
      <CurrencyInput storeKey={'from'} />
      <div className={classes.panel}>
        <div>{exchangeStore.rate && <span>Rate: {exchangeStore.rate} </span>}</div>
        <Button
          disabled={exchangeStore.isBusy}
          type="dashed"
          onClick={() => exchangeStore.startSwap()}
          icon={<SwapOutlined rotate={90} />}
        />
      </div>
      <CurrencyInput storeKey={'to'} />
    </div>
  );
});
