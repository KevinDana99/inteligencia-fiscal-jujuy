import { Table, Text } from '@mantine/core'
import classes from '../../styles/AdminPanel.module.css'

export function AdminPanelUsersEmptyState() {
  return (
    <Table.Tr>
      <Table.Td colSpan={4}>
        <Text className={classes.emptyState}>
          No hay usuarios que coincidan con la búsqueda actual.
        </Text>
      </Table.Td>
    </Table.Tr>
  )
}
