import type { IAdminPanelData } from '../../../models/AdminPanel';

export const ADMIN_PANEL_MOCK_DATA: IAdminPanelData = {
  historicalPasswordChanges: 9,
  users: [
    {
      id: 'admin',
      fullName: 'Administrador Principal',
      email: 'admin@plantilla.local',
      roleLabel: 'Administrador',
      avatarColor: 'indigo',
      isAdmin: true
    },
    {
      id: 'carlos-gomez',
      fullName: 'Carlos Gómez',
      email: 'cgomez@rentas.gob.ar',
      roleLabel: 'Fiscal',
      avatarColor: 'indigo'
    },
    {
      id: 'maria-rodriguez',
      fullName: 'María Rodríguez',
      email: 'mrodriguez@rentas.gob.ar',
      roleLabel: 'Inspectora',
      avatarColor: 'green'
    },
    {
      id: 'lucas-fernandez',
      fullName: 'Lucas Fernández',
      email: 'lfernandez@rentas.gob.ar',
      roleLabel: 'Analista',
      avatarColor: 'orange'
    },
    {
      id: 'sofia-lopez',
      fullName: 'Sofía López',
      email: 'slopez@rentas.gob.ar',
      roleLabel: 'Coordinadora',
      avatarColor: 'grape'
    }
  ]
};
