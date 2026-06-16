'use client'

import type { IntimationTemplateController } from '../../../hooks/intimation-template'
import { IntimationTemplate } from '../../IntimationTemplate'

type ConfigurationIntimationViewProps = {
  hidden: boolean
  controller: IntimationTemplateController
  allowedColumns?: boolean
  onConfirm?: () => void
  isConfirmPending?: boolean
}

export function ConfigurationIntimationView({
  hidden,
  controller,
  allowedColumns = false,
  onConfirm,
  isConfirmPending
}: ConfigurationIntimationViewProps) {
  return (
    <div hidden={hidden}>
      <IntimationTemplate
        controller={controller}
        allowedColumns={allowedColumns}
        onConfirm={onConfirm}
        isConfirmPending={isConfirmPending}
      />
    </div>
  )
}
