import type { IAdminPanelData } from '../../../models/AdminPanel';

export const ADMIN_PANEL_MOCK_DATA: IAdminPanelData = {
  users: [
    {
      id: 'admin',
      fullName: 'Administrador',
      email: 'admin@plantilla.local',
      roleLabel: 'Administrador',
      isAdmin: true
    },
    {
      id: 'carlos-gomez',
      fullName: 'Carlos Gómez',
      email: 'cgomez@rentas.gob.ar',
      roleLabel: 'Fiscal'
    },
    {
      id: 'maria-rodriguez',
      fullName: 'María Rodríguez',
      email: 'mrodriguez@rentas.gob.ar',
      roleLabel: 'Inspectora'
    },
    {
      id: 'lucas-fernandez',
      fullName: 'Lucas Fernández',
      email: 'lfernandez@rentas.gob.ar',
      roleLabel: 'Analista'
    },
    {
      id: 'sofia-lopez',
      fullName: 'Sofía López',
      email: 'slopez@rentas.gob.ar',
      roleLabel: 'Coordinadora'
    }
  ]
};
