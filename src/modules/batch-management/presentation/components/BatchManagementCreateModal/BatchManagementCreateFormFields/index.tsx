'use client'

import { Group, Select, Text, TextInput } from '@mantine/core'
import { BATCH_REGIME_OPTIONS } from '../../../constants'
import type { BatchManagementCreateModalViewModel } from '../useBatchManagementCreateModal'
import classes from './BatchManagementCreateFormFields.module.css'

type BatchManagementCreateFormFieldsProps = {
  fields: BatchManagementCreateModalViewModel['fields']
}

export function BatchManagementCreateFormFields({
  fields
}: BatchManagementCreateFormFieldsProps) {
  return (
    <>
      <Group grow gap="md" align="flex-start" className={classes.topFieldRow}>
        <div className={classes.fieldGroup}>
          <Text className={classes.fieldLabel}>
            Nombre del lote <span className={classes.required}>*</span>
          </Text>
          <TextInput
            placeholder="Ej: ANOVA-623"
            classNames={{ input: classes.fieldInput }}
            {...fields.nameInput}
          />
        </div>

        <div className={classes.fieldGroup}>
          <Text className={classes.fieldLabel}>
            Tipo de contribuyente <span className={classes.required}>*</span>
          </Text>
          <Select
            data={[...BATCH_REGIME_OPTIONS]}
            placeholder="Seleccioná tipo de contribuyente"
            classNames={{
              input: classes.fieldSelectInput,
              dropdown: classes.fieldSelectDropdown,
              options: classes.fieldSelectOptions,
              option: classes.fieldSelectOption
            }}
            {...fields.regimeInput}
          />
        </div>
      </Group>

      <div className={classes.fieldGroup}>
        <Text className={classes.fieldLabel}>Descripción del lote</Text>
        <TextInput
          placeholder="Ej: Comercio mayorista con variación negativa 2024"
          classNames={{ input: classes.fieldInput }}
          {...fields.descriptionInput}
        />
      </div>
    </>
  )
}
