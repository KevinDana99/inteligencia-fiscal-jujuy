import { mapAdminPanelDto } from './mapAdminPanelDto';

describe('mapAdminPanelDto', () => {
  it('maps the contract response with usuarioId fields', () => {
    const result = mapAdminPanelDto({
      resumen: {
        cantidadUsuariosActivos: 2
      },
      usuarios: [
        {
          usuarioId: '019dbb8f-e390-724b-aaee-e13b1c356532',
          nombre: 'Carlos',
          apellido: 'Lopez',
          correo: 'carlos.lopez@inteligenciafiscal.local',
          cargo: 'Contador',
          activo: true,
          esSuperAdministrador: false
        }
      ]
    });

    expect(result).toEqual({
      activeUsersCount: 2,
      users: [
        {
          id: '019dbb8f-e390-724b-aaee-e13b1c356532',
          fullName: 'Carlos Lopez',
          email: 'carlos.lopez@inteligenciafiscal.local',
          roleLabel: 'Contador',
          isAdmin: false,
          isDeleted: false
        }
      ]
    });
  });

  it('maps the current backend list response with usuario/correo/cargo', () => {
    const result = mapAdminPanelDto({
      resumen: {
        cantidadUsuariosActivos: 1
      },
      usuarios: [
        {
          usuario: 'admin Administrador',
          correo: 'admin@kamakia.dev',
          cargo: 'SuperAdministrador'
        }
      ]
    });

    expect(result).toEqual({
      activeUsersCount: 1,
      users: [
        {
          id: 'admin@kamakia.dev',
          fullName: 'admin Administrador',
          email: 'admin@kamakia.dev',
          roleLabel: 'SuperAdministrador',
          isAdmin: true,
          isDeleted: false
        }
      ]
    });
  });
});
