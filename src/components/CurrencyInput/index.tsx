import { ChangeEvent, useMemo, useState } from 'react';
import { Flex, Input, Select, Spin, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore.ts';
import classes from './currencyInput.module.css';
import { ExchangerCurrencyKeys } from '../../store/ExchangeStore.ts';

const { Text } = Typography;

interface CurrencyInputProps {
  storeKey: ExchangerCurrencyKeys;
}

export const CurrencyInput = observer(({ storeKey }: CurrencyInputProps) => {
  const { coinStore, exchangeStore } = useStore();
  const [search, setSearch] = useState<string>('');
  const store = exchangeStore[storeKey];

  const filteredOptions = useMemo(() => {
    if (!search) return coinStore.coinsOptions;
    return coinStore.coinsOptions.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, coinStore.coinsOptions]);

  const onDropdownVisibleChange = (open: boolean) => {
    if (!open) {
      setSearch('');
    }
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      store.setAmount(value);
    }
  };

  const CurrencySelect = (
    <Select
      className={classes.select}
      value={store.id}
      options={filteredOptions}
      disabled={store.status.isLoading}
      showSearch
      filterOption={false}
      onSearch={setSearch}
      onDropdownVisibleChange={onDropdownVisibleChange}
      optionRender={(option) => (
        <Flex vertical justify="space-between">
          <Text>{option.data.label}</Text>
          <Text type="secondary">{option.data.name}</Text>
        </Flex>
      )}
      onChange={(value: number) => store.setId(value)}
    ></Select>
  );

  return (
    <div>
      <Input
        value={store.status.isLoading ? '' : store.amount}
        addonAfter={CurrencySelect}
        addonBefore={store.status.isLoading && <Spin size={'small'} />}
        disabled={store.status.isLoading}
        onChange={onInputChange}
      />
    </div>
  );
});
