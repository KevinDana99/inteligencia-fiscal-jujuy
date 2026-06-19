import { Text, TextInput } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { EXPLORER_REGISTER_TEXTS } from '../../../constants';
import { useExplorerRegisterMultiValueField } from '../../../hooks/explorer-register';
import {
  getExplorerRegisterFilterTagParts,
  type IExplorerRegisterFilterOptionData
} from '../../../utils';
import inputClasses from '../styles/filterInput.module.css';
import layoutClasses from '../styles/filterLayout.module.css';
import classes from '../styles/multiValueField.module.css';

interface ExplorerRegisterMultiValueFieldProps {
  disabled: boolean;
  options: IExplorerRegisterFilterOptionData[];
  values: string[];
  onChange: (values: string[]) => void;
  mode?: 'default' | 'threeDigitNumeric';
  placeholder?: string;
  hint?: string;
  withSearchIcon?: boolean;
  inputClassName?: string;
}

export function ExplorerRegisterMultiValueField({
  disabled,
  options,
  values,
  onChange,
  mode = 'default',
  placeholder = EXPLORER_REGISTER_TEXTS.filterSearchPlaceholder,
  hint,
  withSearchIcon = true,
  inputClassName
}: ExplorerRegisterMultiValueFieldProps) {
  const field = useExplorerRegisterMultiValueField({
    disabled,
    options,
    values,
    onChange,
    mode
  });

  return (
    <div className={classes.multiValueField}>
      <TextInput
        value={field.searchValue}
        disabled={disabled}
        leftSection={withSearchIcon ? <IconSearch size={13} /> : undefined}
        leftSectionWidth={withSearchIcon ? 30 : undefined}
        placeholder={placeholder}
        inputMode={mode === 'threeDigitNumeric' ? 'numeric' : undefined}
        className={`${inputClasses.filterSelect} ${inputClassName ?? inputClasses.filterSearchInput}`}
        onFocus={field.handleInputFocus}
        onBlur={field.handleInputBlur}
        onChange={(event) => field.handleInputChange(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (field.handleInputKeyDown(event.key)) event.preventDefault();
        }}
      />
      {hint ? <Text className={layoutClasses.filterHint}>{hint}</Text> : null}
      {field.isOpen && field.filteredOptions.length > 0 ? (
        <div className={classes.filterDropdown}>
          {field.filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={classes.filterDropdownOption}
              onMouseDown={(event) => {
                event.preventDefault();
                field.addValue(option.value);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
      {values.length > 0 ? (
        <div className={classes.filterTags}>
          {values.map((value) => (
            <FilterTag key={value} value={value} field={field} disabled={disabled} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FilterTag({
  value,
  field,
  disabled
}: {
  value: string;
  field: ReturnType<typeof useExplorerRegisterMultiValueField>;
  disabled: boolean;
}) {
  const tagParts = getExplorerRegisterFilterTagParts(
    value,
    field.optionLabels.get(value)
  );

  return (
    <span className={classes.filterTag}>
      <span className={classes.filterTagCode}>{tagParts.code}</span>
      {tagParts.detail ? (
        <span className={classes.filterTagDetail}>- {tagParts.detail}</span>
      ) : null}
      <button
        type="button"
        className={classes.filterTagRemove}
        disabled={disabled}
        onClick={() => field.removeValue(value)}
        aria-label={`Quitar ${value}`}
      >
        <IconX size={12} />
      </button>
    </span>
  );
}
