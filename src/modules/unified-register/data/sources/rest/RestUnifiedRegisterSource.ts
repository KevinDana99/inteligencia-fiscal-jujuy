<<<<<<< HEAD
import type { ApiClientConfig } from '@/lib/api-client';
=======
import {
  ApiClientError,
  fetchWithAuthRetry,
  type ApiClientConfig
} from '@/lib/api-client';
>>>>>>> develop
import type { IUnifiedRegisterSource } from '../../interfaces/UnifiedRegisterSource';
import type {
  IUnifiedRegisterAlternateAddressInput,
  IUnifiedRegisterAlternateAddressListData,
  IUnifiedRegisterAlternateAddressRecord,
  IUnifiedRegisterContactInput,
  IUnifiedRegisterContactRecord,
  IUnifiedRegisterContactsListData,
  IUnifiedRegisterContactsListParams,
  IUnifiedRegisterFinesListData,
  IUnifiedRegisterFinesListParams,
  IUnifiedRegisterHeaderRecord,
  IUnifiedRegisterInterventionOrdersListData,
  IUnifiedRegisterInterventionOrdersListParams,
  IUnifiedRegisterListData,
  IUnifiedRegisterNoteInput,
  IUnifiedRegisterNoteRecord,
  IUnifiedRegisterNotesListData,
  IUnifiedRegisterNotesListParams
} from '../../models/UnifiedRegister';
import { UNIFIED_REGISTER_API_ROUTES } from './constants/unifiedRegisterApiRoutes';
import type {
  ApiUnifiedRegisterAlternateAddressListResponseDto,
  ApiUnifiedRegisterAlternateAddressRequestDto,
  ApiUnifiedRegisterAlternateAddressResponseDto,
  ApiUnifiedRegisterContactRequestDto,
  ApiUnifiedRegisterContactResponseDto,
  ApiUnifiedRegisterContactsListResponseDto,
  ApiUnifiedRegisterFinesListResponseDto,
  ApiUnifiedRegisterHeaderResponseDto,
  ApiUnifiedRegisterInterventionOrdersListResponseDto,
  ApiUnifiedRegisterListResponseDto,
  ApiUnifiedRegisterNoteRequestDto,
  ApiUnifiedRegisterNoteResponseDto,
  ApiUnifiedRegisterNotesListResponseDto
} from './dtos/ApiUnifiedRegisterDtos';
import {
  mapAlternateAddressDto,
  mapContactDto,
  mapFineDto,
  mapHeaderDto,
  mapInterventionOrderDto,
  mapListItemDto,
  mapNoteDto
} from './mappers/unifiedRegisterMappers';
import {
  buildUnifiedRegisterPaginationParams,
  requestUnifiedRegisterJson,
  requestUnifiedRegisterVoid
} from './utils/unifiedRegisterRestClient';

type RestRequestOptions<TBody = unknown> = {
  body?: TBody;
  method?: 'GET' | 'POST' | 'PATCH';
};

export class RestUnifiedRegisterSource implements IUnifiedRegisterSource {
  constructor(private readonly config: ApiClientConfig) {}

  private buildPaginatedPath(path: string, page: number, itemsPerPage: number) {
    const params = buildUnifiedRegisterPaginationParams(page, itemsPerPage);
    return `${path}?${params.toString()}`;
  }

  private requestJson<TResponse, TBody = unknown>(
    path: string,
    options: RestRequestOptions<TBody> = {}
  ) {
    return requestUnifiedRegisterJson<TResponse, TBody>({
      ...this.config,
      path,
      ...options
    });
  }

<<<<<<< HEAD
  async listContributors(
    page = 1,
    itemsPerPage = 10
  ): Promise<IUnifiedRegisterListData> {
    const dto = await this.requestJson<ApiUnifiedRegisterListResponseDto>(
      this.buildPaginatedPath(
        UNIFIED_REGISTER_API_ROUTES.contributors,
        page,
        itemsPerPage
      )
    );
=======
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

    const response = await this.fetch(
      `/api/contribuyentes?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }

    const dto = (await response.json()) as ApiUnifiedRegisterListResponseDto;
>>>>>>> develop

    return {
      pagina: dto.pagina,
      itemsPagina: dto.itemsPagina,
      totalPaginas: dto.totalPaginas,
      contribuyentes: dto.contribuyentes.map(mapListItemDto)
    };
  }

<<<<<<< HEAD
  async getContributorHeader(
    contribuyenteId: string
  ): Promise<IUnifiedRegisterHeaderRecord> {
    const dto = await this.requestJson<ApiUnifiedRegisterHeaderResponseDto>(
      UNIFIED_REGISTER_API_ROUTES.contributorHeader(contribuyenteId)
=======
  async getContributorHeader(contribuyenteId: string): Promise<IUnifiedRegisterHeaderRecord> {
    const response = await this.fetch(
      `/api/contribuyentes/${contribuyenteId}/cabecera`,
      {
        method: 'GET',
        headers: this.buildHeaders()
      }
>>>>>>> develop
    );

    return mapHeaderDto(dto);
  }

  async listMercurioFines(
    contribuyenteId: string,
    params: IUnifiedRegisterFinesListParams = {}
  ): Promise<IUnifiedRegisterFinesListData> {
<<<<<<< HEAD
    const dto = await this.requestJson<ApiUnifiedRegisterFinesListResponseDto>(
      this.buildPaginatedPath(
        UNIFIED_REGISTER_API_ROUTES.mercurioFines(contribuyenteId),
        params.pagina ?? 1,
        params.itemsPagina ?? 3
      )
=======
    const searchParams = new URLSearchParams();
    searchParams.set('pagina', String(params.pagina ?? 1));
    searchParams.set('itemsPagina', String(params.itemsPagina ?? 3));

    const response = await this.fetch(
      `/api/contribuyentes/${contribuyenteId}/multas-mercurio?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: this.buildHeaders()
      }
>>>>>>> develop
    );

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
<<<<<<< HEAD
=======
    const searchParams = new URLSearchParams();
    searchParams.set('pagina', String(params.pagina ?? 1));
    searchParams.set('itemsPagina', String(params.itemsPagina ?? 3));

    const response = await this.fetch(
      `/api/contribuyentes/${contribuyenteId}/ordenes-intervencion?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }

>>>>>>> develop
    const dto =
      await this.requestJson<ApiUnifiedRegisterInterventionOrdersListResponseDto>(
        this.buildPaginatedPath(
          UNIFIED_REGISTER_API_ROUTES.interventionOrders(contribuyenteId),
          params.pagina ?? 1,
          params.itemsPagina ?? 3
        )
      );

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
<<<<<<< HEAD
    const dto =
      await this.requestJson<ApiUnifiedRegisterAlternateAddressListResponseDto>(
        UNIFIED_REGISTER_API_ROUTES.alternateAddresses(contribuyenteId)
      );
=======
    const response = await this.fetch(
      `/api/contribuyentes/${contribuyenteId}/domicilios-alternativos`,
      {
        method: 'GET',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }

    const dto = (await response.json()) as ApiUnifiedRegisterAlternateAddressListResponseDto;
>>>>>>> develop

    return {
      domiciliosAlternativos: dto.domiciliosAlternativos.map(
        mapAlternateAddressDto
      )
    };
  }

  async createAlternateAddress(
    contribuyenteId: string,
    payload: IUnifiedRegisterAlternateAddressInput
  ): Promise<IUnifiedRegisterAlternateAddressRecord> {
    const body: ApiUnifiedRegisterAlternateAddressRequestDto = {
      direccion: payload.direccion ?? null
    };

<<<<<<< HEAD
    const dto = await this.requestJson<
      ApiUnifiedRegisterAlternateAddressResponseDto,
      ApiUnifiedRegisterAlternateAddressRequestDto
    >(UNIFIED_REGISTER_API_ROUTES.alternateAddresses(contribuyenteId), {
      method: 'POST',
      body
    });
=======
    const response = await this.fetch(
      `/api/contribuyentes/${contribuyenteId}/domicilios-alternativos`,
      {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify(body)
      }
    );
>>>>>>> develop

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

<<<<<<< HEAD
    const dto = await this.requestJson<
      ApiUnifiedRegisterAlternateAddressResponseDto,
      ApiUnifiedRegisterAlternateAddressRequestDto
    >(
      UNIFIED_REGISTER_API_ROUTES.alternateAddress(
        contribuyenteId,
        domicilioAlternativoId
      ),
=======
    const response = await this.fetch(
      `/api/contribuyentes/${contribuyenteId}/domicilios-alternativos/${domicilioAlternativoId}`,
>>>>>>> develop
      {
        method: 'PATCH',
        body
      }
    );

    return mapAlternateAddressDto(dto);
  }

  async deleteAlternateAddress(
    contribuyenteId: string,
    domicilioAlternativoId: string
  ): Promise<void> {
<<<<<<< HEAD
    await requestUnifiedRegisterVoid({
      ...this.config,
      method: 'DELETE',
      path: UNIFIED_REGISTER_API_ROUTES.alternateAddress(
        contribuyenteId,
        domicilioAlternativoId
      )
    });
=======
    const response = await this.fetch(
      `/api/contribuyentes/${contribuyenteId}/domicilios-alternativos/${domicilioAlternativoId}`,
      {
        method: 'DELETE',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }
>>>>>>> develop
  }

  async listNotes(
    contribuyenteId: string,
    params: IUnifiedRegisterNotesListParams = {}
  ): Promise<IUnifiedRegisterNotesListData> {
<<<<<<< HEAD
    const dto = await this.requestJson<ApiUnifiedRegisterNotesListResponseDto>(
      this.buildPaginatedPath(
        UNIFIED_REGISTER_API_ROUTES.notes(contribuyenteId),
        params.pagina ?? 1,
        params.itemsPagina ?? 5
      )
=======
    const searchParams = new URLSearchParams();
    searchParams.set('pagina', String(params.pagina ?? 1));
    searchParams.set('itemsPagina', String(params.itemsPagina ?? 5));

    const response = await this.fetch(
      `/api/contribuyentes/${contribuyenteId}/notas?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: this.buildHeaders()
      }
>>>>>>> develop
    );

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

<<<<<<< HEAD
    const dto = await this.requestJson<
      ApiUnifiedRegisterNoteResponseDto,
      ApiUnifiedRegisterNoteRequestDto
    >(UNIFIED_REGISTER_API_ROUTES.notes(contribuyenteId), {
      method: 'POST',
      body
    });
=======
    const response = await this.fetch(
      `/api/contribuyentes/${contribuyenteId}/notas`,
      {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify(body)
      }
    );
>>>>>>> develop

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

<<<<<<< HEAD
    const dto = await this.requestJson<
      ApiUnifiedRegisterNoteResponseDto,
      ApiUnifiedRegisterNoteRequestDto
    >(UNIFIED_REGISTER_API_ROUTES.note(contribuyenteId, notaId), {
      method: 'PATCH',
      body
    });
=======
    const response = await this.fetch(
      `/api/contribuyentes/${contribuyenteId}/notas/${notaId}`,
      {
        method: 'PATCH',
        headers: this.buildHeaders(),
        body: JSON.stringify(body)
      }
    );
>>>>>>> develop

    return mapNoteDto(dto);
  }

  async deleteNote(contribuyenteId: string, notaId: string): Promise<void> {
<<<<<<< HEAD
    await requestUnifiedRegisterVoid({
      ...this.config,
      method: 'DELETE',
      path: UNIFIED_REGISTER_API_ROUTES.note(contribuyenteId, notaId)
    });
=======
    const response = await this.fetch(
      `/api/contribuyentes/${contribuyenteId}/notas/${notaId}`,
      {
        method: 'DELETE',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }
>>>>>>> develop
  }

  async listContacts(
    contribuyenteId: string,
    params: IUnifiedRegisterContactsListParams = {}
  ): Promise<IUnifiedRegisterContactsListData> {
<<<<<<< HEAD
    const dto = await this.requestJson<ApiUnifiedRegisterContactsListResponseDto>(
      this.buildPaginatedPath(
        UNIFIED_REGISTER_API_ROUTES.contacts(contribuyenteId),
        params.pagina ?? 1,
        params.itemsPagina ?? 1
      )
=======
    const searchParams = new URLSearchParams();
    searchParams.set('pagina', String(params.pagina ?? 1));
    searchParams.set('itemsPagina', String(params.itemsPagina ?? 1));

    const response = await this.fetch(
      `/api/contribuyentes/${contribuyenteId}/contactos?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: this.buildHeaders()
      }
>>>>>>> develop
    );

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

<<<<<<< HEAD
    const dto = await this.requestJson<
      ApiUnifiedRegisterContactResponseDto,
      ApiUnifiedRegisterContactRequestDto
    >(UNIFIED_REGISTER_API_ROUTES.contacts(contribuyenteId), {
      method: 'POST',
      body
    });
=======
    const response = await this.fetch(
      `/api/contribuyentes/${contribuyenteId}/contactos`,
      {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify(body)
      }
    );
>>>>>>> develop

    return mapContactDto(dto);
  }

  async updateContact(
    contribuyenteId: string,
    contactoId: string,
    payload: IUnifiedRegisterContactInput
  ): Promise<IUnifiedRegisterContactRecord> {
    const body: ApiUnifiedRegisterContactRequestDto = payload;

<<<<<<< HEAD
    const dto = await this.requestJson<
      ApiUnifiedRegisterContactResponseDto,
      ApiUnifiedRegisterContactRequestDto
    >(UNIFIED_REGISTER_API_ROUTES.contact(contribuyenteId, contactoId), {
      method: 'PATCH',
      body
    });
=======
    const response = await this.fetch(
      `/api/contribuyentes/${contribuyenteId}/contactos/${contactoId}`,
      {
        method: 'PATCH',
        headers: this.buildHeaders(),
        body: JSON.stringify(body)
      }
    );
>>>>>>> develop

    return mapContactDto(dto);
  }

<<<<<<< HEAD
  async deleteContact(
    contribuyenteId: string,
    contactoId: string
  ): Promise<void> {
    await requestUnifiedRegisterVoid({
      ...this.config,
      method: 'DELETE',
      path: UNIFIED_REGISTER_API_ROUTES.contact(contribuyenteId, contactoId)
    });
=======
  async deleteContact(contribuyenteId: string, contactoId: string): Promise<void> {
    const response = await this.fetch(
      `/api/contribuyentes/${contribuyenteId}/contactos/${contactoId}`,
      {
        method: 'DELETE',
        headers: this.buildHeaders()
      }
    );

    if (!response.ok) {
      await this.throwResponseError(response);
    }
>>>>>>> develop
  }
}
