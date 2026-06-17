import { Select, TextInput } from '@mantine/core';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';
import {
  EXPLORER_REGISTER_AGENT_FILTER_OPTIONS,
  EXPLORER_REGISTER_TEXTS
} from '../../../constants';
import type { IExplorerRegisterFilter } from '../../../../data/models/ExplorerRegister';
import type { ExplorerRegisterController } from '../types';
import classes from '../styles/filterInput.module.css';
import { ExplorerRegisterMultiValueField } from './ExplorerRegisterMultiValueField';

export function ExplorerRegisterFilterInput({
  controller,
  disabled,
  filter,
  filterOptions,
  filterValue
}: {
  controller: ExplorerRegisterController;
  disabled: boolean;
  filter: IExplorerRegisterFilter;
  filterOptions: Array<{ value: string; label: string }>;
  filterValue: string[];
}) {
  if (filter.code === 'agente') {
    return (
      <Select
        value={filterValue[0] ?? null}
        data={[...EXPLORER_REGISTER_AGENT_FILTER_OPTIONS]}
        disabled={disabled}
        placeholder="Seleccioná un grupo..."
        rightSection={<IconChevronDown size={12} color="#94A3B8" />}
        className={classes.filterSelect}
        classNames={{
          input: classes.agentSelectInput,
          dropdown: classes.agentSelectDropdown,
          option: classes.agentSelectOption
        }}
        onChange={(value) =>
          controller.updateFilterValues(filter.code, value ? [value] : [])
        }
      />
    );
  }

  if (filter.code === 'convenioJurisdiccion') {
    return (
      <ExplorerRegisterMultiValueField
        values={filterValue}
        options={[]}
        disabled={disabled}
        mode="threeDigitNumeric"
        withSearchIcon={false}
        placeholder="Ej: 910"
        hint="Ingresá código de 3 dígitos y presioná Enter"
        inputClassName={classes.convenioInput}
        onChange={(values) => controller.updateFilterValues(filter.code, values)}
      />
    );
  }

  if (filter.inputType === 'texto') {
    return (
      <TextInput
        value={filterValue[0] ?? ''}
        disabled={disabled}
        leftSection={<IconSearch size={13} />}
        leftSectionWidth={30}
        placeholder={EXPLORER_REGISTER_TEXTS.filterSearchPlaceholder}
        className={classes.filterSelect}
        onChange={(event) =>
          controller.updateTextFilterValue(filter.code, event.currentTarget.value)
        }
      />
    );
  }

  return (
    <ExplorerRegisterMultiValueField
      values={filterValue}
      options={filterOptions}
      disabled={disabled}
      onChange={(values) => controller.updateFilterValues(filter.code, values)}
    />
  );
}
