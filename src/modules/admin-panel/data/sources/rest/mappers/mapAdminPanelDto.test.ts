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
          isDeleted: false,
          hasUsuarioId: true
        }
      ]
    });
  });

  it('maps full user responses with id fields', () => {
    const result = mapAdminPanelDto({
      resumen: {
        cantidadUsuariosActivos: 1
      },
      usuarios: [
        {
          id: '019dbb8f-e390-724b-aaee-e13b1c356535',
          nombre: 'Test',
          apellido: 'User',
          correo: 'test@example.com',
          cargo: 'Analista',
          activo: true,
          esSuperAdministrador: false
        }
      ]
    });

    expect(result.users[0]).toEqual({
      id: '019dbb8f-e390-724b-aaee-e13b1c356535',
      fullName: 'Test User',
      email: 'test@example.com',
      roleLabel: 'Analista',
      isAdmin: false,
      isDeleted: false,
      hasUsuarioId: true
    });
  });

  it('maps the compact backend list response with id', () => {
    const result = mapAdminPanelDto({
      resumen: {
        cantidadUsuariosActivos: 1
      },
      usuarios: [
        {
          id: '019dbb8f-e390-724b-aaee-e13b1c356533',
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
          id: '019dbb8f-e390-724b-aaee-e13b1c356533',
          fullName: 'admin Administrador',
          email: 'admin@kamakia.dev',
          roleLabel: 'SuperAdministrador',
          isAdmin: true,
          isDeleted: false,
          hasUsuarioId: true
        }
      ]
    });
  });

  it('maps compact list responses without id as non actionable rows', () => {
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

    expect(result.users[0]).toEqual({
      id: 'admin@kamakia.dev',
      fullName: 'admin Administrador',
      email: 'admin@kamakia.dev',
      roleLabel: 'SuperAdministrador',
      isAdmin: true,
      isDeleted: false,
      hasUsuarioId: false
    });
  });
});
