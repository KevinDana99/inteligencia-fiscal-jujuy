'use client'

import type { ConfigurationPageController } from '../../../hooks/configuration-page'
import { ConfigurationInfoAlert } from '../ConfigurationInfoAlert'
import { ConfigurationReportForm } from '../ConfigurationReportForm'

type ConfigurationReportViewProps =
  ConfigurationPageController['content']['report']

export function ConfigurationReportView({
  hidden,
  informe,
  onChange
}: ConfigurationReportViewProps) {
  return (
    <div hidden={hidden}>
      <ConfigurationInfoAlert />
      <ConfigurationReportForm
        informe={informe}
        onChange={onChange}
      />
    </div>
  )
}
