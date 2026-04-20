'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  PasswordInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import {
  IconAdjustments,
  IconEdit,
  IconHome2,
  IconKey,
  IconLogout2,
  IconChevronDown,
  IconEye,
  IconEyeOff,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUserCog,
  IconUserOff,
  IconUsers
} from '@tabler/icons-react';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import type {
  IAdminPanelCreateUserInput,
  IAdminPanelData,
  IAdminPanelUpdateUserInput,
  IAdminPanelUser
} from '../../../data/models/AdminPanel';
import { useAdminPanelShell } from './useAdminPanelShell';
import classes from './AdminPanelShell.module.css';

const modalInputClasses = {
  label: classes.modalLabel,
  input: classes.modalInput,
  section: classes.modalInputSection,
  dropdown: classes.modalDropdown,
  option: classes.modalOption
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function MetricCard({
  icon,
  value,
  label,
  caption
}: {
  icon: ReactNode;
  value: number;
  label: string;
  caption: string;
}) {
  return (
    <Card className={classes.metricCard} padding="xl" radius="md">
      <Stack gap="xs">
        <div className={classes.metricIconBox}>{icon}</div>
        <Text className={classes.metricValue}>{value}</Text>
        <Text className={classes.metricLabel}>{label}</Text>
        <Text className={classes.metricCaption}>{caption}</Text>
      </Stack>
    </Card>
  );
}

function UserFormModal({
  opened,
  title,
  submitLabel,
  initialUser,
  roleOptions,
  onClose,
  onSubmit
}: {
  opened: boolean;
  title: string;
  submitLabel: string;
  initialUser?: IAdminPanelUser | null;
  roleOptions: string[];
  onClose: () => void;
  onSubmit: (payload: IAdminPanelCreateUserInput | IAdminPanelUpdateUserInput) => void;
}) {
  const [fullName, setFullName] = useState(initialUser?.fullName ?? '');
  const [lastName, setLastName] = useState(
    initialUser?.fullName?.split(' ').slice(1).join(' ') ?? ''
  );
  const [email, setEmail] = useState(initialUser?.email ?? '');
  const [roleLabel, setRoleLabel] = useState(initialUser?.roleLabel ?? roleOptions[0] ?? '');
  const [password, setPassword] = useState('**********');

  const handleSubmit = () => {
    if (!fullName.trim() || !lastName.trim() || !email.trim() || !roleLabel.trim()) {
      return;
    }

    const resolvedFullName = `${fullName.trim()} ${lastName.trim()}`;

    if (initialUser) {
      onSubmit({
        id: initialUser.id,
        fullName: resolvedFullName,
        email,
        roleLabel
      });
      return;
    }

    onSubmit({
      fullName: resolvedFullName,
      email,
      roleLabel
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={null}
      centered
      withCloseButton={false}
      classNames={{
        content: classes.modalContent,
        body: classes.modalBody
      }}
    >
      <Stack gap={0}>
        <Stack gap={2}>
          <Title order={3} className={classes.modalTitle}>
            {title}
          </Title>
          <Text className={classes.modalSubtitle}>
            Completá los datos para agregar una nueva cuenta
          </Text>
        </Stack>

        <div className={classes.modalDivider} />

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" verticalSpacing="lg">
          <TextInput
            label={
              <span className={classes.modalLabel}>
                Nombre<span className={classes.modalRequired}>*</span>
              </span>
            }
            placeholder=""
            value={fullName}
            onChange={(event) => setFullName(event.currentTarget.value)}
            classNames={modalInputClasses}
          />

          <TextInput
            label={
              <span className={classes.modalLabel}>
                Apellido<span className={classes.modalRequired}>*</span>
              </span>
            }
            placeholder=""
            value={lastName}
            onChange={(event) => setLastName(event.currentTarget.value)}
            classNames={modalInputClasses}
          />
        </SimpleGrid>

        <TextInput
          mt="lg"
          label={
            <span className={classes.modalLabel}>
              Email<span className={classes.modalRequired}>*</span>
            </span>
          }
          placeholder="Ejemplo@gmail.com"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          classNames={modalInputClasses}
        />

        <Select
          mt="lg"
          label={
            <span className={classes.modalLabel}>
              Cargo<span className={classes.modalRequired}>*</span>
            </span>
          }
          placeholder="Selecciona un cargo ..."
          value={roleLabel}
          data={roleOptions}
          onChange={(value) => setRoleLabel(value ?? '')}
          rightSection={<IconChevronDown size={18} stroke={1.8} />}
          classNames={modalInputClasses}
        />

        <PasswordInput
          mt="lg"
          label={
            <span className={classes.modalLabel}>
              Contraseña<span className={classes.modalRequired}>*</span>
            </span>
          }
          placeholder="**********"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          visibilityToggleIcon={({ reveal }) =>
            reveal ? <IconEyeOff size={18} stroke={1.8} /> : <IconEye size={18} stroke={1.8} />
          }
          classNames={modalInputClasses}
        />

        <div className={classes.modalDivider} />

        <Group justify="flex-end" gap="md">
          <Button variant="default" onClick={onClose} className={classes.modalCancelButton}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className={classes.primaryButton}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

function PasswordModal({
  opened,
  user,
  onClose,
  onConfirm
}: {
  opened: boolean;
  user: IAdminPanelUser | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal opened={opened} onClose={onClose} title="Registrar cambio de contraseña" centered>
      <Stack gap="md">
        <Text className={classes.modalHint}>
          Esta acción registrará un cambio de contraseña para{' '}
          <strong>{user?.fullName ?? 'el usuario seleccionado'}</strong> dentro del
          histórico del panel.
        </Text>

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button leftSection={<IconKey size={16} />} onClick={onConfirm}>
            Confirmar cambio
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

function DeleteModal({
  opened,
  user,
  onClose,
  onConfirm
}: {
  opened: boolean;
  user: IAdminPanelUser | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal opened={opened} onClose={onClose} title="Eliminar usuario" centered>
      <Stack gap="sm">
        <Text className={classes.modalHint}>
          Estás por eliminar a <strong>{user?.fullName ?? 'este usuario'}</strong> del
          listado activo. La acción impactará en el histórico del panel.
        </Text>

        {user?.isAdmin ? (
          <Text className={classes.dangerText}>
            El usuario administrador no puede eliminarse.
          </Text>
        ) : null}

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button color="red" onClick={onConfirm} disabled={user?.isAdmin}>
            Eliminar usuario
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

function HomeSection({
  metrics,
  activeUsersCount,
  filteredUsers,
  selectedUser,
  createOpened,
  editOpened,
  passwordOpened,
  deleteOpened,
  roleOptions,
  searchValue,
  setSearchValue,
  openCreateModal,
  openEditModal,
  openPasswordModal,
  openDeleteModal,
  closeCreateModal,
  closeEditModal,
  closePasswordModal,
  closeDeleteModal,
  createUser,
  updateUser,
  registerPasswordChange,
  deleteUser
}: {
  metrics: {
    activeUsers: number;
    deletedUsers: number;
    passwordChanges: number;
    distinctRoles: number;
  };
  activeUsersCount: number;
  filteredUsers: IAdminPanelUser[];
  selectedUser: IAdminPanelUser | null;
  createOpened: boolean;
  editOpened: boolean;
  passwordOpened: boolean;
  deleteOpened: boolean;
  roleOptions: string[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  openCreateModal: () => void;
  openEditModal: (user: IAdminPanelUser) => void;
  openPasswordModal: (user: IAdminPanelUser) => void;
  openDeleteModal: (user: IAdminPanelUser) => void;
  closeCreateModal: () => void;
  closeEditModal: () => void;
  closePasswordModal: () => void;
  closeDeleteModal: () => void;
  createUser: (input: IAdminPanelCreateUserInput) => void;
  updateUser: (input: IAdminPanelUpdateUserInput) => void;
  registerPasswordChange: () => void;
  deleteUser: () => void;
}) {
  return (
    <>
      <Stack gap={28}>
        <Stack gap={6}>
          <Title order={1} className={classes.heroTitle}>
            Bienvenido, Administrador 👋
          </Title>
          <Text className={classes.heroDate}>
            {new Intl.DateTimeFormat('es-AR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }).format(new Date())}
          </Text>
        </Stack>

        <Stack gap="md">
          <Title order={2} className={classes.sectionTitle}>
            Métricas
          </Title>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
            <MetricCard
              icon={<IconUsers size={20} />}
              value={metrics.activeUsers}
              label="Usuarios activos"
              caption="Cuentas registradas"
            />
            <MetricCard
              icon={<IconUserOff size={20} />}
              value={metrics.deletedUsers}
              label="Usuarios eliminados"
              caption="Histórico acumulado"
            />
            <MetricCard
              icon={<IconKey size={20} />}
              value={metrics.passwordChanges}
              label="Contraseñas cambiadas"
              caption="Histórico acumulado"
            />
            <MetricCard
              icon={<IconUserCog size={20} />}
              value={metrics.distinctRoles}
              label="Cargos distintos"
              caption="Perfiles únicos"
            />
          </SimpleGrid>
        </Stack>

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
              withTableBorder
              withColumnBorders={false}
              withRowBorders
              verticalSpacing="sm"
              horizontalSpacing="md"
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
                            size="md"
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
      </Stack>

      <UserFormModal
        key={`create-${createOpened ? 'open' : 'closed'}`}
        opened={createOpened}
        title="Nuevo usuario"
        submitLabel="Crear usuario"
        roleOptions={roleOptions}
        onClose={closeCreateModal}
        onSubmit={createUser}
      />
      <UserFormModal
        key={`edit-${selectedUser?.id ?? 'empty'}-${editOpened ? 'open' : 'closed'}`}
        opened={editOpened}
        title="Editar usuario"
        submitLabel="Guardar cambios"
        initialUser={selectedUser}
        roleOptions={roleOptions}
        onClose={closeEditModal}
        onSubmit={(payload) => {
          if ('id' in payload) {
            updateUser(payload)
          }
        }}
      />
      <PasswordModal
        opened={passwordOpened}
        user={selectedUser}
        onClose={closePasswordModal}
        onConfirm={registerPasswordChange}
      />
      <DeleteModal
        opened={deleteOpened}
        user={selectedUser}
        onClose={closeDeleteModal}
        onConfirm={deleteUser}
      />
    </>
  );
}

function SettingsSection() {
  return (
    <Paper radius="lg" p="xl" className={classes.settingsCard}>
      <Stack gap="sm">
        <Title order={2} className={classes.sectionTitle}>
          Configuración del panel
        </Title>
        <Text className={classes.panelSubtitle}>
          Esta sección se mantiene dentro de `/admin` y no crea nuevas rutas en esta
          iteración. Queda reservada para extender el panel más adelante.
        </Text>
      </Stack>
    </Paper>
  );
}

export default function AdminPanelShell({
  data,
  session
}: {
  data: IAdminPanelData;
  session: IAuthSession;
}) {
  const {
    section,
    metrics,
    searchValue,
    activeUsersCount,
    filteredUsers,
    selectedUser,
    createOpened,
    editOpened,
    passwordOpened,
    deleteOpened,
    isSignOutPending,
    roleOptions,
    setSection,
    setSearchValue,
    signOut,
    createUser,
    updateUser,
    registerPasswordChange,
    deleteUser,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openPasswordModal,
    closePasswordModal,
    openDeleteModal,
    closeDeleteModal
  } = useAdminPanelShell(data);

  return (
    <div className={classes.page}>
      <div className={classes.layout}>
        <header className={classes.header}>
          <div className={classes.headerInner}>
            <div className={classes.brand}>
              <div className={classes.brandMark}>
                <Image
                  src="/assets/branding/logo.svg"
                  alt="Dirección Provincial de Rentas"
                  width={96}
                  height={32}
                  className={classes.brandLogo}
                />
              </div>
              <span className={classes.divider} />
              <Text className={classes.headerTitle}>Panel de Administración</Text>
            </div>

            <div className={classes.headerActions}>
              <div className={classes.profileChip}>
                <Avatar
                  size={30}
                  color="indigo"
                  radius="xl"
                  className={classes.profileAvatar}
                >
                  {getInitials(session.user.userName)}
                </Avatar>
                <Text className={classes.profileLabel}>Administrador</Text>
              </div>

              <Button
                variant="default"
                color="gray"
                radius="md"
                leftSection={<IconLogout2 size={16} stroke={1.8} />}
                onClick={signOut}
                loading={isSignOutPending}
                className={classes.secondaryButton}
              >
                Salir
              </Button>
            </div>
          </div>
        </header>

        <aside className={classes.sidebar}>
          <div className={classes.sidebarInner}>
            <nav className={classes.navList} aria-label="Secciones del panel admin">
              <button
                type="button"
                className={`${classes.navItem} ${
                  section === 'home' ? classes.navItemActive : ''
                }`}
                onClick={() => setSection('home')}
              >
                <IconHome2 size={18} />
                Inicio
              </button>
              <button
                type="button"
                className={`${classes.navItem} ${
                  section === 'settings' ? classes.navItemActive : ''
                }`}
                onClick={() => setSection('settings')}
              >
                <IconAdjustments size={18} />
                Configuración
              </button>
            </nav>
          </div>
        </aside>

        <main className={classes.main}>
          <div className={classes.content}>
            {section === 'home' ? (
              <HomeSection
                metrics={metrics}
                activeUsersCount={activeUsersCount}
                filteredUsers={filteredUsers}
                selectedUser={selectedUser}
                createOpened={createOpened}
                editOpened={editOpened}
                passwordOpened={passwordOpened}
                deleteOpened={deleteOpened}
                roleOptions={roleOptions}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                openCreateModal={openCreateModal}
                openEditModal={openEditModal}
                openPasswordModal={openPasswordModal}
                openDeleteModal={openDeleteModal}
                closeCreateModal={closeCreateModal}
                closeEditModal={closeEditModal}
                closePasswordModal={closePasswordModal}
                closeDeleteModal={closeDeleteModal}
                createUser={createUser}
                updateUser={updateUser}
                registerPasswordChange={registerPasswordChange}
                deleteUser={deleteUser}
              />
            ) : (
              <SettingsSection />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
