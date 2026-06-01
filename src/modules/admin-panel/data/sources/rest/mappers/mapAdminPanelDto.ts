import type {
  IAdminAllowedDomain,
  IAdminPanelData,
  IAdminPanelUser
} from '../../../models/AdminPanel';
import type {
  ApiAllowedDomainDto,
  ApiAdminUserDto,
  ApiListAdminUsersResponseDto
} from '../dtos/ApiAdminPanelDtos';

export function mapAdminUserDto(dto: ApiAdminUserDto): IAdminPanelUser {
  return {
    id: dto.usuarioId,
    fullName: `${dto.nombre} ${dto.apellido}`.trim(),
    email: dto.correo,
    roleLabel: dto.cargo,
    isAdmin: dto.esSuperAdministrador,
    isDeleted: !dto.activo
  };
}

export function mapAdminPanelDto(dto: ApiListAdminUsersResponseDto): IAdminPanelData {
  return {
    users: dto.usuarios.map(mapAdminUserDto)
  };
}

export function mapAllowedDomainDto(dto: ApiAllowedDomainDto): IAdminAllowedDomain {
  return {
    id: dto.id,
    domain: dto.dominio
  }
}
