import { Stack, Text, Title } from '@mantine/core'
import classes from '../../styles/AdminPanel.module.css'

export function AdminPanelHomeHeader({
  formattedDate
}: AdminPanelHomeHeaderProps) {
  return (
    <Stack gap={8} className={classes.widgetTitleBlock}>
      <Title order={1} className={classes.heroTitle}>
        Bienvenido, Administrador
      </Title>
      <Text className={classes.heroDate}>{formattedDate}</Text>
    </Stack>
  )
}

interface AdminPanelHomeHeaderProps {
  formattedDate: string
}
