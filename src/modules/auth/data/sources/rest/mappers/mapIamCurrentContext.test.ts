import { USER_ROLES } from '@/constants';
import { mapIamCurrentContextDto } from './mapIamCurrentContext';

describe('mapIamCurrentContextDto', () => {
  it('maps snake_case tipo_usuario to the internal tipoUsuario field', () => {
    const result = mapIamCurrentContextDto({
      autenticado: true,
      esquema: 'AuthenticationTypes.Federation',
      nombreUsuario: 'admin',
      correo: 'admin@kamakia.dev',
      sujeto: '7eb3e683-ae0f-4b0d-ac1a-96bd07387594',
      tipo_usuario: USER_ROLES.ADMIN
    });

    expect(result.tipoUsuario).toBe(USER_ROLES.ADMIN);
  });

  it('keeps camelCase tipoUsuario when the backend already sends that shape', () => {
    const result = mapIamCurrentContextDto({
      autenticado: true,
      esquema: 'AuthenticationTypes.Federation',
      nombreUsuario: 'admin',
      correo: 'admin@kamakia.dev',
      sujeto: '7eb3e683-ae0f-4b0d-ac1a-96bd07387594',
      tipoUsuario: USER_ROLES.FISCAL_ANALYST
    });

    expect(result.tipoUsuario).toBe(USER_ROLES.FISCAL_ANALYST);
  });
});
