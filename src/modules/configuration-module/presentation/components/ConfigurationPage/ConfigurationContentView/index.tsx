'use client'

import type { ConfigurationPageController } from '../../../hooks/configuration-page'
import { ConfigurationIntimationView } from '../ConfigurationIntimationView'
import { ConfigurationReportView } from '../ConfigurationReportView'
import classes from '../ConfigurationPage.module.css'

type ConfigurationContentViewProps = {
  content: ConfigurationPageController['content']
}

export function ConfigurationContentView({
  content
}: ConfigurationContentViewProps) {
  return (
    <div className={classes.contentView}>
      <div className={classes.viewColumn}>
        <ConfigurationIntimationView {...content.intimation} />
        <ConfigurationReportView {...content.report} />
      </div>
    </div>
  )
}
