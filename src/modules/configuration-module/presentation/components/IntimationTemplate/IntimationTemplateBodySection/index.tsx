'use client'

import { Card, Stack, Text, Textarea, TextInput } from '@mantine/core'
import type { IntimationTemplateController } from '../useIntimationTemplate'
import { INTIMATION_TEMPLATE_LABELS } from '../../../constants'
import classes from './IntimationTemplateBodySection.module.css'

type IntimationTemplateBodySectionProps = {
  controller: IntimationTemplateController
}

export function IntimationTemplateBodySection({
  controller
}: IntimationTemplateBodySectionProps) {
  const { state, updateField } = controller

  return (
    <Card className={classes.sectionCard} radius='lg' padding={0}>
      <Text className={classes.sectionLabel}>
        {INTIMATION_TEMPLATE_LABELS.sections.body}
      </Text>
      <Stack gap='md'>
        <div className={classes.fieldGroup}>
          <Text className={classes.fieldTitle}>
            {INTIMATION_TEMPLATE_LABELS.fields.greeting}
          </Text>
          <TextInput
            value={state.saludo}
            onChange={(event) => updateField('saludo', event.currentTarget.value)}
            classNames={{ input: classes.formInput }}
          />
        </div>

        <div className={classes.fieldGroup}>
          <Text className={classes.fieldTitle}>
            {INTIMATION_TEMPLATE_LABELS.fields.body}
          </Text>
          <Textarea
            value={state.cuerpo}
            onChange={(event) => updateField('cuerpo', event.currentTarget.value)}
            classNames={{ input: classes.formInput }}
          />
        </div>
      </Stack>
    </Card>
  )
}
