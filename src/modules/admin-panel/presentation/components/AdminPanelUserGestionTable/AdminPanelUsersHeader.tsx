import { Stack, Text, Title } from '@mantine/core'
import classes from '../../styles/AdminPanel.module.css'

export function AdminPanelUsersHeader() {
  return (
    <div className={classes.panelHeader}>
      <Stack gap={4}>
        <Title order={2} className={classes.sectionTitle}>
          Gestión de usuarios
        </Title>
        <Text className={classes.panelSubtitle}>
          Administrá las cuentas del sistema
        </Text>
      </Stack>
    </div>
  )
}
