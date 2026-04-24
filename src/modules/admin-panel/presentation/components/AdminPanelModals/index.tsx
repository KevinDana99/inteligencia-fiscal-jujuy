'use client';

import { useMemo, useState } from 'react';
import {
  Button,
  Group,
  Modal,
  PasswordInput,
  Select,
  Stack,
  Text,
  ThemeIcon,
  TextInput,
  Title
} from '@mantine/core';
import {
  IconCheck,
  IconChevronDown,
  IconDoorExit,
  IconEye,
  IconEyeOff,
  IconTrash
} from '@tabler/icons-react';
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

const modalErrorInputClasses = {
  ...modalInputClasses,
  input: `${classes.modalInput} ${classes.modalInputError}`
};

function getPasswordStrength(password: string) {
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password)
  ];

  return checks.filter(Boolean).length;
}

function UserFormModal({
  opened,
  title,
  subtitle,
  submitLabel,
  initialUser,
  roleOptions,
  onClose,
  onSubmit
}: {
  opened: boolean;
  title: string;
  subtitle: string;
  submitLabel: string;
  initialUser?: IAdminPanelUser | null;
  roleOptions: string[];
  onClose: () => void;
  onSubmit: (payload: IAdminPanelCreateUserInput | IAdminPanelUpdateUserInput) => void;
}) {
  const [firstName, setFirstName] = useState(initialUser?.fullName?.split(' ')[0] ?? '');
  const [lastName, setLastName] = useState(
    initialUser?.fullName?.split(' ').slice(1).join(' ') ?? ''
  );
  const [email, setEmail] = useState(initialUser?.email ?? '');
  const [roleLabel, setRoleLabel] = useState(initialUser?.roleLabel ?? roleOptions[0] ?? '');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordColor =
    passwordStrength <= 1
      ? 'red'
      : passwordStrength === 2
        ? 'orange'
        : passwordStrength === 3
          ? 'yellow'
          : passwordStrength === 4
            ? 'green'
            : 'teal';

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      nextErrors.firstName = 'El nombre es obligatorio.';
    }

    if (!lastName.trim()) {
      nextErrors.lastName = 'El apellido es obligatorio.';
    }

    if (!email.trim()) {
      nextErrors.email = 'El email es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Ingresá un email válido.';
    }

    if (!roleLabel.trim()) {
      nextErrors.roleLabel = 'Seleccioná un cargo.';
    }

    if (password.trim().length < 8) {
      nextErrors.password = 'Mínimo 8 caracteres.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const resolvedFullName = `${firstName.trim()} ${lastName.trim()}`;

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
      title={
        <Stack gap="xs">
          <Title order={3} className={classes.modalTitle}>
            {title}
          </Title>
          <Text className={classes.modalSubtitle}>{subtitle}</Text>
        </Stack>
      }
      centered
      classNames={{
        header: classes.modalHeader,
        content: classes.modalContent,
        body: classes.modalBody,
        overlay: classes.modalOverlay
      }}
    >
      <div className={classes.modalSection}>
        <div className={classes.formRow2}>
          <div className={classes.modalField}>
            <TextInput
              label={
                <span className={classes.modalLabel}>
                  Nombre<span className={classes.modalRequired}>*</span>
                </span>
              }
              value={firstName}
              onChange={(event) => setFirstName(event.currentTarget.value)}
              classNames={errors.firstName ? modalErrorInputClasses : modalInputClasses}
            />
            {errors.firstName ? <Text className={classes.modalError}>{errors.firstName}</Text> : null}
          </div>

          <div className={classes.modalField}>
            <TextInput
              label={
                <span className={classes.modalLabel}>
                  Apellido<span className={classes.modalRequired}>*</span>
                </span>
              }
              value={lastName}
              onChange={(event) => setLastName(event.currentTarget.value)}
              classNames={errors.lastName ? modalErrorInputClasses : modalInputClasses}
            />
            {errors.lastName ? <Text className={classes.modalError}>{errors.lastName}</Text> : null}
          </div>
        </div>

        <div className={classes.modalField}>
          <TextInput
            mt="md"
            type="email"
            label={
              <span className={classes.modalLabel}>
                Email<span className={classes.modalRequired}>*</span>
              </span>
            }
            placeholder="Ejemplo@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            classNames={errors.email ? modalErrorInputClasses : modalInputClasses}
          />
          {errors.email ? <Text className={classes.modalError}>{errors.email}</Text> : null}
        </div>

        <div className={classes.modalField}>
          <Select
            mt="md"
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
            classNames={errors.roleLabel ? modalErrorInputClasses : modalInputClasses}
          />
          {errors.roleLabel ? <Text className={classes.modalError}>{errors.roleLabel}</Text> : null}
        </div>

        <div className={classes.modalField}>
          <PasswordInput
            mt="md"
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
            classNames={errors.password ? modalErrorInputClasses : modalInputClasses}
          />
          {errors.password ? <Text className={classes.modalError}>{errors.password}</Text> : null}
        </div>

        <div className={classes.passwordStrengthRoot}>
          <div
            className={classes.passwordStrengthBar}
            style={{
              width: `${passwordStrength * 20}%`,
              background: `var(--mantine-color-${passwordColor}-${passwordColor === 'teal' ? 6 : 5})`
            }}
          />
        </div>
      </div>

      <div className={classes.modalFooter}>
        <Group justify="flex-end" gap={10}>
          <Button variant="default" size="sm" onClick={onClose} className={classes.modalCancelButton}>
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            leftSection={<IconCheck size={16} />}
            className={classes.primaryButton}
          >
            {submitLabel}
          </Button>
        </Group>
      </div>
    </Modal>
  );
}

export function AdminPanelActionModal({
  opened,
  title,
  description,
  icon,
  semantic = 'blue',
  confirmLabel,
  loading = false,
  onClose,
  onConfirm
}: {
  opened: boolean;
  title: string;
  description: string;
  icon: 'logout' | 'delete';
  semantic?: 'blue' | 'red';
  confirmLabel: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const isDanger = semantic === 'red';

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={null}
      centered
      withCloseButton={false}
      classNames={{
        header: classes.modalNativeHeader,
        content: classes.confirmModalContent,
        body: classes.confirmModalBody,
        overlay: classes.modalOverlay
      }}
    >
      <div className={classes.confirmModalSection}>
        <ThemeIcon
          size={52}
          radius="xl"
          variant="light"
          color={isDanger ? 'red' : 'blue'}
          className={isDanger ? classes.confirmThemeIconDanger : classes.confirmThemeIcon}
        >
          {icon === 'logout' ? <IconDoorExit size={24} /> : <IconTrash size={24} />}
        </ThemeIcon>

        <Title order={3} className={classes.confirmModalTitle}>
          {title}
        </Title>
        <Text className={classes.confirmModalDescription}>{description}</Text>
      </div>

      <div className={classes.confirmModalFooter}>
        <Group justify="center" gap={10}>
          <Button variant="default" size="sm" onClick={onClose} className={classes.modalCancelButton}>
            Cancelar
          </Button>
          <Button
            size="sm"
            color={isDanger ? 'red' : 'blue'}
            onClick={onConfirm}
            loading={loading}
            leftSection={icon === 'logout' ? <IconDoorExit size={16} /> : undefined}
            className={isDanger ? classes.confirmDangerButton : classes.confirmPrimaryButton}
          >
            {confirmLabel}
          </Button>
        </Group>
      </div>
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
        subtitle="Completá los datos para agregar una nueva cuenta"
        submitLabel="Crear usuario"
        roleOptions={roleOptions}
        onClose={closeCreateModal}
        onSubmit={createUser}
      />

      <UserFormModal
        key={`edit-${selectedUser?.id ?? 'empty'}-${editOpened ? 'open' : 'closed'}`}
        opened={editOpened}
        title="Editar usuario"
        subtitle="Actualizá los datos de la cuenta seleccionada"
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

      <AdminPanelActionModal
        opened={deleteOpened}
        title="Eliminar usuario"
        description={`Estás por eliminar a ${selectedUser?.fullName ?? 'este usuario'} del listado activo.`}
        icon="delete"
        semantic="red"
        confirmLabel="Eliminar usuario"
        onClose={closeDeleteModal}
        onConfirm={deleteUser}
      />
    </>
  );
}
