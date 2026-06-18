import type { ApiClientConfig } from '@/lib/api-client';
import type { IUnifiedRegisterSource } from '../../interfaces/UnifiedRegisterSource';
import type {
  IUnifiedRegisterAlternateAddressInput,
  IUnifiedRegisterAlternateAddressListData,
  IUnifiedRegisterAlternateAddressRecord,
  IUnifiedRegisterContactInput,
  IUnifiedRegisterContactRecord,
  IUnifiedRegisterContactsListData,
  IUnifiedRegisterContactsListParams,
  IUnifiedRegisterContributorCrossColumnsData,
  IUnifiedRegisterContributorCrossesData,
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
import {
  UNIFIED_REGISTER_DETAIL_PAGINATION,
  UNIFIED_REGISTER_DETAIL_PAGINATION_QUERY_PARAMS,
  UNIFIED_REGISTER_PAGINATION_QUERY_PARAMS
} from './constants/unifiedRegisterPagination';
import type {
  ApiUnifiedRegisterAlternateAddressListResponseDto,
  ApiUnifiedRegisterAlternateAddressRequestDto,
  ApiUnifiedRegisterAlternateAddressResponseDto,
  ApiUnifiedRegisterContactRequestDto,
  ApiUnifiedRegisterContactResponseDto,
  ApiUnifiedRegisterContactsListResponseDto,
  ApiUnifiedRegisterContributorCrossColumnsResponseDto,
  ApiUnifiedRegisterContributorCrossesResponseDto,
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
  mapContributorCrossColumnsDto,
  mapContributorCrossDto,
  mapFineDto,
  mapHeaderDto,
  mapInterventionOrderDto,
  mapListItemDto,
  mapNoteDto
} from './mappers/unifiedRegisterMappers';
import {
  buildUnifiedRegisterPaginationParams,
  type UnifiedRegisterPaginationQueryParamNames,
  requestUnifiedRegisterJson,
  requestUnifiedRegisterVoid
} from './utils/unifiedRegisterRestClient';

type RestRequestOptions<TBody = unknown> = {
  body?: TBody;
  method?: 'GET' | 'POST' | 'PATCH';
};

export class RestUnifiedRegisterSource implements IUnifiedRegisterSource {
  constructor(private readonly config: ApiClientConfig) {}

  private buildPaginatedPath(
    path: string,
    page: number,
    itemsPerPage: number,
    search?: string,
    parameterNames: UnifiedRegisterPaginationQueryParamNames =
      UNIFIED_REGISTER_PAGINATION_QUERY_PARAMS
  ) {
    const params = buildUnifiedRegisterPaginationParams(
      page,
      itemsPerPage,
      parameterNames
    );
    const normalizedSearch = search?.trim();

    if (normalizedSearch) {
      params.set(UNIFIED_REGISTER_PAGINATION_QUERY_PARAMS.search, normalizedSearch);
    }

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

  async listContributors(
    page = 1,
    itemsPerPage = 10,
    search?: string
  ): Promise<IUnifiedRegisterListData> {
    const dto = await this.requestJson<ApiUnifiedRegisterListResponseDto>(
      this.buildPaginatedPath(
        UNIFIED_REGISTER_API_ROUTES.contributors,
        page,
        itemsPerPage,
        search
      )
    );

    return {
      pagina: dto.pagina,
      itemsPagina: dto.itemsPagina,
      totalPaginas: dto.totalPaginas,
      contribuyentes: dto.contribuyentes.map(mapListItemDto)
    };
  }

  async getContributorHeader(
    contribuyenteId: string
  ): Promise<IUnifiedRegisterHeaderRecord> {
    const dto = await this.requestJson<ApiUnifiedRegisterHeaderResponseDto>(
      UNIFIED_REGISTER_API_ROUTES.contributorHeader(contribuyenteId)
    );

    return mapHeaderDto(dto);
  }

  async listContributorCrosses(
    contribuyenteId: string
  ): Promise<IUnifiedRegisterContributorCrossesData> {
    const dto =
      await this.requestJson<ApiUnifiedRegisterContributorCrossesResponseDto>(
        UNIFIED_REGISTER_API_ROUTES.contributorCrosses(contribuyenteId)
      );

    return {
      crosses: dto.cruces.map(mapContributorCrossDto)
    };
  }

  async getContributorCrossColumns(
    contribuyenteId: string,
    cruceId: string
  ): Promise<IUnifiedRegisterContributorCrossColumnsData> {
    const dto =
      await this.requestJson<ApiUnifiedRegisterContributorCrossColumnsResponseDto>(
        UNIFIED_REGISTER_API_ROUTES.contributorCrossColumns(
          contribuyenteId,
          cruceId
        )
      );

    return mapContributorCrossColumnsDto(dto);
  }

  async listMercurioFines(
    contribuyenteId: string,
    params: IUnifiedRegisterFinesListParams = {}
  ): Promise<IUnifiedRegisterFinesListData> {
    const dto = await this.requestJson<ApiUnifiedRegisterFinesListResponseDto>(
      this.buildPaginatedPath(
        UNIFIED_REGISTER_API_ROUTES.mercurioFines(contribuyenteId),
        params.pagina ?? UNIFIED_REGISTER_DETAIL_PAGINATION.defaultPage,
        params.itemsPagina ??
          UNIFIED_REGISTER_DETAIL_PAGINATION.defaultItemsPerPage,
        undefined,
        UNIFIED_REGISTER_DETAIL_PAGINATION_QUERY_PARAMS
      )
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
    const dto =
      await this.requestJson<ApiUnifiedRegisterInterventionOrdersListResponseDto>(
        this.buildPaginatedPath(
          UNIFIED_REGISTER_API_ROUTES.interventionOrders(contribuyenteId),
          params.pagina ?? UNIFIED_REGISTER_DETAIL_PAGINATION.defaultPage,
          params.itemsPagina ??
            UNIFIED_REGISTER_DETAIL_PAGINATION.defaultItemsPerPage,
          undefined,
          UNIFIED_REGISTER_DETAIL_PAGINATION_QUERY_PARAMS
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
    const dto =
      await this.requestJson<ApiUnifiedRegisterAlternateAddressListResponseDto>(
        UNIFIED_REGISTER_API_ROUTES.alternateAddresses(contribuyenteId)
      );

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

    const dto = await this.requestJson<
      ApiUnifiedRegisterAlternateAddressResponseDto,
      ApiUnifiedRegisterAlternateAddressRequestDto
    >(UNIFIED_REGISTER_API_ROUTES.alternateAddresses(contribuyenteId), {
      method: 'POST',
      body
    });

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

    const dto = await this.requestJson<
      ApiUnifiedRegisterAlternateAddressResponseDto,
      ApiUnifiedRegisterAlternateAddressRequestDto
    >(
      UNIFIED_REGISTER_API_ROUTES.alternateAddress(
        contribuyenteId,
        domicilioAlternativoId
      ),
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
    await requestUnifiedRegisterVoid({
      ...this.config,
      method: 'DELETE',
      path: UNIFIED_REGISTER_API_ROUTES.alternateAddress(
        contribuyenteId,
        domicilioAlternativoId
      )
    });
  }

  async listNotes(
    contribuyenteId: string,
    params: IUnifiedRegisterNotesListParams = {}
  ): Promise<IUnifiedRegisterNotesListData> {
    const dto = await this.requestJson<ApiUnifiedRegisterNotesListResponseDto>(
      this.buildPaginatedPath(
        UNIFIED_REGISTER_API_ROUTES.notes(contribuyenteId),
        params.pagina ?? 1,
        params.itemsPagina ?? 5
      )
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

    const dto = await this.requestJson<
      ApiUnifiedRegisterNoteResponseDto,
      ApiUnifiedRegisterNoteRequestDto
    >(UNIFIED_REGISTER_API_ROUTES.notes(contribuyenteId), {
      method: 'POST',
      body
    });

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

    const dto = await this.requestJson<
      ApiUnifiedRegisterNoteResponseDto,
      ApiUnifiedRegisterNoteRequestDto
    >(UNIFIED_REGISTER_API_ROUTES.note(contribuyenteId, notaId), {
      method: 'PATCH',
      body
    });

    return mapNoteDto(dto);
  }

  async deleteNote(contribuyenteId: string, notaId: string): Promise<void> {
    await requestUnifiedRegisterVoid({
      ...this.config,
      method: 'DELETE',
      path: UNIFIED_REGISTER_API_ROUTES.note(contribuyenteId, notaId)
    });
  }

  async listContacts(
    contribuyenteId: string,
    params: IUnifiedRegisterContactsListParams = {}
  ): Promise<IUnifiedRegisterContactsListData> {
    const dto = await this.requestJson<ApiUnifiedRegisterContactsListResponseDto>(
      this.buildPaginatedPath(
        UNIFIED_REGISTER_API_ROUTES.contacts(contribuyenteId),
        params.pagina ?? 1,
        params.itemsPagina ?? 1
      )
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

    const dto = await this.requestJson<
      ApiUnifiedRegisterContactResponseDto,
      ApiUnifiedRegisterContactRequestDto
    >(UNIFIED_REGISTER_API_ROUTES.contacts(contribuyenteId), {
      method: 'POST',
      body
    });

    return mapContactDto(dto);
  }

  async updateContact(
    contribuyenteId: string,
    contactoId: string,
    payload: IUnifiedRegisterContactInput
  ): Promise<IUnifiedRegisterContactRecord> {
    const body: ApiUnifiedRegisterContactRequestDto = payload;

    const dto = await this.requestJson<
      ApiUnifiedRegisterContactResponseDto,
      ApiUnifiedRegisterContactRequestDto
    >(UNIFIED_REGISTER_API_ROUTES.contact(contribuyenteId, contactoId), {
      method: 'PATCH',
      body
    });

    return mapContactDto(dto);
  }

  async deleteContact(
    contribuyenteId: string,
    contactoId: string
  ): Promise<void> {
    await requestUnifiedRegisterVoid({
      ...this.config,
      method: 'DELETE',
      path: UNIFIED_REGISTER_API_ROUTES.contact(contribuyenteId, contactoId)
    });
  }
}
