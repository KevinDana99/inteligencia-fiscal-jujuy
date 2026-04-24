'use client';

import { useState } from 'react';
import {
  Button,
  Group,
  Modal,
  PasswordInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { IconChevronDown, IconEye, IconEyeOff } from '@tabler/icons-react';
import type {
  IAdminPanelCreateUserInput,
  IAdminPanelUpdateUserInput,
  IAdminPanelUser
} from '../../../data/models/AdminPanel';
import classes from '../AdminPanelShell/AdminPanelShell.module.css';

const modalInputClasses = {
  label: classes.modalLabel,
  input: classes.modalInput,
  section: classes.modalInputSection,
  dropdown: classes.modalDropdown,
  option: classes.modalOption
};

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

export function AdminPanelModals({
  selectedUser,
  createOpened,
  editOpened,
  deleteOpened,
  roleOptions,
  closeCreateModal,
  closeEditModal,
  closeDeleteModal,
  createUser,
  updateUser,
  deleteUser
}: {
  selectedUser: IAdminPanelUser | null;
  createOpened: boolean;
  editOpened: boolean;
  deleteOpened: boolean;
  roleOptions: string[];
  closeCreateModal: () => void;
  closeEditModal: () => void;
  closeDeleteModal: () => void;
  createUser: (input: IAdminPanelCreateUserInput) => void;
  updateUser: (input: IAdminPanelUpdateUserInput) => void;
  deleteUser: () => void;
}) {
  return (
    <>
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
            updateUser(payload);
          }
        }}
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
