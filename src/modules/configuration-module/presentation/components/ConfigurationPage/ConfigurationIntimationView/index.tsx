'use client'

import { IntimationTemplate } from '../../IntimationTemplate'
import type { ConfigurationPageController } from '../../../hooks/configuration-page'

type ConfigurationIntimationViewProps =
  ConfigurationPageController['content']['intimation']

export function ConfigurationIntimationView({
  hidden,
  controller
}: ConfigurationIntimationViewProps) {
  return (
    <div hidden={hidden}>
      <IntimationTemplate controller={controller} />
    </div>
  )
}
