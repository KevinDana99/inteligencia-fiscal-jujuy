'use client'

import type { BatchManagementCrossSectionController } from '../BatchManagementCrossMenu/useBatchManagementCrossMenu'
import { BatchManagementCrossPeriodFields } from './BatchManagementCrossPeriodFields'
import { BatchManagementCrossSectionHeader } from './BatchManagementCrossSectionHeader'
import { BatchManagementCrossTypeOptions } from './BatchManagementCrossTypeOptions'
import classes from './BatchManagementCrossSection.module.css'

type BatchManagementCrossSectionProps = {
  section: BatchManagementCrossSectionController
  comboboxProps: ReturnType<
    typeof import('../BatchManagementCrossMenu/useBatchManagementCrossMenu').useBatchManagementCrossMenu
  >['comboboxProps']
}

export function BatchManagementCrossSection({
  section,
  comboboxProps
}: BatchManagementCrossSectionProps) {
  const isMonthly = section.periodTone === 'monthly'

  return (
    <div className={classes.crossSection}>
      <BatchManagementCrossSectionHeader
        title={section.title}
        pillLabel={section.pillLabel}
        isOpen={section.isOpen}
        isMonthly={isMonthly}
        onToggle={section.onToggle}
      />
      {section.isOpen ? (
        <div className={classes.crossSectionBody}>
          <BatchManagementCrossPeriodFields
            section={section}
            comboboxProps={comboboxProps}
          />
          <BatchManagementCrossTypeOptions
            optionLabels={section.optionLabels}
            selectedCrossTypes={section.selectedCrossTypes}
            onCrossTypeToggle={section.onCrossTypeToggle}
          />
        </div>
      ) : null}
    </div>
  )
}
