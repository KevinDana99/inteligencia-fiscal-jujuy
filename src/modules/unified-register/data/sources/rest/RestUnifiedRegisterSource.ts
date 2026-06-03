import { ApiClientError, type ApiClientConfig } from '@/lib/api-client';
import type { IUnifiedRegisterSource } from '../../interfaces/UnifiedRegisterSource';
import type {
  IUnifiedRegisterAlternateAddressInput,
  IUnifiedRegisterAlternateAddressListData,
  IUnifiedRegisterAlternateAddressRecord,
  IUnifiedRegisterContactInput,
  IUnifiedRegisterContactRecord,
  IUnifiedRegisterContactsListData,
  IUnifiedRegisterContactsListParams,
  IUnifiedRegisterFineRecord,
  IUnifiedRegisterFinesListData,
  IUnifiedRegisterFinesListParams,
  IUnifiedRegisterHeaderRecord,
  IUnifiedRegisterInterventionOrderRecord,
  IUnifiedRegisterInterventionOrdersListData,
  IUnifiedRegisterInterventionOrdersListParams,
  IUnifiedRegisterListData,
  IUnifiedRegisterItem,
  IUnifiedRegisterNoteInput,
  IUnifiedRegisterNoteRecord,
  IUnifiedRegisterNotesListData,
  IUnifiedRegisterNotesListParams
} from '../../models/UnifiedRegister';
import type {
  ApiUnifiedRegisterFineResponseDto,
  ApiUnifiedRegisterFinesListResponseDto,
  ApiUnifiedRegisterHeaderResponseDto,
  ApiUnifiedRegisterInterventionOrderResponseDto,
  ApiUnifiedRegisterInterventionOrdersListResponseDto,
  ApiUnifiedRegisterListItemDto,
  ApiUnifiedRegisterListResponseDto,
  ApiUnifiedRegisterAlternateAddressListResponseDto,
  ApiUnifiedRegisterAlternateAddressRequestDto,
  ApiUnifiedRegisterAlternateAddressResponseDto,
  ApiUnifiedRegisterContactRequestDto,
  ApiUnifiedRegisterContactResponseDto,
  ApiUnifiedRegisterContactsListResponseDto,
  ApiUnifiedRegisterErrorResponseDto,
  ApiUnifiedRegisterNoteRequestDto,
  ApiUnifiedRegisterNoteResponseDto,
  ApiUnifiedRegisterNotesListResponseDto
} from './dtos/ApiUnifiedRegisterDtos';

async function parseErrorResponse(
  response: Response
): Promise<ApiUnifiedRegisterErrorResponseDto | null> {
  try {
    return (await response.json()) as ApiUnifiedRegisterErrorResponseDto;
  } catch {
    return null;
  }
}

function mapAlternateAddressDto(
  dto: ApiUnifiedRegisterAlternateAddressResponseDto
): IUnifiedRegisterAlternateAddressRecord {
  return {
    id: dto.id,
    direccion: dto.direccion,
    contribuyenteId: dto.contribuyenteId,
    activo: dto.activo
  };
}

function mapNoteDto(dto: ApiUnifiedRegisterNoteResponseDto): IUnifiedRegisterNoteRecord {
  return {
    id: dto.id,
    descripcion: dto.descripcion,
    creadoPorUsuarioId: dto.creadoPorUsuarioId,
    fechaCreacion: dto.fechaCreacion,
    contribuyenteId: dto.contribuyenteId,
    activo: dto.activo
  };
}

function mapContactDto(
  dto: ApiUnifiedRegisterContactResponseDto
): IUnifiedRegisterContactRecord {
  return {
    id: dto.id,
    telefono: dto.telefono,
    correo: dto.correo,
    nombreRepresentanteLegal: dto.nombreRepresentanteLegal,
    nombreContador: dto.nombreContador,
    contribuyenteId: dto.contribuyenteId,
    activo: dto.activo
  };
}

function mapContributorType(value: string): IUnifiedRegisterItem['regime'] {
  if (value === 'Convenio Multilateral') {
    return 'Convenio Multilateral';
  }

  if (value === 'Régimen General') {
    return 'Régimen General';
  }

  if (value === 'No inscripto') {
    return 'No inscripto';
  }

  return 'Regimen Local';
}

function mapListItemDto(dto: ApiUnifiedRegisterListItemDto): IUnifiedRegisterItem {
  return {
    contribuyenteId: dto.id,
    cuit: dto.cuit,
    businessName: dto.razonSocial,
    activity: dto.actividad,
    regime: mapContributorType(dto.tipoContribuyente),
    status: dto.activo ? 'Activo' : 'Inactivo',
    riskLevel: dto.riesgo
  };
}

function mapHeaderDto(dto: ApiUnifiedRegisterHeaderResponseDto): IUnifiedRegisterHeaderRecord {
  return {
    cuit: dto.cuit,
    razonSocial: dto.razonSocial,
    activo: dto.activo,
    tipoContribuyente: mapContributorType(dto.tipoContribuyente),
    cantidadLotes: dto.cantidadLotes,
    actividadPrimaria: dto.actividadPrimaria,
    actividadSecundaria: dto.actividadSecundaria,
    inicioActividad: dto.inicioActividad,
    domicilios: dto.domicilios,
    biDeclarada: dto.biDeclarada,
    impuestosDeclarados: dto.impuestosDeclarados,
    deuda: dto.deuda,
    declaraionesJuradas: dto.declaraionesJuradas,
    riesgo: dto.riesgo
  };
}

function mapFineDto(dto: ApiUnifiedRegisterFineResponseDto): IUnifiedRegisterFineRecord {
  return dto;
}

function mapInterventionOrderDto(
  dto: ApiUnifiedRegisterInterventionOrderResponseDto
): IUnifiedRegisterInterventionOrderRecord {
  return dto;
}

export class RestUnifiedRegisterSource implements IUnifiedRegisterSource {
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

  private async throwResponseError(response: Response): Promise<never> {
    const error = await parseErrorResponse(response);

    throw new ApiClientError(
      response.status,
      error?.mensaje ?? 'Unified register request failed',
      error
    );
  }

  async listContributors(page = 1, itemsPerPage = 10): Promise<IUnifiedRegisterListData> {
    const searchParams = new URLSearchParams();
    searchParams.set('pagina', String(page));
    searchParams.set('itemsPagina', String(itemsPerPage));

    const response = await fetch(
      this.buildUrl(`/api/contribuyentes?${searchParams.toString()}`),
      {
        method: 'GET',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }

    const dto = (await response.json()) as ApiUnifiedRegisterListResponseDto;

    return {
      pagina: dto.pagina,
      itemsPagina: dto.itemsPagina,
      totalPaginas: dto.totalPaginas,
      contribuyentes: dto.contribuyentes.map(mapListItemDto)
    };
  }

  async getContributorHeader(contribuyenteId: string): Promise<IUnifiedRegisterHeaderRecord> {
    const response = await fetch(
      this.buildUrl(`/api/contribuyentes/${contribuyenteId}/cabecera`),
      {
        method: 'GET',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }

    const dto = (await response.json()) as ApiUnifiedRegisterHeaderResponseDto;
    return mapHeaderDto(dto);
  }

  async listMercurioFines(
    contribuyenteId: string,
    params: IUnifiedRegisterFinesListParams = {}
  ): Promise<IUnifiedRegisterFinesListData> {
    const searchParams = new URLSearchParams();
    searchParams.set('pagina', String(params.pagina ?? 1));
    searchParams.set('itemsPagina', String(params.itemsPagina ?? 3));

    const response = await fetch(
      this.buildUrl(
        `/api/contribuyentes/${contribuyenteId}/multas-mercurio?${searchParams.toString()}`
      ),
      {
        method: 'GET',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }

    const dto = (await response.json()) as ApiUnifiedRegisterFinesListResponseDto;
    return {
      pagina: dto.pagina,
      itemsPagina: dto.itemsPagina,
      totalItems: dto.totalItems,
      totalPaginas: dto.totalPaginas,
      multas: dto.multas.map(mapFineDto)
    };
  }

  async listInterventionOrders(
    contribuyenteId: string,
    params: IUnifiedRegisterInterventionOrdersListParams = {}
  ): Promise<IUnifiedRegisterInterventionOrdersListData> {
    const searchParams = new URLSearchParams();
    searchParams.set('pagina', String(params.pagina ?? 1));
    searchParams.set('itemsPagina', String(params.itemsPagina ?? 3));

    const response = await fetch(
      this.buildUrl(
        `/api/contribuyentes/${contribuyenteId}/ordenes-intervencion?${searchParams.toString()}`
      ),
      {
        method: 'GET',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }

    const dto =
      (await response.json()) as ApiUnifiedRegisterInterventionOrdersListResponseDto;
    return {
      pagina: dto.pagina,
      itemsPagina: dto.itemsPagina,
      totalItems: dto.totalItems,
      totalPaginas: dto.totalPaginas,
      ordenes: dto.ordenes.map(mapInterventionOrderDto)
    };
  }

  async listAlternateAddresses(
    contribuyenteId: string
  ): Promise<IUnifiedRegisterAlternateAddressListData> {
    const response = await fetch(
      this.buildUrl(`/api/contribuyentes/${contribuyenteId}/domicilios-alternativos`),
      {
        method: 'GET',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }

    const dto = (await response.json()) as ApiUnifiedRegisterAlternateAddressListResponseDto;

    return {
      domiciliosAlternativos: dto.domiciliosAlternativos.map(mapAlternateAddressDto)
    };
  }

  async createAlternateAddress(
    contribuyenteId: string,
    payload: IUnifiedRegisterAlternateAddressInput
  ): Promise<IUnifiedRegisterAlternateAddressRecord> {
    const body: ApiUnifiedRegisterAlternateAddressRequestDto = {
      direccion: payload.direccion ?? null
    };

    const response = await fetch(
      this.buildUrl(`/api/contribuyentes/${contribuyenteId}/domicilios-alternativos`),
      {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }

    const dto = (await response.json()) as ApiUnifiedRegisterAlternateAddressResponseDto;
    return mapAlternateAddressDto(dto);
  }

  async updateAlternateAddress(
    contribuyenteId: string,
    domicilioAlternativoId: string,
    payload: IUnifiedRegisterAlternateAddressInput
  ): Promise<IUnifiedRegisterAlternateAddressRecord> {
    const body: ApiUnifiedRegisterAlternateAddressRequestDto = {
      direccion: payload.direccion ?? null
    };

    const response = await fetch(
      this.buildUrl(
        `/api/contribuyentes/${contribuyenteId}/domicilios-alternativos/${domicilioAlternativoId}`
      ),
      {
        method: 'PATCH',
        headers: this.buildHeaders(),
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }

    const dto = (await response.json()) as ApiUnifiedRegisterAlternateAddressResponseDto;
    return mapAlternateAddressDto(dto);
  }

  async deleteAlternateAddress(
    contribuyenteId: string,
    domicilioAlternativoId: string
  ): Promise<void> {
    const response = await fetch(
      this.buildUrl(
        `/api/contribuyentes/${contribuyenteId}/domicilios-alternativos/${domicilioAlternativoId}`
      ),
      {
        method: 'DELETE',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }
  }

  async listNotes(
    contribuyenteId: string,
    params: IUnifiedRegisterNotesListParams = {}
  ): Promise<IUnifiedRegisterNotesListData> {
    const searchParams = new URLSearchParams();
    searchParams.set('pagina', String(params.pagina ?? 1));
    searchParams.set('itemsPagina', String(params.itemsPagina ?? 5));

    const response = await fetch(
      this.buildUrl(
        `/api/contribuyentes/${contribuyenteId}/notas?${searchParams.toString()}`
      ),
      {
        method: 'GET',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }

    const dto = (await response.json()) as ApiUnifiedRegisterNotesListResponseDto;

    return {
      pagina: dto.pagina,
      itemsPagina: dto.itemsPagina,
      totalPaginas: dto.totalPaginas,
      notas: dto.notas.map(mapNoteDto)
    };
  }

  async createNote(
    contribuyenteId: string,
    payload: IUnifiedRegisterNoteInput
  ): Promise<IUnifiedRegisterNoteRecord> {
    const body: ApiUnifiedRegisterNoteRequestDto = {
      descripcion: payload.descripcion
    };

    const response = await fetch(
      this.buildUrl(`/api/contribuyentes/${contribuyenteId}/notas`),
      {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }

    const dto = (await response.json()) as ApiUnifiedRegisterNoteResponseDto;
    return mapNoteDto(dto);
  }

  async updateNote(
    contribuyenteId: string,
    notaId: string,
    payload: IUnifiedRegisterNoteInput
  ): Promise<IUnifiedRegisterNoteRecord> {
    const body: ApiUnifiedRegisterNoteRequestDto = {
      descripcion: payload.descripcion
    };

    const response = await fetch(
      this.buildUrl(`/api/contribuyentes/${contribuyenteId}/notas/${notaId}`),
      {
        method: 'PATCH',
        headers: this.buildHeaders(),
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }

    const dto = (await response.json()) as ApiUnifiedRegisterNoteResponseDto;
    return mapNoteDto(dto);
  }

  async deleteNote(contribuyenteId: string, notaId: string): Promise<void> {
    const response = await fetch(
      this.buildUrl(`/api/contribuyentes/${contribuyenteId}/notas/${notaId}`),
      {
        method: 'DELETE',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }
  }

  async listContacts(
    contribuyenteId: string,
    params: IUnifiedRegisterContactsListParams = {}
  ): Promise<IUnifiedRegisterContactsListData> {
    const searchParams = new URLSearchParams();
    searchParams.set('pagina', String(params.pagina ?? 1));
    searchParams.set('itemsPagina', String(params.itemsPagina ?? 1));

    const response = await fetch(
      this.buildUrl(
        `/api/contribuyentes/${contribuyenteId}/contactos?${searchParams.toString()}`
      ),
      {
        method: 'GET',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }

    const dto = (await response.json()) as ApiUnifiedRegisterContactsListResponseDto;

    return {
      pagina: dto.pagina,
      itemsPagina: dto.itemsPagina,
      totalPaginas: dto.totalPaginas,
      contactos: dto.contactos.map(mapContactDto)
    };
  }

  async createContact(
    contribuyenteId: string,
    payload: IUnifiedRegisterContactInput
  ): Promise<IUnifiedRegisterContactRecord> {
    const body: ApiUnifiedRegisterContactRequestDto = payload;

    const response = await fetch(
      this.buildUrl(`/api/contribuyentes/${contribuyenteId}/contactos`),
      {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }

    const dto = (await response.json()) as ApiUnifiedRegisterContactResponseDto;
    return mapContactDto(dto);
  }

  async updateContact(
    contribuyenteId: string,
    contactoId: string,
    payload: IUnifiedRegisterContactInput
  ): Promise<IUnifiedRegisterContactRecord> {
    const body: ApiUnifiedRegisterContactRequestDto = payload;

    const response = await fetch(
      this.buildUrl(`/api/contribuyentes/${contribuyenteId}/contactos/${contactoId}`),
      {
        method: 'PATCH',
        headers: this.buildHeaders(),
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }

    const dto = (await response.json()) as ApiUnifiedRegisterContactResponseDto;
    return mapContactDto(dto);
  }

  async deleteContact(contribuyenteId: string, contactoId: string): Promise<void> {
    const response = await fetch(
      this.buildUrl(`/api/contribuyentes/${contribuyenteId}/contactos/${contactoId}`),
      {
        method: 'DELETE',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }
  }
}
