'use client'

import type {
  IAdminPanelUpdateUserInput,
  IAdminPanelUser
} from '../../../data/models/AdminPanel'
import { AdminPanelActionModal } from './AdminPanelActionModal'
import CreateUserFormModal from './CreateUserFormModal'
import UserFormModal from './UserFormModal'

export function AdminPanelModals({
  selectedUser,
  createOpened,
  editOpened,
  deleteOpened,
  actionError,
  isActionPending,
  roleOptions,
  closeCreateModal,
  closeEditModal,
  closeDeleteModal,
  updateUser,
  deleteUser
}: {
  selectedUser: IAdminPanelUser | null
  createOpened: boolean
  editOpened: boolean
  deleteOpened: boolean
  actionError: string | null
  isActionPending: boolean
  roleOptions: string[]
  closeCreateModal: () => void
  closeEditModal: () => void
  closeDeleteModal: () => void
  updateUser: (input: IAdminPanelUpdateUserInput) => Promise<boolean>
  deleteUser: () => Promise<boolean>
}) {
  return (
    <>
      <CreateUserFormModal
        key={`create-${createOpened ? 'open' : 'closed'}`}
        opened={createOpened}
        title='Nuevo usuario'
        subtitle='Completá los datos para agregar una nueva cuenta'
        submitLabel='Crear usuario'
        roleOptions={roleOptions}
        onClose={closeCreateModal}
      />

      <UserFormModal
        key={`edit-${selectedUser?.id ?? 'empty'}-${editOpened ? 'open' : 'closed'}`}
        opened={editOpened}
        title='Editar usuario'
        subtitle='Actualizá los datos de la cuenta seleccionada'
        submitLabel='Guardar cambios'
        initialUser={selectedUser}
        roleOptions={roleOptions}
        onClose={closeEditModal}
        onSubmit={async (payload) => {
          if ('id' in payload) {
            return updateUser(payload)
          }
          return false
        }}
        error={editOpened ? actionError : null}
        isPending={isActionPending}
      />

      <AdminPanelActionModal
        opened={deleteOpened}
        title='Eliminar usuario'
        description={`Estás por eliminar a ${selectedUser?.fullName ?? 'este usuario'} del listado activo.`}
        icon='delete'
        semantic='red'
        confirmLabel='Eliminar usuario'
        loading={isActionPending}
        error={deleteOpened ? actionError : null}
        onClose={closeDeleteModal}
        onConfirm={deleteUser}
      />
    </>
  )
}
