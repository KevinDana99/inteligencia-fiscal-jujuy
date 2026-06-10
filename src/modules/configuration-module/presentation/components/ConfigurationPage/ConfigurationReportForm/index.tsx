'use client'

import { Card, Text, Textarea, TextInput } from '@mantine/core'
import type { ReportType } from '../../../../data/models/Configuration'
import { DASHBOARD_CONFIGURATION_LABELS } from '../../../constants'
import { useConfigurationReportForm } from '../../../hooks/configuration-page'
import classes from './ConfigurationReportForm.module.css'

type ConfigurationReportFormProps = {
  informe: ReportType
  onChange: (field: keyof ReportType, value: string) => void
}

export function ConfigurationReportForm({
  informe,
  onChange
}: ConfigurationReportFormProps) {
  const { titleInput, bodyInput } = useConfigurationReportForm({
    informe,
    onChange
  })

  return (
    <div className={classes.root}>
      <Card className={classes.sectionCard} radius='lg' padding={0}>
        <Text className={classes.sectionLabel}>
          {DASHBOARD_CONFIGURATION_LABELS.report.titleSection}
        </Text>
        <div className={classes.fieldGroup}>
          <Text className={classes.fieldTitle}>
            {DASHBOARD_CONFIGURATION_LABELS.report.titleField}
          </Text>
          <TextInput
            {...titleInput}
            classNames={{ input: classes.formInput }}
          />
        </div>
      </Card>

      <Card className={classes.sectionCard} radius='lg' padding={0}>
        <Text className={classes.sectionLabel}>
          {DASHBOARD_CONFIGURATION_LABELS.report.bodySection}
        </Text>
        <div className={classes.fieldGroup}>
          <Text className={classes.fieldTitle}>
            {DASHBOARD_CONFIGURATION_LABELS.report.bodyField}
          </Text>
          <Textarea
            {...bodyInput}
            minRows={5}
            classNames={{ input: classes.formInput }}
          />
        </div>
      </Card>

    </div>
  )
}
