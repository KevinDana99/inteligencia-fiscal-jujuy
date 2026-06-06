'use client'

import {
  Button,
  Group,
  Modal,
  NumberInput,
  Radio,
  Select,
  Stack,
  Text
} from '@mantine/core'
import { IconInfoCircle, IconX } from '@tabler/icons-react'
import { useMemo } from 'react'
import type { ICrossFilterOperator } from '../../../data/models/CrossManagement'
import {
  CROSS_PREVIEW_FILTER_OPERATOR_LABELS
} from '../../constants/crossPreviewFilterOperators'
import {
  useCrossFilterModal,
  type ICrossFilterModalProps
} from './useCrossFilterModal'
import classes from './CrossFilterModal.module.css'

export function CrossFilterModal(props: ICrossFilterModalProps) {
  const {
    value,
    title,
    setConnector,
    setPrimaryOperator,
    setPrimaryValue,
    setSecondaryOperator,
    setSecondaryValue,
    handleClear,
    handleApply,
    handleClose
  } = useCrossFilterModal(props)
  const operatorOptions = useMemo<
    Array<{ value: ICrossFilterOperator | ''; label: string }>
  >(
    () => [
      { value: '', label: 'Seleccionar condición...' },
      ...props.allowedOperators.map((operator) => ({
        value: operator,
        label: CROSS_PREVIEW_FILTER_OPERATOR_LABELS[operator]
      }))
    ],
    [props.allowedOperators]
  )

  return (
    <Modal
      opened={props.opened}
      onClose={handleClose}
      centered
      size={480}
      withCloseButton={false}
      classNames={{
        overlay: classes.overlay,
        content: classes.content,
        body: classes.body
      }}
    >
      <Stack gap={0}>
        <div className={classes.header}>
          <div>
            <Text className={classes.title}>{title}</Text>
            <Text className={classes.subtitle}>Mostrar filas donde:</Text>
          </div>
          <button
            type='button'
            onClick={handleClose}
            className={classes.closeButton}
            aria-label='Cerrar modal de filtros'
          >
            <IconX size={16} stroke={2.2} />
          </button>
        </div>

        <div className={classes.section}>
          <Text className={classes.sectionTitle}>Condición 1</Text>
          <div className={classes.conditionRow}>
            <Select
              value={value.primary.operator}
              onChange={(nextValue) =>
                setPrimaryOperator((nextValue as ICrossFilterOperator | '') ?? '')
              }
              data={operatorOptions}
              className={classes.fieldGrow}
              classNames={{
                input: classes.fieldInput,
                dropdown: classes.dropdown,
                option: classes.option
              }}
              allowDeselect={false}
            />
            <NumberInput
              value={value.primary.value}
              onChange={(nextValue) => setPrimaryValue(String(nextValue ?? ''))}
              placeholder='0'
              className={classes.fieldGrow}
              classNames={{
                input: classes.fieldInput,
                controls: classes.numberControls,
                control: classes.numberControl
              }}
              hideControls={false}
              decimalScale={6}
              allowNegative
              allowDecimal
              trimLeadingZeroesOnBlur={false}
            />
          </div>
          <Text className={classes.exampleText}>Ejemplo: 1000, 25.5, -10</Text>
        </div>

        <div className={classes.section}>
          <Group gap={8} className={classes.logicHeader}>
            <Text className={classes.sectionTitle}>Conector lógico</Text>
            <div className={classes.infoPill} title='Y = ambas condiciones deben cumplirse. O = al menos una.'>
              <IconInfoCircle size={11} stroke={2} />
            </div>
          </Group>

          <div className={classes.logicGrid}>
            <button
              type='button'
              className={`${classes.logicCard} ${
                value.connector === 'Y' ? classes.logicCardActive : ''
              }`}
              onClick={() => setConnector('Y')}
            >
              <Radio
                checked={value.connector === 'Y'}
                onChange={() => setConnector('Y')}
                color='blue'
                classNames={{ radio: classes.logicRadio }}
              />
              <span className={classes.logicLabel}>
                Y <span>(Todas las condiciones)</span>
              </span>
            </button>

            <button
              type='button'
              className={`${classes.logicCard} ${
                value.connector === 'O' ? classes.logicCardActive : ''
              }`}
              onClick={() => setConnector('O')}
            >
              <Radio
                checked={value.connector === 'O'}
                onChange={() => setConnector('O')}
                color='blue'
                classNames={{ radio: classes.logicRadio }}
              />
              <span className={classes.logicLabel}>
                O <span>(Al menos una)</span>
              </span>
            </button>
          </div>
        </div>

        <div className={classes.section}>
          <Text className={classes.sectionTitle}>
            Condición 2 <span className={classes.optionalText}>(opcional)</span>
          </Text>
          <div className={classes.conditionRow}>
            <Select
              value={value.secondary.operator}
              onChange={(nextValue) =>
                setSecondaryOperator((nextValue as ICrossFilterOperator | '') ?? '')
              }
              data={[
                { value: '', label: 'Sin segunda condición' },
                ...operatorOptions.slice(1)
              ]}
              className={classes.fieldGrow}
              classNames={{
                input: classes.fieldInput,
                dropdown: classes.dropdown,
                option: classes.option
              }}
              allowDeselect={false}
            />
            <NumberInput
              value={value.secondary.value}
              onChange={(nextValue) => setSecondaryValue(String(nextValue ?? ''))}
              placeholder='0'
              className={classes.fieldGrow}
              classNames={{
                input: classes.fieldInput,
                controls: classes.numberControls,
                control: classes.numberControl
              }}
              hideControls={false}
              decimalScale={6}
              allowNegative
              allowDecimal
              trimLeadingZeroesOnBlur={false}
            />
          </div>
          <Text className={classes.exampleText}>Ejemplo: 1000, 25.5, -10</Text>
        </div>

        {props.error ? <Text className={classes.errorText}>{props.error}</Text> : null}

        <div className={classes.footer}>
          <Button
            variant='default'
            className={classes.footerButton}
            onClick={handleClear}
            disabled={props.isPending || !props.columnKey}
          >
            Limpiar
          </Button>
          <Button
            variant='default'
            className={classes.footerButton}
            onClick={handleClose}
            disabled={props.isPending}
          >
            Cancelar
          </Button>
          <Button
            className={classes.applyButton}
            onClick={handleApply}
            loading={props.isPending}
            disabled={!props.columnKey || props.allowedOperators.length === 0}
          >
            Aplicar
          </Button>
        </div>
      </Stack>
    </Modal>
  )
}
