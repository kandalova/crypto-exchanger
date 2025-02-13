import { ChangeEvent, useMemo, useState } from 'react';
import { Flex, Input, Select, Spin, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import classes from './currencyInput.module.css';
import { IOption, Nullable } from '../../types/common.ts';

const { Text } = Typography;

interface SelectableInputProps<T extends IOption> {
  inputValue: string;
  onInputChange: (value: string) => void;
  selectValue: Nullable<number>;
  onSelectChange: (value: number) => void;
  filterFunc: (item: T, searchValue: string) => boolean;
  options: T[];
  disabled: boolean;
  secondaryInfo?: keyof T;
}

export const SelectableInput = observer(
  <T extends IOption>({
    inputValue,
    onInputChange,
    selectValue,
    onSelectChange,
    filterFunc,
    options,
    disabled,
    secondaryInfo,
  }: SelectableInputProps<T>) => {
    const [search, setSearch] = useState<string>('');

    const filteredOptions: T[] = useMemo(() => {
      if (!search) return options;
      return options.filter((option) => filterFunc(option, search));
    }, [search, options]);

    const onDropdownVisibleChange = (open: boolean) => {
      if (!open) {
        setSearch('');
      }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (/^\d*\.?\d*$/.test(value)) {
        onInputChange(value);
      }
    };

    const renderOption = (option: { data: T }) => {
      const secondaryValue = secondaryInfo ? option.data[secondaryInfo] : null;
      const isValidReactNode =
        typeof secondaryValue === 'string' || typeof secondaryValue === 'number';
      return (
        <Flex vertical justify="space-between">
          <Text>{option.data.label}</Text>
          {isValidReactNode && <Text type="secondary">{secondaryValue}</Text>}
        </Flex>
      );
    };

    const CurrencySelect = (
      <Select<number, T>
        className={classes.select}
        value={selectValue}
        options={filteredOptions}
        disabled={disabled}
        showSearch
        filterOption={false}
        onSearch={setSearch}
        onDropdownVisibleChange={onDropdownVisibleChange}
        optionRender={secondaryInfo ? renderOption : undefined}
        onChange={onSelectChange}
      ></Select>
    );

    return (
      <div>
        <Input
          value={disabled ? '' : inputValue}
          addonAfter={CurrencySelect}
          addonBefore={disabled && <Spin size={'small'} />}
          disabled={disabled}
          onChange={handleInputChange}
        />
      </div>
    );
  },
);
