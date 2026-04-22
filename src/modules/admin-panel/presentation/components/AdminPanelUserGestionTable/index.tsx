import { ActionIcon, Avatar, Badge, Button, Stack, Table, Text, TextInput, Title } from '@mantine/core';
import { IconEdit, IconKey, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import type { IAdminPanelUser } from '../../../data/models/AdminPanel';
import { getInitials } from '../../utils/getInitials';
import classes from '../AdminPanelShell/AdminPanelShell.module.css';

export function AdminPanelUserGestionTable({
  activeUsersCount,
  filteredUsers,
  searchValue,
  setSearchValue,
  openCreateModal,
  openEditModal,
  openPasswordModal,
  openDeleteModal
}: {
  activeUsersCount: number;
  filteredUsers: IAdminPanelUser[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  openCreateModal: () => void;
  openEditModal: (user: IAdminPanelUser) => void;
  openPasswordModal: (user: IAdminPanelUser) => void;
  openDeleteModal: (user: IAdminPanelUser) => void;
}) {
  return (
    <Stack gap="lg">
      <div className={classes.panelHeader}>
        <Stack gap={4}>
          <Title order={2} className={classes.sectionTitle}>
            Gestión de usuarios
          </Title>
          <Text className={classes.panelSubtitle}>
            Administrá las cuentas del sistema
          </Text>
        </Stack>

        <Button
          leftSection={<IconPlus size={18} />}
          radius="xl"
          size="sm"
          onClick={openCreateModal}
          className={classes.primaryButton}
        >
          Nuevo usuario
        </Button>
      </div>

      <div className={classes.searchRow}>
        <TextInput
          leftSection={<IconSearch size={16} />}
          placeholder={`Buscar entre ${activeUsersCount} usuarios...`}
          value={searchValue}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          className={classes.searchInput}
        />
        <Text className={classes.searchCounter}>{filteredUsers.length} usuarios</Text>
      </div>

      <div className={classes.tableWrap}>
        <Table
          highlightOnHover
          withTableBorder={false}
          withColumnBorders={false}
          withRowBorders
          verticalSpacing="md"
          horizontalSpacing="lg"
          className={classes.table}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Usuario</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Cargo</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredUsers.length ? (
              filteredUsers.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>
                    <div className={classes.userCell}>
                      <Avatar
                        color={user.avatarColor}
                        radius="xl"
                        size={36}
                        className={classes.userAvatar}
                      >
                        {getInitials(user.fullName)}
                      </Avatar>
                      <Text className={classes.userName}>{user.fullName}</Text>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Text className={classes.emailCell}>{user.email}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge radius="xl" variant="light" className={classes.roleBadge}>
                      {user.roleLabel}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <div className={classes.actions}>
                      <ActionIcon
                        variant="light"
                        color="indigo"
                        radius="md"
                        className={`${classes.actionButton} ${classes.editAction}`}
                        onClick={() => openEditModal(user)}
                      >
                        <IconEdit size={17} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="yellow"
                        radius="md"
                        className={`${classes.actionButton} ${classes.keyAction}`}
                        onClick={() => openPasswordModal(user)}
                      >
                        <IconKey size={17} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        radius="md"
                        className={`${classes.actionButton} ${classes.deleteAction}`}
                        onClick={() => openDeleteModal(user)}
                        disabled={user.isAdmin}
                      >
                        <IconTrash size={17} />
                      </ActionIcon>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text className={classes.emptyState}>
                    No hay usuarios que coincidan con la búsqueda actual.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>
    </Stack>
  );
}
