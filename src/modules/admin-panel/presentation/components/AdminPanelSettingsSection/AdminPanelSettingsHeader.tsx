import { Stack, Text, Title } from '@mantine/core'
import classes from '../../styles/AdminPanel.module.css'

export function AdminPanelSettingsHeader() {
  return (
    <Stack gap='xs'>
      <Title order={1} className={classes.heroTitle}>
        Configuración
      </Title>
      <Text className={classes.heroDate}>
        Administrá los parámetros generales del sistema
      </Text>
    </Stack>
  )
}
