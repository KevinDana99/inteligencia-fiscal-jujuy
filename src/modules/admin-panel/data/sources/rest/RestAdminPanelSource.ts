import { fetchWithAuthRetry, type ApiClientConfig } from '@/lib/api-client';
import type { IAdminPanelSource } from '../../interfaces/AdminPanelSource';
import type {
  IAdminAllowedDomains,
  IAdminPanelCommandResult,
  IAdminPanelCreateUserInput,
  IAdminPanelData,
  IAdminPanelUpdateUserInput,
  IAdminPanelUser
} from '../../models/AdminPanel';
import type {
  ApiAllowedDomainDto,
  ApiCreateAdminUserRequestDto,
  ApiCreateAdminUserResponseDto,
  ApiErrorResponseDto,
  ApiGetAdminUserResponseDto,
  ApiListAdminUsersResponseDto,
  ApiUpdateAdminUserRequestDto
} from './dtos/ApiAdminPanelDtos';
import {
  mapAdminPanelDto,
  mapAdminListUserDto,
  mapAdminUserDto,
  mapAllowedDomainDto
} from './mappers/mapAdminPanelDto';

async function parseErrorResponse(response: Response): Promise<ApiErrorResponseDto | null> {
  try {
    const body = await response.text();

    if (!body.trim()) {
      return null;
    }

    return JSON.parse(body) as ApiErrorResponseDto;
  } catch {
    return null;
  }
}

async function parseJsonResponse<T>(response: Response): Promise<T | null> {
  try {
    const body = await response.text();

    if (!body.trim()) {
      return null;
    }

    return JSON.parse(body) as T;
  } catch {
    return null;
  }
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function normalizeUsuarioId(userId: string) {
  return userId.trim();
}

function isValidUsuarioId(userId: string) {
  return UUID_PATTERN.test(userId);
}

function buildAdminUserPath(userId: string) {
  return `/api/super-administrador/usuarios/${encodeURIComponent(userId)}`;
}

function buildInvalidUsuarioIdResult(): IAdminPanelCommandResult {
  return {
    success: false,
    error: 'El usuarioId debe ser un UUID valido.',
    code: 'super_administrador.usuarios.usuario_id_invalido',
    status: 400
  };
}

function getErrorMessage(error: ApiErrorResponseDto | null, fallback: string) {
  if (error?.mensaje?.trim()) {
    return error.mensaje;
  }

  const validationMessage = Object.values(error?.errors ?? {}).find(
    (messages) => Array.isArray(messages) && messages.length > 0
  )?.[0];

  if (validationMessage?.trim()) {
    return validationMessage;
  }

  if (error?.title?.trim()) {
    return error.title;
  }

  return fallback;
}

export class RestAdminPanelSource implements IAdminPanelSource {
  constructor(private readonly config: ApiClientConfig) {}

  private buildUrl(path: string) {
    return `${this.config.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}${path}`;
  }

  private buildHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.config.token ? { Authorization: `Bearer ${this.config.token}` } : {})
    };
  }

  private fetch(path: string, init: RequestInit) {
    return fetchWithAuthRetry(
      this.buildUrl(path),
      {
        ...init,
        headers: init.headers ?? this.buildHeaders()
      },
      this.config
    );
  }

  async getAdminPanelData(): Promise<IAdminPanelData> {
    const response = await this.fetch('/api/super-administrador/usuarios', {
      method: 'GET',
      headers: this.buildHeaders()
    });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      throw new Error(getErrorMessage(error, 'Unable to list admin users'));
    }

    const dto = (await response.json()) as ApiListAdminUsersResponseDto;
    return mapAdminPanelDto(dto);
  }

  async getAdminUser(userId: string): Promise<IAdminPanelUser> {
    const normalizedUsuarioId = normalizeUsuarioId(userId);

    if (!isValidUsuarioId(normalizedUsuarioId)) {
      throw new Error('El usuarioId debe ser un UUID valido.');
    }

    const response = await this.fetch(
      buildAdminUserPath(normalizedUsuarioId),
      {
        method: 'GET',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      throw new Error(getErrorMessage(error, 'Unable to get admin user'));
    }

    const dto = (await response.json()) as ApiGetAdminUserResponseDto;
    return mapAdminUserDto(dto);
  }

  async getAllowedDomains(): Promise<IAdminAllowedDomains> {
    const response = await this.fetch(
      '/api/super-administrador/dominios-permitidos',
      {
        method: 'GET',
        headers: this.buildHeaders()
      }
    )

    if (!response.ok) {
      const error = await parseErrorResponse(response)
      throw new Error(getErrorMessage(error, 'Unable to list allowed domains'))
    }

    const dto = (await response.json()) as ApiAllowedDomainDto[]
    return dto.map(mapAllowedDomainDto)
  }

  async createAdminUser(
    params: IAdminPanelCreateUserInput
  ): Promise<IAdminPanelCommandResult<IAdminPanelUser>> {
    const payload: ApiCreateAdminUserRequestDto = {
      nombre: params.firstName.trim(),
      apellido: params.lastName.trim(),
      correo: params.email.trim().toLowerCase(),
      cargo: params.roleLabel,
      contrasena: params.password,
      confirmarContrasena: params.confirmPassword
    };

    const response = await this.fetch('/api/super-administrador/usuarios', {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      return {
        success: false,
        error: getErrorMessage(error, 'Unable to create admin user'),
        code: error?.codigo,
        status: response.status
      };
    }

    const dto = await parseJsonResponse<ApiCreateAdminUserResponseDto>(response);

    if (!dto) {
      return {
        success: true
      };
    }

    return {
      success: true,
      data: mapAdminListUserDto(dto)
    };
  }

  async updateAdminUser(
    params: IAdminPanelUpdateUserInput
  ): Promise<IAdminPanelCommandResult> {
    const normalizedUsuarioId = normalizeUsuarioId(params.id);

    if (!isValidUsuarioId(normalizedUsuarioId)) {
      return buildInvalidUsuarioIdResult();
    }

    const normalizedNewPassword = params.newPassword?.trim() ?? '';
    const normalizedConfirmPassword = params.confirmPassword?.trim() ?? '';
    const shouldUpdatePassword = normalizedNewPassword.length > 0;

    const payload: ApiUpdateAdminUserRequestDto = {
      nombre: params.firstName.trim(),
      apellido: params.lastName.trim(),
      correo: params.email.trim().toLowerCase(),
      cargo: params.roleLabel,
      nuevaContrasena: shouldUpdatePassword ? normalizedNewPassword : null,
      confirmarContrasena: shouldUpdatePassword
        ? normalizedConfirmPassword || normalizedNewPassword
        : null
    };

    const response = await this.fetch(
      buildAdminUserPath(normalizedUsuarioId),
      {
        method: 'PATCH',
        headers: this.buildHeaders(),
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      return {
        success: false,
        error: getErrorMessage(error, 'Unable to update admin user'),
        code: error?.codigo,
        status: response.status
      };
    }

    return { success: true };
  }

  async deleteAdminUser(userId: string): Promise<IAdminPanelCommandResult> {
    const normalizedUsuarioId = normalizeUsuarioId(userId);

    if (!isValidUsuarioId(normalizedUsuarioId)) {
      return buildInvalidUsuarioIdResult();
    }

    const response = await this.fetch(
      buildAdminUserPath(normalizedUsuarioId),
      {
        method: 'DELETE',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      return {
        success: false,
        error: getErrorMessage(error, 'Unable to delete admin user'),
        code: error?.codigo,
        status: response.status
      };
    }

    return { success: true };
  }

  async addAllowedDomain(domain: string): Promise<IAdminPanelCommandResult> {
    const response = await this.fetch(
      '/api/super-administrador/dominios-permitidos',
      {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify({
          dominio: domain
        })
      }
    )

    if (!response.ok) {
      const error = await parseErrorResponse(response)
      return {
        success: false,
        error: getErrorMessage(error, 'Unable to add allowed domain'),
        code: error?.codigo,
        status: response.status
      }
    }

    return { success: true }
  }

  async deleteAllowedDomain(domainId: number): Promise<IAdminPanelCommandResult> {
    const response = await this.fetch(
      `/api/super-administrador/dominios-permitidos/${domainId}`,
      {
        method: 'DELETE',
        headers: this.buildHeaders()
      }
    )

    if (!response.ok) {
      const error = await parseErrorResponse(response)
      return {
        success: false,
        error: getErrorMessage(error, 'Unable to delete allowed domain'),
        code: error?.codigo,
        status: response.status
      }
    }

    return { success: true }
  }
}
