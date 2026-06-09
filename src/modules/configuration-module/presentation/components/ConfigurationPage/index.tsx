'use client'

import { useConfigurationPage } from '../../hooks/configuration-page'
import { ConfigurationContentView } from './ConfigurationContentView'
import { ConfigurationHeader } from './ConfigurationHeader'
import { ConfigurationTabs } from './ConfigurationTabs'
import classes from './ConfigurationPage.module.css'

export function ConfigurationPage() {
  const controller = useConfigurationPage()

  return (
    <div className={classes.page}>
      <div className={classes.shell}>
        <div className={classes.shellBody}>
          <ConfigurationHeader />

          <ConfigurationTabs {...controller.tabs} />

          <ConfigurationContentView content={controller.content} />
        </div>
      </div>
    </div>
  )
}
