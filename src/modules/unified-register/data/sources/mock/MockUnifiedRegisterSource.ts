import { ApiClientError } from '@/lib/api-client';
import type { IUnifiedRegisterSource } from '../../interfaces/UnifiedRegisterSource';
import type {
  IUnifiedRegisterAlternateAddressInput,
  IUnifiedRegisterAlternateAddressListData,
  IUnifiedRegisterAlternateAddressRecord,
  IUnifiedRegisterContactInput,
  IUnifiedRegisterContactRecord,
  IUnifiedRegisterContactsListData,
  IUnifiedRegisterContactsListParams,
  IUnifiedRegisterContributorCross,
  IUnifiedRegisterContributorCrossColumnsData,
  IUnifiedRegisterContributorCrossesData,
  IUnifiedRegisterFinesListData,
  IUnifiedRegisterFinesListParams,
  IUnifiedRegisterHeaderRecord,
  IUnifiedRegisterItem,
  IUnifiedRegisterInterventionOrdersListData,
  IUnifiedRegisterInterventionOrdersListParams,
  IUnifiedRegisterListData,
  IUnifiedRegisterNoteInput,
  IUnifiedRegisterNoteRecord,
  IUnifiedRegisterNotesListData,
  IUnifiedRegisterNotesListParams
} from '../../models/UnifiedRegister';
import { unifiedRegisterDetailsFixture } from './fixtures/unifiedRegisterItems';

type AlternateAddressesStore = {
  contribuyenteIds: string[];
  recordsByContribuyenteId: Record<string, IUnifiedRegisterAlternateAddressRecord[]>;
};

type NotesStore = {
  contribuyenteIds: string[];
  recordsByContribuyenteId: Record<string, IUnifiedRegisterNoteRecord[]>;
};

type ContactsStore = {
  contribuyenteIds: string[];
  recordsByContribuyenteId: Record<string, IUnifiedRegisterContactRecord[]>;
};

declare global {
  var __mockUnifiedRegisterAlternateAddressStore:
    | AlternateAddressesStore
    | undefined;
  var __mockUnifiedRegisterNotesStore:
    | NotesStore
    | undefined;
  var __mockUnifiedRegisterContactsStore:
    | ContactsStore
    | undefined;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const contributorCrossesMock: IUnifiedRegisterContributorCross[] = [
  {
    id: '7d2e8d59-7d08-4a9f-a12d-449120fb7c9c',
    code: 'ControlDesvioBiRegimenCm',
    name: 'Control de desvío de BI — Régimen CM'
  },
  {
    id: '8fa61d74-7d9e-463b-9cdd-20f393008a6e',
    code: 'ControlDesvioBiRegimenGral',
    name: 'Control de desvío de BI — Régimen Gral'
  },
  {
    id: '02537943-a57e-4860-a6c8-86db4d870d47',
    code: 'ControlBiDeclaradaPorActividad',
    name: 'Control de BI declarada por actividad'
  }
];

const contributorCrossColumnsMockByCode: Record<
  string,
  IUnifiedRegisterContributorCrossColumnsData
> = {
  ControlDesvioBiRegimenCm: {
    code: 'ControlDesvioBiRegimenCm',
    columns: [
      'anio',
      'biEstimada',
      'diferenciaBi',
      'cu',
      'df',
      'cuit',
      'razonSocial',
      'estadoCalculo'
    ],
    rows: [
      {
        anio: 2025,
        biEstimada: 1751937.4278,
        diferenciaBi: 824432.4378,
        cu: 0.0375,
        df: 558897.32,
        cuit: '30100009451',
        razonSocial: 'Contribuyente DEV 00035',
        estadoCalculo: 'Completo'
      }
    ]
  },
  ControlDesvioBiRegimenGral: {
    code: 'ControlDesvioBiRegimenGral',
    columns: ['anio', 'biDeclarada', 'biEstimada', 'diferenciaBi'],
    rows: [
      {
        anio: 2025,
        biDeclarada: 88000000,
        biEstimada: 141000000,
        diferenciaBi: 53000000
      },
      {
        anio: 2026,
        biDeclarada: 74000000,
        biEstimada: 115000000,
        diferenciaBi: 41000000
      }
    ]
  },
  ControlBiDeclaradaPorActividad: {
    code: 'ControlBiDeclaradaPorActividad',
    columns: ['anio', 'actividadDeclarada', 'biDeclarada', 'biEstimada'],
    rows: [
      {
        anio: 2025,
        actividadDeclarada: 'Venta mayorista',
        biDeclarada: 92500000,
        biEstimada: 124000000
      },
      {
        anio: 2026,
        actividadDeclarada: 'Fabricacion de vehiculos',
        biDeclarada: 78000000,
        biEstimada: 95000000
      }
    ]
  }
};

function isUuid(value: string) {
  return UUID_PATTERN.test(value);
}

function normalizeListSearch(value: string | undefined) {
  return value?.trim().toLocaleLowerCase('es-AR') ?? '';
}

function matchesListSearch(
  item: IUnifiedRegisterItem,
  normalizedSearch: string
) {
  if (!normalizedSearch) {
    return true;
  }

  return [item.cuit, item.businessName].some((value) =>
    value.toLocaleLowerCase('es-AR').includes(normalizedSearch)
  );
}

function normalizeDireccion(value: string | null | undefined) {
  return value?.trim() ?? '';
}

function cloneRecord(
  record: IUnifiedRegisterAlternateAddressRecord
): IUnifiedRegisterAlternateAddressRecord {
  return { ...record };
}

function cloneRecords(
  records: IUnifiedRegisterAlternateAddressRecord[]
): IUnifiedRegisterAlternateAddressRecord[] {
  return records.map(cloneRecord);
}

function cloneNoteRecord(record: IUnifiedRegisterNoteRecord): IUnifiedRegisterNoteRecord {
  return { ...record };
}

function cloneNoteRecords(records: IUnifiedRegisterNoteRecord[]): IUnifiedRegisterNoteRecord[] {
  return records.map(cloneNoteRecord);
}

function cloneContactRecord(record: IUnifiedRegisterContactRecord): IUnifiedRegisterContactRecord {
  return { ...record };
}

function cloneContactRecords(
  records: IUnifiedRegisterContactRecord[]
): IUnifiedRegisterContactRecord[] {
  return records.map(cloneContactRecord);
}

function cloneContributorCrossColumnsData(
  data: IUnifiedRegisterContributorCrossColumnsData
): IUnifiedRegisterContributorCrossColumnsData {
  return {
    code: data.code,
    columns: [...data.columns],
    rows: data.rows.map((row) => ({ ...row }))
  };
}

function throwContractError(status: number, codigo: string, mensaje: string): never {
  throw new ApiClientError(status, mensaje, {
    codigo,
    mensaje,
    estado: status
  });
}

function buildInitialStore(): AlternateAddressesStore {
  const contribuyenteIds = unifiedRegisterDetailsFixture.map(
    (item) => item.contribuyenteId
  );
  const recordsByContribuyenteId = Object.fromEntries(
    unifiedRegisterDetailsFixture.map((item) => [
      item.contribuyenteId,
      item.addresses.map((address) => ({
        id: address.id,
        direccion: address.address,
        contribuyenteId: item.contribuyenteId,
        activo: true
      }))
    ])
  );

  return {
    contribuyenteIds,
    recordsByContribuyenteId
  };
}

function getStore(): AlternateAddressesStore {
  if (!globalThis.__mockUnifiedRegisterAlternateAddressStore) {
    globalThis.__mockUnifiedRegisterAlternateAddressStore = buildInitialStore();
  }

  return globalThis.__mockUnifiedRegisterAlternateAddressStore;
}

function buildInitialNotesStore(): NotesStore {
  const contribuyenteIds = unifiedRegisterDetailsFixture.map(
    (item) => item.contribuyenteId
  );
  const recordsByContribuyenteId = Object.fromEntries(
    unifiedRegisterDetailsFixture.map((item) => [
      item.contribuyenteId,
      item.notes.map((note, index) => ({
        id:
          index === 0
            ? '7c053a9a-8470-47e3-a03e-60fd0d7402d7'
            : crypto.randomUUID(),
        descripcion: note.text,
        creadoPorUsuarioId: 'b9188b53-90df-427d-9b96-77d2cc54197a',
        fechaCreacion:
          index === 0
            ? '2026-05-27T15:20:00+00:00'
            : '2026-05-19T15:20:00+00:00',
        contribuyenteId: item.contribuyenteId,
        activo: true
      }))
    ])
  );

  return {
    contribuyenteIds,
    recordsByContribuyenteId
  };
}

function getNotesStore(): NotesStore {
  if (!globalThis.__mockUnifiedRegisterNotesStore) {
    globalThis.__mockUnifiedRegisterNotesStore = buildInitialNotesStore();
  }

  return globalThis.__mockUnifiedRegisterNotesStore;
}

function buildInitialContactsStore(): ContactsStore {
  const contribuyenteIds = unifiedRegisterDetailsFixture.map(
    (item) => item.contribuyenteId
  );
  const recordsByContribuyenteId = Object.fromEntries(
    unifiedRegisterDetailsFixture.map((item) => {
      const currentContact = {
        id: '7c053a9a-8470-47e3-a03e-60fd0d7402d7',
        telefono: item.contacts.find((entry) => entry.id === 'phone')?.value ?? null,
        correo: item.contacts.find((entry) => entry.id === 'mail')?.value ?? null,
        nombreRepresentanteLegal:
          item.contacts.find((entry) => entry.id === 'legal')?.value ?? null,
        nombreContador:
          item.contacts.find((entry) => entry.id === 'accountant')?.value ?? null,
        contribuyenteId: item.contribuyenteId,
        activo: true
      };

      return [item.contribuyenteId, [currentContact]];
    })
  );

  return {
    contribuyenteIds,
    recordsByContribuyenteId
  };
}

function getContactsStore(): ContactsStore {
  if (!globalThis.__mockUnifiedRegisterContactsStore) {
    globalThis.__mockUnifiedRegisterContactsStore = buildInitialContactsStore();
  }

  return globalThis.__mockUnifiedRegisterContactsStore;
}

function ensureContributorForList(contribuyenteId: string) {
  if (!isUuid(contribuyenteId)) {
    throwContractError(
      400,
      'contribuyentes.domicilios_alternativos.listar.solicitud_invalida',
      'El contribuyente informado no es valido.'
    );
  }

  const store = getStore();

  if (!store.contribuyenteIds.includes(contribuyenteId)) {
    throwContractError(
      404,
      'contribuyentes.domicilios_alternativos.listar.contribuyente_no_encontrado',
      'El contribuyente informado no existe.'
    );
  }
}

function ensureContributorForWrite(contribuyenteId: string, action: 'crear' | 'editar' | 'eliminar') {
  if (!isUuid(contribuyenteId)) {
    throwContractError(
      400,
      `contribuyentes.domicilios_alternativos.${action}.solicitud_invalida`,
      'El contribuyente informado no es valido.'
    );
  }

  const store = getStore();

  if (!store.contribuyenteIds.includes(contribuyenteId)) {
    throwContractError(
      404,
      `contribuyentes.domicilios_alternativos.${action}.contribuyente_no_encontrado`,
      'El contribuyente informado no existe.'
    );
  }

  return store;
}

function ensureContributorForNotesList(contribuyenteId: string) {
  if (!isUuid(contribuyenteId)) {
    throwContractError(
      400,
      'contribuyentes.notas.listar.solicitud_invalida',
      'El contribuyente informado no es valido.'
    );
  }

  const store = getNotesStore();

  if (!store.contribuyenteIds.includes(contribuyenteId)) {
    throwContractError(
      404,
      'contribuyentes.notas.listar.contribuyente_no_encontrado',
      'El contribuyente informado no existe.'
    );
  }
}

function ensureContributorForNotesWrite(
  contribuyenteId: string,
  action: 'crear' | 'editar' | 'borrar'
) {
  if (!isUuid(contribuyenteId)) {
    throwContractError(
      400,
      `contribuyentes.notas.${action}.solicitud_invalida`,
      'El contribuyente informado no es valido.'
    );
  }

  const store = getNotesStore();

  if (!store.contribuyenteIds.includes(contribuyenteId)) {
    throwContractError(
      404,
      `contribuyentes.notas.${action}.contribuyente_no_encontrado`,
      'El contribuyente informado no existe.'
    );
  }

  return store;
}

function ensureContributorForContactsList(contribuyenteId: string) {
  if (!isUuid(contribuyenteId)) {
    throwContractError(
      400,
      'contribuyentes.contactos.listar.solicitud_invalida',
      'El contribuyente informado no es valido.'
    );
  }

  const store = getContactsStore();

  if (!store.contribuyenteIds.includes(contribuyenteId)) {
    throwContractError(
      404,
      'contribuyentes.contactos.listar.contribuyente_no_encontrado',
      'El contribuyente informado no existe.'
    );
  }
}

function ensureContributorForContactsWrite(
  contribuyenteId: string,
  action: 'crear' | 'editar' | 'eliminar'
) {
  if (!isUuid(contribuyenteId)) {
    throwContractError(
      400,
      `contribuyentes.contactos.${action}.solicitud_invalida`,
      'El contribuyente informado no es valido.'
    );
  }

  const store = getContactsStore();

  if (!store.contribuyenteIds.includes(contribuyenteId)) {
    throwContractError(
      404,
      `contribuyentes.contactos.${action}.contribuyente_no_encontrado`,
      'El contribuyente informado no existe.'
    );
  }

  return store;
}

function ensureContributorCrossColumns(
  contribuyenteId: string,
  cruceId: string
) {
  if (!isUuid(contribuyenteId) || !isUuid(cruceId)) {
    throwContractError(
      400,
      'contribuyentes.cruces.columnas.solicitud_invalida',
      'El contribuyente informado no es valido.'
    );
  }

  const item = unifiedRegisterDetailsFixture.find(
    (entry) => entry.contribuyenteId === contribuyenteId
  );

  if (!item) {
    throwContractError(
      404,
      'contribuyentes.cruces.columnas.contribuyente_no_encontrado',
      'El contribuyente informado no existe.'
    );
  }

  const cross = contributorCrossesMock.find((entry) => entry.id === cruceId);

  if (!cross) {
    throwContractError(
      404,
      'contribuyentes.cruces.columnas.cruce_no_encontrado',
      'El cruce informado no existe.'
    );
  }

  const data = contributorCrossColumnsMockByCode[cross.code];

  if (!data) {
    throwContractError(
      404,
      'contribuyentes.cruces.columnas.resultado_no_encontrado',
      'No existe resultado disponible para el contribuyente y cruce informados.'
    );
  }

  return data;
}

function validateDireccionForCreate(
  store: AlternateAddressesStore,
  contribuyenteId: string,
  payload: IUnifiedRegisterAlternateAddressInput
) {
  const direccion = normalizeDireccion(payload.direccion);

  if (!direccion) {
    throwContractError(
      400,
      'contribuyentes.domicilios_alternativos.crear.solicitud_invalida',
      'La direccion del domicilio alternativo es obligatoria.'
    );
  }

  if (direccion.length > 500) {
    throwContractError(
      400,
      'contribuyentes.domicilios_alternativos.crear.solicitud_invalida',
      'La direccion del domicilio alternativo no puede superar 500 caracteres.'
    );
  }

  const normalizedDireccion = direccion.toLowerCase();
  const hasDuplicate = Object.values(store.recordsByContribuyenteId)
    .flat()
    .some((record) => normalizeDireccion(record.direccion).toLowerCase() === normalizedDireccion);

  if (hasDuplicate) {
    throwContractError(
      409,
      'contribuyentes.domicilios_alternativos.crear.direccion_duplicada',
      'La direccion informada ya existe como domicilio alternativo.'
    );
  }

  const activeCount =
    store.recordsByContribuyenteId[contribuyenteId]?.filter((record) => record.activo).length ?? 0;

  if (activeCount >= 3) {
    throwContractError(
      409,
      'contribuyentes.domicilios_alternativos.crear.limite_activos_alcanzado',
      'El contribuyente ya tiene 3 domicilios alternativos activos.'
    );
  }

  return direccion;
}

function validateDireccionForUpdate(
  store: AlternateAddressesStore,
  domicilioAlternativoId: string,
  payload: IUnifiedRegisterAlternateAddressInput
) {
  const direccion = normalizeDireccion(payload.direccion);

  if (!direccion) {
    throwContractError(
      400,
      'contribuyentes.domicilios_alternativos.editar.solicitud_invalida',
      'La direccion del domicilio alternativo es obligatoria.'
    );
  }

  if (direccion.length > 500) {
    throwContractError(
      400,
      'contribuyentes.domicilios_alternativos.editar.solicitud_invalida',
      'La direccion del domicilio alternativo no puede superar 500 caracteres.'
    );
  }

  const normalizedDireccion = direccion.toLowerCase();
  const hasDuplicate = Object.values(store.recordsByContribuyenteId)
    .flat()
    .some(
      (record) =>
        record.id !== domicilioAlternativoId &&
        normalizeDireccion(record.direccion).toLowerCase() === normalizedDireccion
    );

  if (hasDuplicate) {
    throwContractError(
      409,
      'contribuyentes.domicilios_alternativos.editar.direccion_duplicada',
      'La direccion informada ya existe como domicilio alternativo.'
    );
  }

  return direccion;
}

function normalizeDescripcion(value: string | null | undefined) {
  return value?.trim() ?? '';
}

function normalizeOptionalField(value: string | null | undefined) {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized ? normalized : null;
}

function validateDescription(
  descripcion: string,
  action: 'crear' | 'editar'
) {
  if (!descripcion) {
    throwContractError(
      400,
      `contribuyentes.notas.${action}.solicitud_invalida`,
      'La descripcion de la nota es obligatoria.'
    );
  }

  if (descripcion.length > 500) {
    throwContractError(
      400,
      `contribuyentes.notas.${action}.solicitud_invalida`,
      'La descripcion de la nota no puede superar 500 caracteres.'
    );
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateContactFields(
  payload: IUnifiedRegisterContactInput,
  action: 'crear' | 'editar'
) {
  const errors: string[] = [];

  if (payload.telefono !== undefined && payload.telefono !== null) {
    const telefono = payload.telefono.trim();
    if (telefono.length > 50) {
      errors.push('El telefono no puede superar 50 caracteres.');
    }
  }

  if (payload.correo !== undefined && payload.correo !== null) {
    const correo = payload.correo.trim();
    if (correo.length > 255) {
      errors.push('El correo no puede superar 255 caracteres.');
    } else if (correo && !isValidEmail(correo)) {
      errors.push('El correo informado no es valido.');
    }
  }

  if (
    payload.nombreRepresentanteLegal !== undefined &&
    payload.nombreRepresentanteLegal !== null &&
    payload.nombreRepresentanteLegal.trim().length > 255
  ) {
    errors.push('El nombre del representante legal no puede superar 255 caracteres.');
  }

  if (
    payload.nombreContador !== undefined &&
    payload.nombreContador !== null &&
    payload.nombreContador.trim().length > 255
  ) {
    errors.push('El nombre del contador no puede superar 255 caracteres.');
  }

  if (errors.length) {
    throwContractError(
      400,
      `contribuyentes.contactos.${action}.solicitud_invalida`,
      errors.join(' ')
    );
  }
}

function validateContactDuplicates(
  records: IUnifiedRegisterContactRecord[],
  targetId: string | null,
  telefono: string | null,
  correo: string | null,
  action: 'crear' | 'editar'
) {
  const duplicatedPhone =
    telefono !== null &&
    records.some(
      (record) =>
        record.activo &&
        record.id !== targetId &&
        record.telefono?.trim() === telefono
    );

  if (duplicatedPhone) {
    throwContractError(
      409,
      `contribuyentes.contactos.${action}.telefono_duplicado`,
      action === 'crear'
        ? 'Ya existe un contacto activo con ese telefono para el contribuyente informado.'
        : 'Ya existe otro contacto activo con ese telefono para el contribuyente informado.'
    );
  }

  const duplicatedMail =
    correo !== null &&
    records.some(
      (record) =>
        record.activo &&
        record.id !== targetId &&
        record.correo?.trim() === correo
    );

  if (duplicatedMail) {
    throwContractError(
      409,
      `contribuyentes.contactos.${action}.correo_duplicado`,
      action === 'crear'
        ? 'Ya existe un contacto activo con ese correo para el contribuyente informado.'
        : 'Ya existe otro contacto activo con ese correo para el contribuyente informado.'
    );
  }
}

export class MockUnifiedRegisterSource implements IUnifiedRegisterSource {
  async listContributors(
    page = 1,
    itemsPerPage = 10,
    search?: string
  ): Promise<IUnifiedRegisterListData> {
    const normalizedSearch = normalizeListSearch(search);
    const items = unifiedRegisterDetailsFixture.map((item) => ({
      contribuyenteId: item.contribuyenteId,
      cuit: item.cuit,
      businessName: item.businessName,
      activity: item.activity,
      regime: item.regime,
      status: item.status,
      riskLevel: item.riskLevel
    })).filter((item) => matchesListSearch(item, normalizedSearch));

    const totalPaginas = items.length ? Math.ceil(items.length / itemsPerPage) : 0;
    const start = (page - 1) * itemsPerPage;

    return {
      pagina: page,
      itemsPagina: itemsPerPage,
      totalItems: items.length,
      totalPaginas,
      contribuyentes: items.slice(start, start + itemsPerPage)
    };
  }

  async getContributorHeader(contribuyenteId: string): Promise<IUnifiedRegisterHeaderRecord> {
    const item = unifiedRegisterDetailsFixture.find(
      (entry) => entry.contribuyenteId === contribuyenteId
    );

    if (!item) {
      throwContractError(
        404,
        'contribuyentes.no_encontrado',
        'El contribuyente informado no existe.'
      );
    }

    return {
      cuit: item.cuit,
      razonSocial: item.businessName,
      activo: item.status === 'Activo',
      tipoContribuyente: item.regime,
      cantidadLotes: Number(item.controlLotsLabel.split(' ')[0]) || 0,
      jurisdiccion: item.jurisdiction,
      actividadPrimaria: {
        nombre: item.activities[0]?.label ?? item.activity,
        numero: '001'
      },
      actividadSecundaria: {
        nombre: item.activities[1]?.label ?? item.secondaryActivity,
        numero: '002'
      },
      inicioActividad: item.startedAt,
      domicilios: {
        fiscal: item.fiscalAddress,
        comercial: item.commercialAddress,
        alternativo: item.addresses.map((address) => ({
          id: address.id,
          nombre: address.address
        }))
      },
      biDeclarada: item.widgets.find((entry) => entry.id === 'declared-bi')?.value ?? '',
      impuestosDeclarados:
        item.widgets.find((entry) => entry.id === 'declared-taxes')?.value ?? '',
      deuda: item.widgets.find((entry) => entry.id === 'debt')?.value ?? '',
      declaracionesJuradas: {
        presentadas: Number(item.widgets.find((entry) => entry.id === 'returns')?.splitValue?.primaryValue ?? 0),
        noPresentadas: Number(item.widgets.find((entry) => entry.id === 'returns')?.splitValue?.secondaryValue ?? 0)
      },
      riesgo: item.riskLevel
    };
  }

  async listContributorCrosses(
    contribuyenteId: string
  ): Promise<IUnifiedRegisterContributorCrossesData> {
    const item = unifiedRegisterDetailsFixture.find(
      (entry) => entry.contribuyenteId === contribuyenteId
    );

    if (!item) {
      throwContractError(404, 'contribuyentes.no_encontrado', 'El contribuyente informado no existe.');
    }

    return {
      crosses: contributorCrossesMock.map((cross) => ({ ...cross }))
    };
  }

  async getContributorCrossColumns(
    contribuyenteId: string,
    cruceId: string
  ): Promise<IUnifiedRegisterContributorCrossColumnsData> {
    return cloneContributorCrossColumnsData(
      ensureContributorCrossColumns(contribuyenteId, cruceId)
    );
  }

  async listMercurioFines(
    contribuyenteId: string,
    params: IUnifiedRegisterFinesListParams = {}
  ): Promise<IUnifiedRegisterFinesListData> {
    const item = unifiedRegisterDetailsFixture.find(
      (entry) => entry.contribuyenteId === contribuyenteId
    );

    if (!item) {
      throwContractError(404, 'contribuyentes.no_encontrado', 'El contribuyente informado no existe.');
    }

    const page = params.pagina ?? 1;
    const itemsPerPage = params.itemsPagina ?? 20;
    const totalItems = item.fines.length;
    const totalPaginas = totalItems ? Math.ceil(totalItems / itemsPerPage) : 0;
    const start = (page - 1) * itemsPerPage;

    return {
      pagina: page,
      itemsPagina: itemsPerPage,
      totalItems,
      totalPaginas,
      multas: item.fines.slice(start, start + itemsPerPage).map((fine) => ({
        numero: fine.id,
        fecha: fine.issuedAt,
        tipo: fine.type ?? null,
        descripcion: fine.description,
        monto: fine.amount,
        estado: fine.status
      }))
    };
  }

  async listInterventionOrders(
    contribuyenteId: string,
    params: IUnifiedRegisterInterventionOrdersListParams = {}
  ): Promise<IUnifiedRegisterInterventionOrdersListData> {
    const item = unifiedRegisterDetailsFixture.find(
      (entry) => entry.contribuyenteId === contribuyenteId
    );

    if (!item) {
      throwContractError(404, 'contribuyentes.no_encontrado', 'El contribuyente informado no existe.');
    }

    const page = params.pagina ?? 1;
    const itemsPerPage = params.itemsPagina ?? 20;
    const totalItems = item.interventionOrders.length;
    const totalPaginas = totalItems ? Math.ceil(totalItems / itemsPerPage) : 0;
    const start = (page - 1) * itemsPerPage;

    return {
      pagina: page,
      itemsPagina: itemsPerPage,
      totalItems,
      totalPaginas,
      ordenes: item.interventionOrders
        .slice(start, start + itemsPerPage)
        .map((order) => ({
          numero: order.id,
          origen: order.origin ?? null,
          instruccion: order.instruction ?? order.reason,
          periodo: order.period,
          deuda: order.debt ?? order.amount,
          bi: order.declaredBi ?? null,
          motivo: order.reason,
          monto: order.amount,
          estado: order.status
        }))
    };
  }

  async listAlternateAddresses(
    contribuyenteId: string
  ): Promise<IUnifiedRegisterAlternateAddressListData> {
    ensureContributorForList(contribuyenteId);
    const store = getStore();

    return {
      domiciliosAlternativos: cloneRecords(
        (store.recordsByContribuyenteId[contribuyenteId] ?? []).filter((record) => record.activo)
      )
    };
  }

  async createAlternateAddress(
    contribuyenteId: string,
    payload: IUnifiedRegisterAlternateAddressInput
  ): Promise<IUnifiedRegisterAlternateAddressRecord> {
    const store = ensureContributorForWrite(contribuyenteId, 'crear');
    const direccion = validateDireccionForCreate(store, contribuyenteId, payload);

    const nextRecord: IUnifiedRegisterAlternateAddressRecord = {
      id: crypto.randomUUID(),
      direccion,
      contribuyenteId,
      activo: true
    };

    store.recordsByContribuyenteId[contribuyenteId] = [
      ...(store.recordsByContribuyenteId[contribuyenteId] ?? []),
      nextRecord
    ];

    return cloneRecord(nextRecord);
  }

  async updateAlternateAddress(
    contribuyenteId: string,
    domicilioAlternativoId: string,
    payload: IUnifiedRegisterAlternateAddressInput
  ): Promise<IUnifiedRegisterAlternateAddressRecord> {
    const store = ensureContributorForWrite(contribuyenteId, 'editar');

    if (!isUuid(domicilioAlternativoId)) {
      throwContractError(
        400,
        'contribuyentes.domicilios_alternativos.editar.solicitud_invalida',
        'El domicilio alternativo informado no es valido.'
      );
    }

    const records = store.recordsByContribuyenteId[contribuyenteId] ?? [];
    const recordIndex = records.findIndex(
      (record) => record.id === domicilioAlternativoId && record.activo
    );

    if (recordIndex === -1) {
      throwContractError(
        404,
        'contribuyentes.domicilios_alternativos.editar.domicilio_alternativo_no_encontrado',
        'El domicilio alternativo informado no existe o no esta activo para el contribuyente.'
      );
    }

    const direccion = validateDireccionForUpdate(store, domicilioAlternativoId, payload);
    const updatedRecord: IUnifiedRegisterAlternateAddressRecord = {
      ...records[recordIndex],
      direccion
    };

    records[recordIndex] = updatedRecord;

    return cloneRecord(updatedRecord);
  }

  async deleteAlternateAddress(
    contribuyenteId: string,
    domicilioAlternativoId: string
  ): Promise<void> {
    const store = ensureContributorForWrite(contribuyenteId, 'eliminar');

    if (!isUuid(domicilioAlternativoId)) {
      throwContractError(
        400,
        'contribuyentes.domicilios_alternativos.eliminar.solicitud_invalida',
        'El domicilio alternativo informado no es valido.'
      );
    }

    const records = store.recordsByContribuyenteId[contribuyenteId] ?? [];
    const recordIndex = records.findIndex(
      (record) => record.id === domicilioAlternativoId && record.activo
    );

    if (recordIndex === -1) {
      throwContractError(
        404,
        'contribuyentes.domicilios_alternativos.eliminar.domicilio_alternativo_no_encontrado',
        'El domicilio alternativo informado no existe o no esta activo para el contribuyente.'
      );
    }

    records[recordIndex] = {
      ...records[recordIndex],
      activo: false
    };
  }

  async listNotes(
    contribuyenteId: string,
    params: IUnifiedRegisterNotesListParams = {}
  ): Promise<IUnifiedRegisterNotesListData> {
    ensureContributorForNotesList(contribuyenteId);

    const page = params.pagina ?? 1;
    const itemsPerPage = params.itemsPagina ?? 5;

    if (page <= 0) {
      throwContractError(
        400,
        'contribuyentes.notas.listar.solicitud_invalida',
        'La pagina debe ser mayor a cero.'
      );
    }

    if (itemsPerPage < 1 || itemsPerPage > 5) {
      throwContractError(
        400,
        'contribuyentes.notas.listar.solicitud_invalida',
        'Los items por pagina deben estar entre 1 y 5.'
      );
    }

    const store = getNotesStore();
    const activeRecords = cloneNoteRecords(
      (store.recordsByContribuyenteId[contribuyenteId] ?? [])
        .filter((record) => record.activo)
        .sort((left, right) => {
          if (left.fechaCreacion === right.fechaCreacion) {
            return left.id.localeCompare(right.id);
          }

          return right.fechaCreacion.localeCompare(left.fechaCreacion);
        })
    );

    const totalPaginas = activeRecords.length
      ? Math.ceil(activeRecords.length / itemsPerPage)
      : 0;
    const start = (page - 1) * itemsPerPage;
    const notas =
      totalPaginas === 0 ? [] : activeRecords.slice(start, start + itemsPerPage);

    return {
      pagina: page,
      itemsPagina: itemsPerPage,
      totalPaginas,
      notas
    };
  }

  async createNote(
    contribuyenteId: string,
    payload: IUnifiedRegisterNoteInput
  ): Promise<IUnifiedRegisterNoteRecord> {
    const store = ensureContributorForNotesWrite(contribuyenteId, 'crear');
    const descripcion = normalizeDescripcion(payload.descripcion);
    validateDescription(descripcion, 'crear');

    const nextRecord: IUnifiedRegisterNoteRecord = {
      id: crypto.randomUUID(),
      descripcion,
      creadoPorUsuarioId: 'b9188b53-90df-427d-9b96-77d2cc54197a',
      fechaCreacion: new Date().toISOString(),
      contribuyenteId,
      activo: true
    };

    store.recordsByContribuyenteId[contribuyenteId] = [
      nextRecord,
      ...(store.recordsByContribuyenteId[contribuyenteId] ?? [])
    ];

    return cloneNoteRecord(nextRecord);
  }

  async updateNote(
    contribuyenteId: string,
    notaId: string,
    payload: IUnifiedRegisterNoteInput
  ): Promise<IUnifiedRegisterNoteRecord> {
    const store = ensureContributorForNotesWrite(contribuyenteId, 'editar');

    if (!isUuid(notaId)) {
      throwContractError(
        400,
        'contribuyentes.notas.editar.solicitud_invalida',
        'La nota informada no es valida.'
      );
    }

    const descripcion = normalizeDescripcion(payload.descripcion);
    validateDescription(descripcion, 'editar');

    const records = store.recordsByContribuyenteId[contribuyenteId] ?? [];
    const recordIndex = records.findIndex((record) => record.id === notaId && record.activo);

    if (recordIndex === -1) {
      throwContractError(
        404,
        'contribuyentes.notas.editar.nota_no_encontrada',
        'La nota no existe o no esta activa.'
      );
    }

    records[recordIndex] = {
      ...records[recordIndex],
      descripcion
    };

    return cloneNoteRecord(records[recordIndex]);
  }

  async deleteNote(contribuyenteId: string, notaId: string): Promise<void> {
    const store = ensureContributorForNotesWrite(contribuyenteId, 'borrar');

    if (!isUuid(notaId)) {
      throwContractError(
        400,
        'contribuyentes.notas.borrar.solicitud_invalida',
        'La nota informada no es valida.'
      );
    }

    const records = store.recordsByContribuyenteId[contribuyenteId] ?? [];
    const recordIndex = records.findIndex((record) => record.id === notaId && record.activo);

    if (recordIndex === -1) {
      throwContractError(
        404,
        'contribuyentes.notas.borrar.nota_no_encontrada',
        'La nota no existe o no esta activa.'
      );
    }

    records[recordIndex] = {
      ...records[recordIndex],
      activo: false
    };
  }

  async listContacts(
    contribuyenteId: string,
    params: IUnifiedRegisterContactsListParams = {}
  ): Promise<IUnifiedRegisterContactsListData> {
    ensureContributorForContactsList(contribuyenteId);

    const page = params.pagina ?? 1;
    const itemsPerPage = params.itemsPagina ?? 1;

    if (page <= 0) {
      throwContractError(
        400,
        'contribuyentes.contactos.listar.solicitud_invalida',
        'La pagina debe ser mayor a cero.'
      );
    }

    if (itemsPerPage !== 1) {
      throwContractError(
        400,
        'contribuyentes.contactos.listar.solicitud_invalida',
        'Los items por pagina deben ser igual a 1.'
      );
    }

    const store = getContactsStore();
    const activeRecords = cloneContactRecords(
      (store.recordsByContribuyenteId[contribuyenteId] ?? [])
        .filter((record) => record.activo)
        .sort((left, right) => left.id.localeCompare(right.id))
    );

    const totalPaginas = activeRecords.length;
    const start = (page - 1) * itemsPerPage;

    return {
      pagina: page,
      itemsPagina: itemsPerPage,
      totalPaginas,
      contactos:
        totalPaginas === 0 ? [] : activeRecords.slice(start, start + itemsPerPage)
    };
  }

  async createContact(
    contribuyenteId: string,
    payload: IUnifiedRegisterContactInput
  ): Promise<IUnifiedRegisterContactRecord> {
    const store = ensureContributorForContactsWrite(contribuyenteId, 'crear');
    validateContactFields(payload, 'crear');

    const records = store.recordsByContribuyenteId[contribuyenteId] ?? [];
    const nextRecord: IUnifiedRegisterContactRecord = {
      id: crypto.randomUUID(),
      telefono: normalizeOptionalField(payload.telefono),
      correo: normalizeOptionalField(payload.correo),
      nombreRepresentanteLegal: normalizeOptionalField(payload.nombreRepresentanteLegal),
      nombreContador: normalizeOptionalField(payload.nombreContador),
      contribuyenteId,
      activo: true
    };

    validateContactDuplicates(
      records,
      null,
      nextRecord.telefono,
      nextRecord.correo,
      'crear'
    );

    store.recordsByContribuyenteId[contribuyenteId] = [...records, nextRecord];

    return cloneContactRecord(nextRecord);
  }

  async updateContact(
    contribuyenteId: string,
    contactoId: string,
    payload: IUnifiedRegisterContactInput
  ): Promise<IUnifiedRegisterContactRecord> {
    const store = ensureContributorForContactsWrite(contribuyenteId, 'editar');

    if (!isUuid(contactoId)) {
      throwContractError(
        400,
        'contribuyentes.contactos.editar.solicitud_invalida',
        'El contacto informado no es valido.'
      );
    }

    validateContactFields(payload, 'editar');

    const records = store.recordsByContribuyenteId[contribuyenteId] ?? [];
    const recordIndex = records.findIndex((record) => record.id === contactoId && record.activo);

    if (recordIndex === -1) {
      throwContractError(
        404,
        'contribuyentes.contactos.editar.contacto_no_encontrado',
        'El contacto no existe o no esta activo.'
      );
    }

    const currentRecord = records[recordIndex];
    const nextRecord: IUnifiedRegisterContactRecord = {
      ...currentRecord,
      telefono:
        payload.telefono === undefined || payload.telefono === null
          ? currentRecord.telefono
          : normalizeOptionalField(payload.telefono),
      correo:
        payload.correo === undefined || payload.correo === null
          ? currentRecord.correo
          : normalizeOptionalField(payload.correo),
      nombreRepresentanteLegal:
        payload.nombreRepresentanteLegal === undefined ||
        payload.nombreRepresentanteLegal === null
          ? currentRecord.nombreRepresentanteLegal
          : normalizeOptionalField(payload.nombreRepresentanteLegal),
      nombreContador:
        payload.nombreContador === undefined || payload.nombreContador === null
          ? currentRecord.nombreContador
          : normalizeOptionalField(payload.nombreContador)
    };

    validateContactDuplicates(
      records,
      currentRecord.id,
      nextRecord.telefono,
      nextRecord.correo,
      'editar'
    );

    records[recordIndex] = nextRecord;

    return cloneContactRecord(nextRecord);
  }

  async deleteContact(contribuyenteId: string, contactoId: string): Promise<void> {
    const store = ensureContributorForContactsWrite(contribuyenteId, 'eliminar');

    if (!isUuid(contactoId)) {
      throwContractError(
        400,
        'contribuyentes.contactos.eliminar.solicitud_invalida',
        'El contacto informado no es valido.'
      );
    }

    const records = store.recordsByContribuyenteId[contribuyenteId] ?? [];
    const recordIndex = records.findIndex((record) => record.id === contactoId && record.activo);

    if (recordIndex === -1) {
      throwContractError(
        404,
        'contribuyentes.contactos.eliminar.contacto_no_encontrado',
        'El contacto no existe o no esta activo.'
      );
    }

    records[recordIndex] = {
      ...records[recordIndex],
      activo: false
    };
  }
}
