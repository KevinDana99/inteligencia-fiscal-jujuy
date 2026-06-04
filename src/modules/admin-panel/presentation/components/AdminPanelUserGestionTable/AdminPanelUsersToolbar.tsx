import { Button, Text, TextInput } from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { useAdminPanelUsersToolbar } from '../../hooks'
import classes from '../../styles/AdminPanel.module.css'

export function AdminPanelUsersToolbar({
  activeUsersCount,
  filteredUsersCount,
  searchValue,
  setSearchValue,
  onCreateUser
}: AdminPanelUsersToolbarProps) {
  const { searchPlaceholder, activeUsersLabel, handleSearchChange } =
    useAdminPanelUsersToolbar({
      activeUsersCount,
      filteredUsersCount,
      setSearchValue
    })

  return (
    <div className={classes.searchRow}>
      <div className={classes.searchRowContent}>
        <TextInput
          leftSection={<IconSearch size={16} />}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={handleSearchChange}
          className={classes.searchInput}
        />
        <Text className={classes.searchCounter}>{activeUsersLabel}</Text>
      </div>

      <Button
        leftSection={<IconPlus size={18} />}
        radius='xl'
        size='sm'
        onClick={onCreateUser}
        className={classes.primaryButton}
      >
        Nuevo usuario
      </Button>
    </div>
  )
}

interface AdminPanelUsersToolbarProps {
  activeUsersCount: number
  filteredUsersCount: number
  searchValue: string
  setSearchValue: (value: string) => void
  onCreateUser: () => void
}
