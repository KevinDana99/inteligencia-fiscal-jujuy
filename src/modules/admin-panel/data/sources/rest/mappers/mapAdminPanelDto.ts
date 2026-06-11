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

function getRequiredUsuarioId(usuarioId: string | undefined) {
  const normalizedUsuarioId = usuarioId?.trim();

  if (!normalizedUsuarioId) {
    throw new Error('La respuesta de usuarios no incluyo usuarioId.');
  }

  return normalizedUsuarioId;
}

function getOptionalUsuarioId(usuarioId: string | undefined) {
  return usuarioId?.trim() || null;
}

export function mapAdminUserDto(dto: ApiAdminUserDto): IAdminPanelUser {
  return {
    id: getRequiredUsuarioId(dto.usuarioId ?? dto.id),
    fullName: `${dto.nombre} ${dto.apellido}`.trim(),
    email: dto.correo,
    roleLabel: dto.cargo,
    isAdmin: dto.esSuperAdministrador,
    isDeleted: !dto.activo,
    hasUsuarioId: true
  };
}

function mapAdminListUserDto(dto: ApiAdminListUserDto): IAdminPanelUser {
  if ('usuario' in dto) {
    const usuarioId = getOptionalUsuarioId(dto.usuarioId ?? dto.id);

    return {
      id: usuarioId ?? dto.correo,
      fullName: dto.usuario.trim(),
      email: dto.correo,
      roleLabel: dto.cargo,
      isAdmin:
        dto.esSuperAdministrador ??
        normalizeRoleLabel(dto.cargo) === 'superadministrador',
      isDeleted: typeof dto.activo === 'boolean' ? !dto.activo : false,
      hasUsuarioId: Boolean(usuarioId)
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
