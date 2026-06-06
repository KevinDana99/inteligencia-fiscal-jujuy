'use client'

import { IntimationTemplate } from '../IntimationTemplate'
import { useIntimationTemplate } from '../IntimationTemplate/useIntimationTemplate'
import { useDashboardConfiguration } from '../../hooks/useDashboardConfiguration'
import { ConfigurationHeader } from './ConfigurationHeader'
import { ConfigurationTabs } from './ConfigurationTabs'
import { ConfigurationInfoAlert } from './ConfigurationInfoAlert'
import { ConfigurationReportForm } from './ConfigurationReportForm'
import { ConfigurationSuccessModal } from './ConfigurationSuccessModal'
import classes from './ConfigurationPage.module.css'

export function ConfigurationPage() {
  const intimacionTemplate = useIntimationTemplate()
  const {
    informe,
    activeTab,
    successOpened,
    updateTab,
    updateInforme,
    confirmChanges,
    closeSuccess
  } = useDashboardConfiguration()

  return (
    <div className={classes.page}>
      <div className={classes.shell}>
        <div className={classes.shellBody}>
          <ConfigurationHeader />

          <ConfigurationTabs activeTab={activeTab} onChange={updateTab} />

          <div className={classes.contentView}>
            <div className={classes.viewColumn}>
              {activeTab === 'intimacion' ? (
                <IntimationTemplate
                  controller={intimacionTemplate}
                  onConfirm={confirmChanges}
                />
              ) : (
                <>
                  <ConfigurationInfoAlert />
                  <ConfigurationReportForm
                    informe={informe}
                    onChange={updateInforme}
                    onConfirm={confirmChanges}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfigurationSuccessModal
        opened={successOpened}
        onClose={closeSuccess}
      />
    </div>
  )
}
