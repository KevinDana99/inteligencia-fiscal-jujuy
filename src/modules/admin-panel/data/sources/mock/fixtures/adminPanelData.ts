import type { IAdminPanelData } from '../../../models/AdminPanel';

export const ADMIN_PANEL_MOCK_DATA: IAdminPanelData = {
  users: [
    {
      id: '019dbb8f-e390-724b-aaee-e13b1c356530',
      fullName: 'Administrador',
      email: 'admin@plantilla.local',
      roleLabel: 'Administrador',
      isAdmin: true
    },
    {
      id: '019dbb8f-e390-724b-aaee-e13b1c356531',
      fullName: 'Carlos Gómez',
      email: 'cgomez@rentas.gob.ar',
      roleLabel: 'Fiscal'
    },
    {
      id: '019dbb8f-e390-724b-aaee-e13b1c356532',
      fullName: 'María Rodríguez',
      email: 'mrodriguez@rentas.gob.ar',
      roleLabel: 'Inspectora'
    },
    {
      id: '019dbb8f-e390-724b-aaee-e13b1c356533',
      fullName: 'Lucas Fernández',
      email: 'lfernandez@rentas.gob.ar',
      roleLabel: 'Analista'
    },
    {
      id: '019dbb8f-e390-724b-aaee-e13b1c356534',
      fullName: 'Sofía López',
      email: 'slopez@rentas.gob.ar',
      roleLabel: 'Coordinadora'
    }
  ]
};
