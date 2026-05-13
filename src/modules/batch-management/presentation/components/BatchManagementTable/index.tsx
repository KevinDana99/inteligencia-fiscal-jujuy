'use client'

import { Fragment } from 'react'
import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  Group,
  Menu,
  Select,
  Stack,
  Table,
  Text
} from '@mantine/core'
import {
  IconChevronRight,
  IconDotsVertical,
  IconSearch
} from '@tabler/icons-react'
import type { IBatchManagementItem, IBatchManagementItems } from '../../../data/models/BatchManagement'
import classes from './BatchManagementTable.module.css'

const YEAR_OPTIONS = ['2021', '2022', '2023', '2024', '2025']
const CROSS_OPTIONS = [
  'Control de desvio de BI - Regimen Gral',
  'Control de desvio de BI - Regimen CM',
  'Control de BI declarada por actividad',
  'Control de creditos',
  'Control de SAF',
  'Control de Agentes',
  'Deteccion de no inscriptos',
  'Comparacion de Bases Presuntivas'
]

function BatchManagementMenu() {
  return (
    <Menu shadow="md" width={320} withinPortal>
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="md"
          onClick={(event) => event.stopPropagation()}
        >
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown onClick={(event) => event.stopPropagation()}>
        <Menu.Label className={classes.menuLabel}>Periodo a fiscalizar</Menu.Label>
        <div className={classes.menuBody}>
          <Group gap="xs" className={classes.periodRow} grow>
            <div>
              <Text size="xs" className={classes.menuHint} mb="xs">
                Desde
              </Text>
              <Select data={YEAR_OPTIONS} defaultValue="2024" />
            </div>
            <span className={classes.periodArrow}>→</span>
            <div>
              <Text size="xs" className={classes.menuHint} mb="xs">
                Hasta
              </Text>
              <Select data={YEAR_OPTIONS} defaultValue="2025" />
            </div>
          </Group>
        </div>

        <Menu.Divider />
        <Menu.Label className={classes.menuLabel}>Tipo de cruce</Menu.Label>
        <Stack gap={6} className={classes.menuBody}>
          {CROSS_OPTIONS.map((option, index) => (
            <Checkbox
              key={option}
              label={option}
              defaultChecked={index === 1}
              color="blue"
              size="xs"
            />
          ))}
        </Stack>
        <Menu.Divider />
        <Group justify="flex-end" p="sm">
          <Button size="sm" className={classes.menuButton}>
            Confirmar
          </Button>
        </Group>
      </Menu.Dropdown>
    </Menu>
  )
}

function BatchDetailRow({ batch }: { batch: IBatchManagementItem }) {
  return (
    <div className={classes.detailInner}>
      <Stack gap="sm">
        <Text className={classes.detailTitle}>CUITs en lote {batch.name}</Text>

        {batch.cuits.length ? (
          <>
            <Table
              withTableBorder={false}
              withColumnBorders={false}
              withRowBorders
              className={`${classes.table} ${classes.nestedTable}`}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>CUIT</Table.Th>
                  <Table.Th>Razon Social</Table.Th>
                  <Table.Th>Regimen</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {batch.cuits.map((cuit, index) => (
                  <Table.Tr key={cuit.id}>
                    <Table.Td className={classes.batchDate}>{index + 1}</Table.Td>
                    <Table.Td className={classes.monoText}>{cuit.cuit}</Table.Td>
                    <Table.Td>{cuit.businessName}</Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="blue" radius="xl">
                        {cuit.regime}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <Text size="xs" className={classes.expandHint}>
              Mostrando {batch.cuits.length} de {batch.cuitCount} CUITs
            </Text>
          </>
        ) : (
          <Text size="sm" className={classes.emptyState}>
            Sin CUITs para mostrar.
          </Text>
        )}
      </Stack>
    </div>
  )
}

export function BatchManagementTable({
  batches,
  expandedBatchId,
  onToggleBatch
}: {
  batches: IBatchManagementItems
  expandedBatchId: string | null
  onToggleBatch: (batchId: string) => void
}) {
  if (!batches.length) {
    return (
      <div className={classes.tableWrap}>
        <Table withTableBorder={false} withColumnBorders={false} className={classes.table}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 32 }} />
              <Table.Th>Nro de lote</Table.Th>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Descripcion</Table.Th>
              <Table.Th className={classes.cuitCountCell}>CUITs</Table.Th>
              <Table.Th>Fecha</Table.Th>
              <Table.Th style={{ width: 44 }} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Group gap="sm" py="md">
                  <IconSearch size={16} className={classes.batchDate} />
                  <Text className={classes.emptyState}>
                    No se encontraron resultados para la busqueda actual.
                  </Text>
                </Group>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
    )
  }

  return (
    <div className={classes.tableWrap}>
      <Table
        withTableBorder={false}
        withColumnBorders={false}
        withRowBorders
        className={classes.table}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 32 }} />
            <Table.Th>Nro de lote</Table.Th>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Descripcion</Table.Th>
            <Table.Th className={classes.cuitCountCell}>CUITs</Table.Th>
            <Table.Th>Fecha</Table.Th>
            <Table.Th style={{ width: 44 }} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {batches.map((batch) => {
            const isExpanded = expandedBatchId === batch.id

            return (
              <Fragment key={batch.id}>
                <Table.Tr
                  className={classes.row}
                  onClick={() => onToggleBatch(batch.id)}
                >
                  <Table.Td>
                    <span
                      className={`${classes.chevron} ${isExpanded ? classes.chevronOpen : ''}`}
                    >
                      <IconChevronRight size={13} />
                    </span>
                  </Table.Td>
                  <Table.Td className={classes.batchNumber}>{batch.batchNumber}</Table.Td>
                  <Table.Td className={classes.batchName}>{batch.name}</Table.Td>
                  <Table.Td className={classes.batchDescription}>{batch.description}</Table.Td>
                  <Table.Td className={classes.cuitCountCell}>
                    <Badge variant="light" color="blue" radius="xl">
                      {batch.cuitCount}
                    </Badge>
                  </Table.Td>
                  <Table.Td className={classes.batchDate}>{batch.createdAt}</Table.Td>
                  <Table.Td onClick={(event) => event.stopPropagation()}>
                    <BatchManagementMenu />
                  </Table.Td>
                </Table.Tr>
                {isExpanded ? (
                  <Table.Tr key={`${batch.id}-details`}>
                    <Table.Td colSpan={7} className={classes.detailCell}>
                      <BatchDetailRow batch={batch} />
                    </Table.Td>
                  </Table.Tr>
                ) : null}
              </Fragment>
            )
          })}
        </Table.Tbody>
      </Table>
    </div>
  )
}
