'use client'

import type { IntimationTemplateController } from '../../../hooks/intimation-template'
import { IntimationTemplate } from '../../IntimationTemplate'

type ConfigurationIntimationViewProps = {
  hidden: boolean
  controller: IntimationTemplateController
  onConfirm?: () => void
  isConfirmPending?: boolean
}

export function ConfigurationIntimationView({
  hidden,
  controller,
  onConfirm,
  isConfirmPending
}: ConfigurationIntimationViewProps) {
  return (
    <div hidden={hidden}>
      <IntimationTemplate
        controller={controller}
        onConfirm={onConfirm}
        isConfirmPending={isConfirmPending}
      />
    </div>
  )
}
