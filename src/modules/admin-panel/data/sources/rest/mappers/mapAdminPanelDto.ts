import type {
  IAdminAllowedDomain,
  IAdminPanelData,
  IAdminPanelUser
} from '../../../models/AdminPanel';
import type {
  ApiAllowedDomainDto,
  ApiAdminListUserDto,
  ApiAdminUserDto,
  ApiListAdminUsersResponseDto
} from '../dtos/ApiAdminPanelDtos';

function normalizeRoleLabel(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_-]/g, '');
}

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

function mapAdminListUserDto(dto: ApiAdminListUserDto): IAdminPanelUser {
  if ('usuario' in dto) {
    return {
      id: dto.usuarioId ?? dto.correo,
      fullName: dto.usuario.trim(),
      email: dto.correo,
      roleLabel: dto.cargo,
      isAdmin:
        dto.esSuperAdministrador ??
        normalizeRoleLabel(dto.cargo) === 'superadministrador',
      isDeleted: typeof dto.activo === 'boolean' ? !dto.activo : false
    };
  }

  return mapAdminUserDto(dto);
}

export function mapAdminPanelDto(dto: ApiListAdminUsersResponseDto): IAdminPanelData {
  return {
    users: dto.usuarios.map(mapAdminListUserDto),
    activeUsersCount: dto.resumen.cantidadUsuariosActivos
  };
}

export function mapAllowedDomainDto(dto: ApiAllowedDomainDto): IAdminAllowedDomain {
  return {
    id: dto.id,
    domain: dto.dominio
  }
}
