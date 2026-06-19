'use client'

import { Group, Select, Text, TextInput } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
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
      <div className={classes.fieldGroup}>
        <Text className={classes.fieldLabel}>
          Tipo de contribuyente <span className={classes.required}>*</span>
        </Text>
        {fields.regimeInput.disabled ? (
          <>
            <Group gap={6} className={classes.lockedRegimeBadge}>
              <IconInfoCircle size={13} stroke={2} />
              <Text span className={classes.lockedRegimeBadgeText}>
                {fields.regimeInput.label ?? fields.regimeInput.value}
              </Text>
            </Group>
            {fields.regimeInput.helperText ? (
              <Text className={classes.fieldHelperText}>
                {fields.regimeInput.helperText}
              </Text>
            ) : null}
          </>
        ) : (
          <Select
            data={fields.regimeInput.data}
            placeholder="Seleccioná tipo de contribuyente"
            classNames={{
              input: classes.fieldSelectInput,
              dropdown: classes.fieldSelectDropdown,
              options: classes.fieldSelectOptions,
              option: classes.fieldSelectOption
            }}
            value={fields.regimeInput.value}
            disabled={fields.regimeInput.disabled}
            onChange={fields.regimeInput.onChange}
          />
        )}
      </div>

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
