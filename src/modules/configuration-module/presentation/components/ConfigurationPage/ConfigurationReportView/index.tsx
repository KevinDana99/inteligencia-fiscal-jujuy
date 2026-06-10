'use client'

import type { ConfigurationPageController } from '../../../hooks/configuration-page'
import { ConfigurationInfoAlert } from '../ConfigurationInfoAlert'
import { ConfigurationReportForm } from '../ConfigurationReportForm'

type ConfigurationReportViewProps =
  ConfigurationPageController['content']['report']

export function ConfigurationReportView({
  hidden,
  informe,
  errors,
  onChange,
  onConfirm
}: ConfigurationReportViewProps) {
  return (
    <div hidden={hidden}>
      <ConfigurationInfoAlert />
      <ConfigurationReportForm
        informe={informe}
        errors={errors}
        onChange={onChange}
        onConfirm={onConfirm}
      />
    </div>
  )
}
