'use client'

import { Button, Card, Group, Text, Textarea, TextInput } from '@mantine/core'
import type { ReportType } from '../../../../data/models/Configuration'
import { DASHBOARD_CONFIGURATION_LABELS } from '../../../constants'
import classes from './ConfigurationReportForm.module.css'

type ConfigurationReportFormProps = {
  informe: ReportType
  onChange: (field: keyof ReportType, value: string) => void
  onConfirm: () => void
}

export function ConfigurationReportForm({
  informe,
  onChange,
  onConfirm
}: ConfigurationReportFormProps) {
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
            value={informe.titulo}
            onChange={(event) => onChange('titulo', event.currentTarget.value)}
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
            value={informe.cuerpo}
            onChange={(event) => onChange('cuerpo', event.currentTarget.value)}
            minRows={5}
            classNames={{ input: classes.formInput }}
          />
        </div>
      </Card>

      <Group justify='flex-end' className={classes.footerActions}>
        <Button className={classes.primaryButton} onClick={onConfirm}>
          {DASHBOARD_CONFIGURATION_LABELS.report.confirmButton}
        </Button>
      </Group>
    </div>
  )
}
