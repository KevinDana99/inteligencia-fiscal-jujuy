import type { IIamCurrentContextResponse } from '../../../models/Auth';
import type { ApiIamCurrentContextResponseDto } from '../dtos/IamDtos';

export function mapIamCurrentContextDto(
  dto: ApiIamCurrentContextResponseDto
): IIamCurrentContextResponse {
  return {
    autenticado: dto.autenticado,
    esquema: dto.esquema,
    nombreUsuario: dto.nombreUsuario,
    correo: dto.correo,
    sujeto: dto.sujeto,
    tipoUsuario: dto.tipoUsuario ?? dto.tipo_usuario ?? null
  };
}
