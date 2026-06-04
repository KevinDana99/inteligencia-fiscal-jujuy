import { Card, Group, Text } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import classes from '../../styles/AdminPanel.module.css'

export function AdminPanelSettingsInfoCard() {
  return (
    <Card className={classes.configInfoCard} radius='md' padding='md'>
      <Group gap='sm' align='flex-start' className={classes.configInfoRow}>
        <IconInfoCircle className={classes.configInfoIcon} />

        <div className={classes.configInfoContent}>
          <Text className={classes.configInfoTitle}>
            ¿Cómo funciona la validación?
          </Text>
          <Text className={classes.configInfoText}>
            Al crear o modificar un usuario, el sistema verificará que el email
            ingresado termine con alguno de los dominios listados arriba. Si el
            email no coincide, se mostrará un error y no se podrá guardar el
            usuario.
          </Text>
        </div>
      </Group>
    </Card>
  )
}
