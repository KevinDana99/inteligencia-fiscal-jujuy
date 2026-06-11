'use client';

import { Fragment, useMemo, useState } from 'react';
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Pagination,
  Radio,
  Select,
  Stack,
  Table,
  Text,
  TextInput
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconArrowRight,
  IconPlus,
  IconSearch,
  IconX
} from '@tabler/icons-react';
import { BatchManagementCreateModal } from '@/modules/batch-management/presentation/components/BatchManagementCreateModal';
import { DashboardNavbarActionPortal } from '@/modules/dashboard-layout/presentation/contexts';
import type { IExplorerRegisterCatalog } from '../../../data/models/ExplorerRegister';
import {
  EXPLORER_REGISTER_ITEMS_PER_PAGE_OPTIONS,
  EXPLORER_REGISTER_SWITCH_ACTIVE_VALUE,
  EXPLORER_REGISTER_SWITCH_INACTIVE_VALUE,
  EXPLORER_REGISTER_TEXTS
} from '../../constants';
import { useExplorerRegister } from '../../hooks/useExplorerRegister';
import {
  filterExplorerRegisterOptionData,
  formatExplorerRegisterCellValue,
  getExplorerRegisterFilterOptionData,
  getExplorerRegisterFilterTagParts,
  type IExplorerRegisterFilterOptionData,
  resolveExplorerRegisterRowValue
} from '../../utils';
import classes from './ExplorerRegisterPage.module.css';

interface ExplorerRegisterPageProps {
  catalog: IExplorerRegisterCatalog | null;
  catalogError?: string;
}

interface ExplorerRegisterMultiValueFieldProps {
  disabled: boolean;
  options: IExplorerRegisterFilterOptionData[];
  values: string[];
  onChange: (values: string[]) => void;
}

function ExplorerRegisterMultiValueField({
  disabled,
  options,
  values,
  onChange
}: ExplorerRegisterMultiValueFieldProps) {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const filteredOptions = useMemo(
    () =>
      filterExplorerRegisterOptionData(options, values, searchValue).slice(
        0,
        8
      ),
    [options, searchValue, values]
  );
  const optionLabels = useMemo(
    () => new Map(options.map((option) => [option.value, option.label])),
    [options]
  );

  const addValue = (value: string) => {
    const nextValue = value.trim();

    if (!nextValue || disabled || values.includes(nextValue)) {
      return;
    }

    onChange([...values, nextValue]);
    setSearchValue('');
    setIsOpen(false);
  };

  const addSearchValue = () => {
    if (filteredOptions.length > 0) {
      addValue(filteredOptions[0].value);
      return;
    }

    if (options.length === 0) {
      addValue(searchValue);
    }
  };

  const removeValue = (value: string) => {
    onChange(values.filter((selectedValue) => selectedValue !== value));
  };

  return (
    <div className={classes.multiValueField}>
      <TextInput
        value={searchValue}
        disabled={disabled}
        leftSection={<IconSearch size={13} />}
        leftSectionWidth={30}
        placeholder={EXPLORER_REGISTER_TEXTS.filterSearchPlaceholder}
        className={`${classes.filterSelect} ${classes.filterSearchInput}`}
        onFocus={() => setIsOpen(options.length > 0)}
        onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
        onChange={(event) => {
          setSearchValue(event.currentTarget.value);
          setIsOpen(options.length > 0);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            addSearchValue();
          }
        }}
      />

      {isOpen && filteredOptions.length > 0 ? (
        <div className={classes.filterDropdown}>
          {filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={classes.filterDropdownOption}
              onMouseDown={(event) => {
                event.preventDefault();
                addValue(option.value);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      {values.length > 0 ? (
        <div className={classes.filterTags}>
          {values.map((value) => {
            const tagParts = getExplorerRegisterFilterTagParts(
              value,
              optionLabels.get(value)
            );

            return (
              <span key={value} className={classes.filterTag}>
                <span className={classes.filterTagCode}>{tagParts.code}</span>
                {tagParts.detail ? (
                  <span className={classes.filterTagDetail}>
                    - {tagParts.detail}
                  </span>
                ) : null}
                <button
                  type="button"
                  className={classes.filterTagRemove}
                  disabled={disabled}
                  onClick={() => removeValue(value)}
                  aria-label={`Quitar ${value}`}
                >
                  <IconX size={12} />
                </button>
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function ExplorerRegisterPage({
  catalog,
  catalogError
}: ExplorerRegisterPageProps) {
  const controller = useExplorerRegister(catalog);
  const displayedError =
    catalogError ??
    controller.searchError ??
    (controller.searchStatus === 409
      ? EXPLORER_REGISTER_TEXTS.sourceUnavailable
      : null);
  const result = controller.result;
  const resultColumns = result?.columns ?? [];
  const currentPage = result?.page ?? 1;
  const totalPages = result?.totalPages ?? 0;

  return (
    <>
      <DashboardNavbarActionPortal>
        <Button
          size="sm"
          radius="xl"
          leftSection={<IconPlus size={16} />}
          className={classes.navbarActionButton}
          disabled={
            !controller.hasCatalog ||
            controller.batchCreateRowCount === 0 ||
            controller.createBatchModal.isCreatePending
          }
          onClick={controller.openCreateBatchModal}
        >
          {EXPLORER_REGISTER_TEXTS.navbarAction}{' '}
          {controller.batchCreateRowCount}{' '}
          {EXPLORER_REGISTER_TEXTS.navbarActionSuffix}
        </Button>
      </DashboardNavbarActionPortal>
      <BatchManagementCreateModal controller={controller.createBatchModal} />

      <div className={classes.page}>
        <div>
          <Text className={classes.sectionLabel}>
            {EXPLORER_REGISTER_TEXTS.columnsTitle}
          </Text>
          <div className={classes.pillsRow}>
            {controller.columnPills.map((column) => {
              const isActive = controller.selectedColumnCodes.includes(
                column.code
              );

              return (
                <Button
                  key={column.code}
                  variant="default"
                  radius="xl"
                  className={`${classes.pillButton} ${
                    isActive ? classes.pillButtonActive : ''
                  }`}
                  disabled={!controller.hasCatalog}
                  onClick={() => controller.toggleColumn(column.code)}
                >
                  {column.name}
                </Button>
              );
            })}
          </div>
        </div>

        <Card className={classes.filtersCard} radius="lg" padding="lg">
          <Stack gap="md">
            <div className={classes.filtersHeader}>
              <Text className={classes.filtersTitle}>
                {EXPLORER_REGISTER_TEXTS.filtersTitle}
              </Text>
              <div className={classes.filtersActions}>
                <Button
                  variant="default"
                  radius="xl"
                  className={classes.clearButton}
                  disabled={!controller.hasCatalog || controller.isPending}
                  onClick={controller.clearFilters}
                >
                  {EXPLORER_REGISTER_TEXTS.clearFilters}
                </Button>
                <Button
                  radius="xl"
                  leftSection={<IconSearch size={13} />}
                  className={classes.searchButton}
                  disabled={!controller.hasCatalog}
                  loading={controller.isPending}
                  onClick={controller.search}
                >
                  {EXPLORER_REGISTER_TEXTS.search}
                </Button>
              </div>
            </div>

            <div className={classes.filtersGrid}>
              {controller.activeFilters.map((filter, index) => {
                const filterValue = controller.filterValues[filter.code] ?? [];
                const filterOptions =
                  getExplorerRegisterFilterOptionData(filter);
                const disabled = !filter.available || controller.isPending;
                const shouldRenderArrow =
                  index < controller.activeFilters.length - 1 &&
                  filter.inputType !== 'switch' &&
                  controller.activeFilters[index + 1]?.inputType !== 'switch';

                return (
                  <Fragment key={filter.code}>
                    <div className={classes.filterField}>
                      {filter.inputType === 'switch' ? (
                        <div className={classes.switchField}>
                          <Text className={classes.filterLabel}>
                            {filter.name}
                          </Text>
                          <Radio.Group
                            value={
                              filterValue.includes(
                                EXPLORER_REGISTER_SWITCH_ACTIVE_VALUE
                              )
                                ? EXPLORER_REGISTER_SWITCH_ACTIVE_VALUE
                                : EXPLORER_REGISTER_SWITCH_INACTIVE_VALUE
                            }
                            onChange={(value) =>
                              controller.updateSwitchFilterValue(
                                filter.code,
                                value === EXPLORER_REGISTER_SWITCH_ACTIVE_VALUE
                              )
                            }
                          >
                            <Group className={classes.switchOptions} gap="xs">
                              <Radio
                                value={EXPLORER_REGISTER_SWITCH_ACTIVE_VALUE}
                                label={EXPLORER_REGISTER_TEXTS.switchOn}
                                color="blue"
                                size="xs"
                                disabled={disabled}
                              />
                              <Radio
                                value={EXPLORER_REGISTER_SWITCH_INACTIVE_VALUE}
                                label={EXPLORER_REGISTER_TEXTS.switchOff}
                                color="blue"
                                size="xs"
                                disabled={disabled}
                              />
                              <Button
                                variant="subtle"
                                size="compact-xs"
                                className={classes.switchClearButton}
                                disabled={disabled}
                                onClick={() =>
                                  controller.updateSwitchFilterValue(
                                    filter.code,
                                    false
                                  )
                                }
                              >
                                {EXPLORER_REGISTER_TEXTS.clearFilter}
                              </Button>
                            </Group>
                          </Radio.Group>
                        </div>
                      ) : (
                        <>
                          <Text className={classes.filterLabel}>
                            {filter.name}
                          </Text>
                          {filter.inputType === 'texto' ? (
                            <TextInput
                              value={filterValue[0] ?? ''}
                              disabled={disabled}
                              leftSection={<IconSearch size={13} />}
                              leftSectionWidth={30}
                              placeholder={
                                EXPLORER_REGISTER_TEXTS.filterSearchPlaceholder
                              }
                              className={classes.filterSelect}
                              onChange={(event) =>
                                controller.updateTextFilterValue(
                                  filter.code,
                                  event.currentTarget.value
                                )
                              }
                            />
                          ) : (
                            <ExplorerRegisterMultiValueField
                              values={filterValue}
                              options={filterOptions}
                              disabled={disabled}
                              onChange={(values) =>
                                controller.updateFilterValues(
                                  filter.code,
                                  values
                                )
                              }
                            />
                          )}
                        </>
                      )}
                      {!filter.available && filter.unavailableReason ? (
                        <Text className={classes.filterHint}>
                          {filter.unavailableReason}
                        </Text>
                      ) : null}
                    </div>
                    {shouldRenderArrow ? (
                      <IconArrowRight
                        size={22}
                        stroke={2.3}
                        className={classes.filterArrow}
                      />
                    ) : null}
                  </Fragment>
                );
              })}

              {controller.hasActiveTemporalFilters ? (
                <>
                  <DatePickerInput
                    label={EXPLORER_REGISTER_TEXTS.temporalStart}
                    placeholder={EXPLORER_REGISTER_TEXTS.temporalStart}
                    value={controller.temporalRange.startDate || null}
                    clearable
                    disabled={controller.isPending}
                    valueFormat="YYYY-MM-DD"
                    className={`${classes.filterSelect} ${classes.datePickerInput}`}
                    onChange={(value) =>
                      controller.updateTemporalRange('startDate', value ?? '')
                    }
                  />
                  <IconArrowRight
                    size={22}
                    stroke={2.3}
                    className={classes.filterArrow}
                  />
                  <DatePickerInput
                    label={EXPLORER_REGISTER_TEXTS.temporalEnd}
                    placeholder={EXPLORER_REGISTER_TEXTS.temporalEnd}
                    value={controller.temporalRange.endDate || null}
                    clearable
                    disabled={controller.isPending}
                    valueFormat="YYYY-MM-DD"
                    className={`${classes.filterSelect} ${classes.datePickerInput}`}
                    onChange={(value) =>
                      controller.updateTemporalRange('endDate', value ?? '')
                    }
                  />
                </>
              ) : null}
            </div>
          </Stack>
        </Card>

        {displayedError ? (
          <Card className={classes.errorCard} padding="md" radius="lg">
            <Text className={classes.errorText}>{displayedError}</Text>
          </Card>
        ) : null}

        {controller.hasSearched && result && controller.visibleRows.length > 0 ? (
          <div className={classes.tableWrap}>
            <Table withColumnBorders={false} className={classes.table}>
              <Table.Thead className={classes.thead}>
                <Table.Tr>
                  <Table.Th className={`${classes.th} ${classes.xHeader}`} />
                  {resultColumns.map((column) => (
                    <Table.Th key={column.code} className={classes.th}>
                      {column.name}
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {controller.visibleRows.map((row) => (
                  <Table.Tr key={row.cuit}>
                    <Table.Td className={classes.td}>
                      <ActionIcon
                        variant="subtle"
                        radius="xl"
                        className={classes.removeButton}
                        onClick={() => controller.deselectRow(row.cuit)}
                        aria-label={`Deseleccionar ${row.businessName}`}
                      >
                        <IconX size={16} />
                      </ActionIcon>
                    </Table.Td>
                    {resultColumns.map((column) => (
                      <Table.Td key={column.code} className={classes.td}>
                        {formatExplorerRegisterCellValue(
                          resolveExplorerRegisterRowValue(row, column)
                        )}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            <Group justify="space-between" className={classes.paginationBar}>
              <Text className={classes.paginationText}>
                {EXPLORER_REGISTER_TEXTS.totalResults}: {result.totalItems}
              </Text>
              <Group gap="sm">
                <Select
                  aria-label={EXPLORER_REGISTER_TEXTS.pageSize}
                  value={String(controller.itemsPerPage)}
                  data={EXPLORER_REGISTER_ITEMS_PER_PAGE_OPTIONS.map(
                    (option) => ({
                      value: String(option),
                      label: String(option)
                    })
                  )}
                  className={classes.pageSizeSelect}
                  disabled={controller.isPending}
                  onChange={(value) =>
                    controller.changeItemsPerPage(Number(value ?? 20))
                  }
                />
                <Pagination
                  value={currentPage}
                  total={Math.max(totalPages, 1)}
                  disabled={controller.isPending || totalPages <= 1}
                  onChange={controller.changePage}
                />
              </Group>
            </Group>
          </div>
        ) : controller.hasSearched ? (
          <Card className={classes.fallbackCard} padding="xl" radius="lg">
            <Text className={classes.fallbackText}>
              {EXPLORER_REGISTER_TEXTS.emptyFallback}
            </Text>
          </Card>
        ) : (
          <Card className={classes.fallbackCard} padding="xl" radius="lg">
            <Text className={classes.fallbackText}>
              {controller.hasCatalog
                ? EXPLORER_REGISTER_TEXTS.initialFallback
                : EXPLORER_REGISTER_TEXTS.catalogFallback}
            </Text>
          </Card>
        )}
      </div>
    </>
  );
}
