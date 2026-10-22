import type { ApiUnifiedRegisterFineResponseDto } from '../dtos/ApiUnifiedRegisterDtos';
import { mapFineDto } from './unifiedRegisterMappers';

function buildFineDto(
  overrides: Partial<ApiUnifiedRegisterFineResponseDto> = {}
): ApiUnifiedRegisterFineResponseDto {
  return {
    numero: 'MER-001',
    fecha: '2026-10-21',
    tipo: 'DESTINATARIO',
    descripcion: 'Descripción',
    monto: '1000',
    estado: 'ACTIVO',
    ...overrides
  };
}

describe('mapFineDto', () => {
  it.each([
    ['DESTINATARIO', 'Destinatario'],
    [' remitente ', 'Remitente'],
    ['Transportista', 'Transportista']
  ] as const)('normalizes fine type %s', (tipo, expectedType) => {
    expect(mapFineDto(buildFineDto({ tipo })).tipo).toBe(expectedType);
  });

  it.each([undefined, null, '', 'DESCONOCIDO'])(
    'maps unsupported fine type %s to null',
    (tipo) => {
      expect(mapFineDto(buildFineDto({ tipo })).tipo).toBeNull();
    }
  );
});
