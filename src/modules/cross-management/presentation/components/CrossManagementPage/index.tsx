'use client'

import { Badge, Select, Table, Text, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useCrossManagement } from '../../hooks'
import classes from './CrossManagementPage.module.css'
import type { ICrossManagementListData } from '../../../data/models/CrossManagement'

export function CrossManagementPage({
  initialCrossData
}: {
  initialCrossData?: ICrossManagementListData | null
}) {
  const {
    items,
    total,
    searchValue,
    dayRangeValue,
    dayRangeOptions,
    setSearchValue,
    setDayRangeValue,
    openCrossPreview
  } = useCrossManagement(initialCrossData)

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div>
          <div className={classes.headerTitle}>Gestión de Cruces</div>
          <div className={classes.headerSubtitle}>
            Todos los cruces realizados desde Lotes y Padrón Unificado
          </div>
        </div>
      </div>

      <div className={classes.filtersRow}>
        <div className={classes.filtersControls}>
          <TextInput
            leftSection={<IconSearch size={14} />}
            placeholder="Buscar por nombre, lote o CUIT..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
            className={classes.searchInput}
            classNames={{
              input: classes.searchInputField,
              section: classes.searchInputSection
            }}
          />

          <Select
            data={dayRangeOptions}
            value={dayRangeValue}
            onChange={(value) => setDayRangeValue(value ?? '')}
            className={classes.filterSelect}
            classNames={{
              input: classes.filterSelectInput,
              dropdown: classes.filterSelectDropdown,
              option: classes.filterSelectOption
            }}
          />

          <div className={classes.filterSeparator} />
        </div>

        <div className={classes.countContainer}>
          <span className={classes.countText}>{total} cruces</span>
        </div>
      </div>

      <div className={classes.tableWrap}>
        <Table withTableBorder={false} withColumnBorders={false} className={classes.table}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre del cruce</Table.Th>
              <Table.Th>Origen</Table.Th>
              <Table.Th>Lote / CUIT</Table.Th>
              <Table.Th>Período</Table.Th>
              <Table.Th>CUITs</Table.Th>
              <Table.Th>Fecha</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {items.length ? (
              items.map((item) => (
                <Table.Tr
                  key={item.id}
                  className={classes.row}
                  onClick={() => openCrossPreview(item)}
                >
                  <Table.Td className={classes.nameCell}>{item.name}</Table.Td>
                  <Table.Td>
                    <Badge
                      radius="xl"
                      classNames={{ label: classes.sourceBadgeLabel }}
                      className={
                        item.source === 'Lote'
                          ? classes.sourceBadgeLote
                          : classes.sourceBadgePadron
                      }
                    >
                      {item.source}
                    </Badge>
                  </Table.Td>
                  <Table.Td className={classes.sourceRefCell}>{item.sourceRef}</Table.Td>
                  <Table.Td className={classes.mutedCell}>{item.period}</Table.Td>
                  <Table.Td className={classes.countCell}>{item.cuitCount}</Table.Td>
                  <Table.Td className={classes.mutedCell}>{item.date}</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text className={classes.emptyState}>
                    No se encontraron cruces asociados
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  )
}
