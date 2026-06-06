'use client'

import { ActionIcon, Button, Card, Stack, Text, TextInput } from '@mantine/core'
import { IconPlus, IconXFilled } from '@tabler/icons-react'
import type { IntimationTemplateController } from '../useIntimationTemplate'
import { INTIMATION_TEMPLATE_LABELS } from '../../../constants'
import classes from './IntimationTemplateColumnsSection.module.css'

type IntimationTemplateColumnsSectionProps = {
  controller: IntimationTemplateController
}

export function IntimationTemplateColumnsSection({
  controller
}: IntimationTemplateColumnsSectionProps) {
  const {
    state,
    isProviderBacked,
    visibleColumns,
    updateColumn,
    removeColumn,
    openColumnPicker,
    updateField
  } = controller

  return (
    <Card className={classes.sectionCard} radius='lg' padding={0}>
      <Text className={classes.sectionLabel}>
        {INTIMATION_TEMPLATE_LABELS.sections.columns}
      </Text>
      <Text className={classes.sectionHint}>
        {INTIMATION_TEMPLATE_LABELS.hints.columns}
      </Text>

      <Stack gap='sm' className={classes.columnList}>
        {visibleColumns.map((column) => (
          <div key={column.id} className={classes.columnRow}>
            <span className={classes.columnToken}>✓</span>
            <TextInput
              value={column.value}
              onChange={(event) =>
                updateColumn(column.id, event.currentTarget.value)
              }
              readOnly={isProviderBacked}
              className={classes.columnInput}
              classNames={{ input: classes.formInput }}
            />
            <ActionIcon
              variant='subtle'
              color='red'
              aria-label={`Eliminar columna ${column.value}`}
              onClick={() => removeColumn(column.id)}
              className={classes.columnRemove}
            >
              <IconXFilled size={16} />
            </ActionIcon>
          </div>
        ))}
      </Stack>

      <Button
        variant='default'
        className={classes.addColumnButton}
        leftSection={<IconPlus size={14} />}
        onClick={openColumnPicker}
      >
        {INTIMATION_TEMPLATE_LABELS.buttons.addColumns}
      </Button>

      <div className={classes.fieldGroup}>
        <Text className={classes.fieldTitle}>
          {INTIMATION_TEMPLATE_LABELS.fields.informationSource}{' '}
          <span className={classes.optionalLabel}>
            {INTIMATION_TEMPLATE_LABELS.fields.informationSourceOptional}
          </span>
        </Text>
        <TextInput
          value={state.fuenteInformacion}
          onChange={(event) =>
            updateField('fuenteInformacion', event.currentTarget.value)
          }
          placeholder={INTIMATION_TEMPLATE_LABELS.placeholders.informationSource}
          classNames={{ input: classes.formInput }}
        />
      </div>

      <div className={classes.fieldGroupFooter}>
        <Text className={classes.fieldTitle}>
          {INTIMATION_TEMPLATE_LABELS.fields.cutoffDate}
        </Text>
        <TextInput
          value={state.fechaCorte}
          onChange={(event) =>
            updateField('fechaCorte', event.currentTarget.value)
          }
          classNames={{ input: classes.formInput }}
        />
      </div>
    </Card>
  )
}
