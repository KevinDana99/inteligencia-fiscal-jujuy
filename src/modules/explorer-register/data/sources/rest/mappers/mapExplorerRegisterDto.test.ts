import {
  mapExplorerRegisterCatalogDto,
  mapExplorerRegisterExploreRequestDto,
  mapExplorerRegisterExploreResponseDto
} from './mapExplorerRegisterDto';

describe('mapExplorerRegisterDto', () => {
  it('maps the filter catalog contract', () => {
    const catalog = mapExplorerRegisterCatalogDto({
      columnasFijas: [
        {
          codigo: 'cuit',
          nombre: 'CUIT',
          tipoDato: 'texto'
        }
      ],
      columnasDisponibles: [
        {
          codigo: 'controlInteligenciaFiscal',
          nombre: 'Control Inteligencia Fiscal',
          tipoDato: 'numero'
        }
      ],
      filtros: [
        {
          codigo: 'controlInteligenciaFiscal',
          nombre: 'Control Inteligencia Fiscal',
          tipoEntrada: 'switch',
          temporal: true,
          disponible: true,
          motivoNoDisponible: null,
          valoresPermitidos: ['SI'],
          columnasRelacionadas: ['controlInteligenciaFiscal'],
          origenValores: 'fijo',
          dependencias: []
        }
      ]
    });

    expect(catalog.fixedColumns).toEqual([
      {
        code: 'cuit',
        name: 'CUIT',
        dataType: 'texto',
        fixed: true
      }
    ]);
    expect(catalog.availableColumns).toEqual([
      {
        code: 'controlInteligenciaFiscal',
        name: 'Control Inteligencia Fiscal',
        dataType: 'numero',
        fixed: false
      }
    ]);
    expect(catalog.filters[0]).toMatchObject({
      code: 'controlInteligenciaFiscal',
      inputType: 'switch',
      temporal: true,
      allowedValues: ['SI']
    });
  });

  it('maps explore payload to the backend request contract', () => {
    const request = mapExplorerRegisterExploreRequestDto({
      page: 2,
      itemsPerPage: 50,
      columns: ['rubro'],
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      search: '  Volkswagen  ',
      filters: [
        {
          code: 'rubro',
          values: ['TECNOLOGIA']
        }
      ]
    });

    expect(request).toEqual({
      pagina: 2,
      itemsPagina: 50,
      columnas: ['rubro'],
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      busqueda: 'Volkswagen',
      filtros: [
        {
          codigo: 'rubro',
          valores: ['TECNOLOGIA']
        }
      ]
    });
  });

  it('omits blank global search from the backend request contract', () => {
    const request = mapExplorerRegisterExploreRequestDto({
      page: 1,
      itemsPerPage: 20,
      columns: [],
      filters: [],
      search: '   '
    });

    expect(request).toEqual({
      pagina: 1,
      itemsPagina: 20,
      columnas: [],
      filtros: []
    });
  });

  it('maps explore response values including numbers, nulls, and empty pages', () => {
    const response = mapExplorerRegisterExploreResponseDto({
      pagina: 1,
      itemsPagina: 20,
      totalItems: 0,
      totalPaginas: 0,
      columnas: [
        {
          codigo: 'cuit',
          nombre: 'CUIT',
          tipoDato: 'texto',
          fija: true
        },
        {
          codigo: 'controlInteligenciaFiscal',
          nombre: 'Control Inteligencia Fiscal',
          tipoDato: 'numero',
          fija: false
        }
      ],
      criterioAplicado: {
        fechaInicio: null,
        fechaFin: null,
        filtros: [],
        origenPeriodo: 'defecto36Meses'
      },
      filas: []
    });

    expect(response).toEqual({
      page: 1,
      itemsPerPage: 20,
      totalItems: 0,
      totalPages: 0,
      columns: [
        {
          code: 'cuit',
          name: 'CUIT',
          dataType: 'texto',
          fixed: true
        },
        {
          code: 'controlInteligenciaFiscal',
          name: 'Control Inteligencia Fiscal',
          dataType: 'numero',
          fixed: false
        }
      ],
      appliedCriteria: {
        startDate: null,
        endDate: null,
        filters: [],
        periodOrigin: 'defecto36Meses'
      },
      rows: []
    });

    const responseWithRows = mapExplorerRegisterExploreResponseDto({
      pagina: 1,
      itemsPagina: 20,
      totalItems: 1,
      totalPaginas: 1,
      columnas: [],
      criterioAplicado: {
        fechaInicio: '2025-01-01',
        fechaFin: '2025-12-31',
        filtros: ['controlInteligenciaFiscal'],
        origenPeriodo: 'explicito'
      },
      filas: [
        {
          cuit: '30712345671',
          razonSocial: 'Servicios Centro SA',
          valores: {
            controlInteligenciaFiscal: 2,
            trufa: null,
            rubro: 'TE'
          }
        }
      ]
    });

    expect(responseWithRows.rows[0]).toEqual({
      cuit: '30712345671',
      businessName: 'Servicios Centro SA',
      values: {
        controlInteligenciaFiscal: 2,
        trufa: null,
        rubro: 'TE'
      }
    });
  });
});
