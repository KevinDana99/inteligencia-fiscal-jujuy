'use client'

import { Card, Text, TextInput } from '@mantine/core'
import type { IntimationTemplateController } from '../useIntimationTemplate'
import { INTIMATION_TEMPLATE_LABELS } from '../../../constants'
import classes from './IntimationTemplateSubjectSection.module.css'

type IntimationTemplateSubjectSectionProps = {
  controller: IntimationTemplateController
}

export function IntimationTemplateSubjectSection({
  controller
}: IntimationTemplateSubjectSectionProps) {
  const { state, updateField } = controller

  return (
    <Card className={classes.sectionCard} radius='lg' padding={0}>
      <Text className={classes.sectionLabel}>
        {INTIMATION_TEMPLATE_LABELS.sections.subject}
      </Text>
      <div className={classes.fieldGroup}>
        <Text className={classes.fieldTitle}>
          {INTIMATION_TEMPLATE_LABELS.fields.subject}
        </Text>
        <TextInput
          value={state.asunto}
          onChange={(event) => updateField('asunto', event.currentTarget.value)}
          classNames={{ input: classes.formInput }}
        />
      </div>
    </Card>
  )
}
