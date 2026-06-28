import type { IExplorerRegisterCatalog } from '../../data/models/ExplorerRegister';
import {
  EXPLORER_REGISTER_SWITCH_INACTIVE_VALUE,
  EXPLORER_REGISTER_TEXTS
} from '../constants';
import {
  buildExplorerRegisterPayload,
  getDefaultExplorerRegisterColumnCodes
} from './buildExplorerRegisterPayload';

const catalog: IExplorerRegisterCatalog = {
  fixedColumns: [
    {
      code: 'cuit',
      name: 'CUIT',
      dataType: 'texto',
      fixed: true
    }
  ],
  availableColumns: [
    {
      code: 'rubro',
      name: 'Rubro',
      dataType: 'texto',
      fixed: false
    },
    {
      code: 'controlInteligenciaFiscal',
      name: 'Control Inteligencia Fiscal',
      dataType: 'numero',
      fixed: false
    }
  ],
  filters: [
    {
      code: 'rubro',
      name: 'Rubro',
      inputType: 'multiseleccion',
      temporal: false,
      available: true,
      unavailableReason: null,
      allowedValues: [],
      relatedColumns: ['rubro'],
      valuesOrigin: 'datos',
      dependencies: []
    },
    {
      code: 'controlInteligenciaFiscal',
      name: 'Control Inteligencia Fiscal',
      inputType: 'switch',
      temporal: true,
      available: true,
      unavailableReason: null,
      allowedValues: ['SI'],
      relatedColumns: ['controlInteligenciaFiscal'],
      valuesOrigin: 'fijo',
      dependencies: []
    }
  ]
};

describe('buildExplorerRegisterPayload', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('allows the explorer screen to start without preselected column options', () => {
    expect(getDefaultExplorerRegisterColumnCodes(catalog, [])).toEqual([]);
  });

  it('deduplicates columns, filters and values while omitting empty filters', () => {
    const result = buildExplorerRegisterPayload({
      catalog,
      selectedColumnCodes: ['rubro', 'rubro', 'unknown'],
      filterValues: {
        rubro: [' TECNOLOGIA ', 'TECNOLOGIA', '', 'Automotor'],
        controlInteligenciaFiscal: []
      },
      temporalRange: {
        startDate: '',
        endDate: ''
      }
    });

    expect(result.error).toBeNull();
    expect(result.payload).toMatchObject({
      page: 1,
      itemsPerPage: 20,
      columns: ['rubro'],
      filters: [
        {
          code: 'rubro',
          values: ['TECNOLOGIA', 'Automotor']
        }
      ]
    });
  });

  it('sends switch filters only when active', () => {
    const inactive = buildExplorerRegisterPayload({
      catalog,
      selectedColumnCodes: ['controlInteligenciaFiscal'],
      filterValues: {
        controlInteligenciaFiscal: []
      },
      temporalRange: {
        startDate: '',
        endDate: ''
      }
    });
    const active = buildExplorerRegisterPayload({
      catalog,
      selectedColumnCodes: ['controlInteligenciaFiscal'],
      filterValues: {
        controlInteligenciaFiscal: ['SI']
      },
      temporalRange: {
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      }
    });

    expect(inactive.payload?.filters).toEqual([]);
    expect(active.payload?.filters).toEqual([
      {
        code: 'controlInteligenciaFiscal',
        values: ['SI']
      }
    ]);
    expect(active.payload).toMatchObject({
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    });
  });

  it('normalizes the global search value without changing filters or columns', () => {
    const result = buildExplorerRegisterPayload({
      catalog,
      selectedColumnCodes: ['rubro'],
      filterValues: {
        rubro: ['Automotor']
      },
      temporalRange: {
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      },
      search: '  volkswagen  '
    });

    expect(result.error).toBeNull();
    expect(result.payload).toMatchObject({
      page: 1,
      columns: ['rubro'],
      filters: [
        {
          code: 'rubro',
          values: ['Automotor']
        }
      ],
      search: 'volkswagen'
    });
  });

  it('omits explicitly inactive switch filters', () => {
    const result = buildExplorerRegisterPayload({
      catalog,
      selectedColumnCodes: ['controlInteligenciaFiscal'],
      filterValues: {
        controlInteligenciaFiscal: [EXPLORER_REGISTER_SWITCH_INACTIVE_VALUE]
      },
      temporalRange: {
        startDate: '',
        endDate: ''
      }
    });

    expect(result.error).toBeNull();
    expect(result.payload?.filters).toEqual([]);
  });

  it('rejects incomplete and invalid temporal ranges', () => {
    const incomplete = buildExplorerRegisterPayload({
      catalog,
      selectedColumnCodes: ['controlInteligenciaFiscal'],
      filterValues: {},
      temporalRange: {
        startDate: '2025-01-01',
        endDate: ''
      }
    });
    const reversed = buildExplorerRegisterPayload({
      catalog,
      selectedColumnCodes: ['controlInteligenciaFiscal'],
      filterValues: {},
      temporalRange: {
        startDate: '2025-12-31',
        endDate: '2025-01-01'
      }
    });
    const overLimit = buildExplorerRegisterPayload({
      catalog,
      selectedColumnCodes: ['controlInteligenciaFiscal'],
      filterValues: {},
      temporalRange: {
        startDate: '2022-01-01',
        endDate: '2025-01-02'
      }
    });

    expect(incomplete.error).toBe(
      EXPLORER_REGISTER_TEXTS.temporalRangeRequired
    );
    expect(reversed.error).toBe(EXPLORER_REGISTER_TEXTS.temporalRangeOrder);
    expect(overLimit.error).toBe(EXPLORER_REGISTER_TEXTS.temporalRangeLimit);
  });

  it('fills an explicit default range when no dates were selected', () => {
    const result = buildExplorerRegisterPayload({
      catalog,
      selectedColumnCodes: ['controlInteligenciaFiscal'],
      filterValues: {
        controlInteligenciaFiscal: ['SI']
      },
      temporalRange: {
        startDate: '',
        endDate: ''
      }
    });

    expect(result.error).toBeNull();
    expect(result.payload).toMatchObject({
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    });
  });
});
