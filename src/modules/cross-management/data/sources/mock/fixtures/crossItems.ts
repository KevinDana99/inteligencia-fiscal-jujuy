import type {
  ICrossManagementItem,
  ICrossManagementItems,
  ICrossPreviewIndicator
} from '../../../models/CrossManagement'

interface LegacyCrossPreviewPlanRow {
  id: string
  cuit: string
  businessName: string
  cells: string[]
}

interface LegacyCrossPreviewSummaryRow {
  regime: string
  declaredBase: string
  pretendedBase: string
  difference: string
  tax: string
  netDebt: string
}

interface LegacyCrossPreviewAnalysisRow {
  cuit: string
  businessName: string
  declaredBase: string
  pretendedBase: string
  difference: string
  tax: string
  netDebt: string
  status: 'estado' | 'relevante' | 'reproceso'
}

export interface LegacyCrossPreviewMock extends ICrossManagementItem {
  relevantCountLabel: string
  indicators: ICrossPreviewIndicator[]
  planColumns: string[]
  planRows: LegacyCrossPreviewPlanRow[]
  summaryRows: LegacyCrossPreviewSummaryRow[]
  analysisRows: LegacyCrossPreviewAnalysisRow[]
}

export const crossItemsMock: ICrossManagementItems = [
  {
    id: 'cross-1',
    name: 'Control de Desvío de BI – Régimen General',
    source: 'Lote',
    sourceRef: '623',
    period: '2022–2025',
    cuitCount: 3,
    date: '27/04/2026',
    status: 'completada'
  },
  {
    id: 'cross-2',
    name: 'Control de desvío de BI — Régimen CM',
    source: 'Padrón',
    sourceRef: '30-50401884-5',
    period: '2024–2025',
    cuitCount: 1,
    date: '26/04/2026',
    status: 'completada'
  },
  {
    id: 'cross-3',
    name: 'Control de créditos',
    source: 'Lote',
    sourceRef: 'TRUFA-589',
    period: '2023',
    cuitCount: 83,
    date: '20/04/2026',
    status: 'en_proceso'
  },
  {
    id: 'cross-4',
    name: 'Detección de contribuyentes no inscriptos',
    source: 'Lote',
    sourceRef: 'SECTOR-498',
    period: '2022',
    cuitCount: 22,
    date: '15/04/2026',
    status: 'fallida'
  }
]

const defaultPlanColumns = [
  'ID Período',
  'ID Sig.',
  'CUIT',
  'Razón Social',
  'Fact. ARCA (año)',
  'Fact. ARCA (fecha)',
  'Ag. Percepción',
  'Ag. Retención',
  'Pago a Cta.',
  'Retenciones',
  'MAYOR',
  'CM05 Jujuy',
  'Dif. Base',
  'Mes',
  'Año',
  'Cierre Ej.',
  'Tot. Ing. País',
  'CI Decl.',
  'Tot. Egr.',
  'Coef. Egr.',
  'Nuevo CI',
  'CU Decl.',
  'NCU',
  'BI Total País',
  'BI Estimada',
  'BI Decl. CM03',
  'Alícuota',
  'Imp. Presuntivo',
  'Dif. Créditos',
  'SAF',
  'EST. FINAL'
]

const regimeGeneralPlanColumns = [
  'ID Periodo',
  'CUIT',
  'Razón Social',
  'Año',
  'Act. Excluida BI',
  'Ing. Brutos (BI)',
  'Suma de Mayor BI',
  'Dif. A Favor DPR',
  'Origen Dif.',
  'Alícuota',
  'Coeficiente',
  'Impuesto',
  'Créditos Pendientes',
  'Saldo Última DDJJ',
  'Deuda Neta'
]

export const crossPreviewMockById: Record<string, LegacyCrossPreviewMock> = {
  'cross-1': {
    ...crossItemsMock[0],
    relevantCountLabel: '3 relevantes',
    indicators: [
      { id: 'fuentes-bi', label: 'Fuentes BI', tone: 'blue' },
      { id: 'cm05', label: 'CM05', tone: 'violet' },
      { id: 'coeficientes', label: 'Coeficientes', tone: 'green' },
      { id: 'bi-estimada', label: 'BI Estimada', tone: 'orange' },
      { id: 'impuesto', label: 'Impuesto', tone: 'red' },
      { id: 'final', label: 'Final', tone: 'darkBlue' }
    ],
    planColumns: regimeGeneralPlanColumns,
    planRows: [
      {
        id: 'cross-1-row-1',
        cuit: '27-13889915-8',
        businessName: 'TARIFA NIEVES DOMINGA',
        cells: [
          '271388991582023',
          '27-13889915-8',
          'TARIFA NIEVES DOMINGA',
          '2023',
          '$ 0',
          '$ 147.323.261',
          '$ 162.672.265',
          '$ 15.349.005',
          '1',
          '2,5',
          '1,0000',
          '$ 383.725',
          '$ 0',
          '$ 0',
          '$ 383.725'
        ]
      }
    ],
    summaryRows: [
      {
        regime: 'Contribuyentes Locales (SITI y SIR)',
        declaredBase: '$ 8.031.040.235',
        pretendedBase: '$ 16.488.089.714',
        difference: '$ 8.457.049.480',
        tax: '$ 376.910.462',
        netDebt: '$ 363.755.378'
      },
      {
        regime: 'Contribuyentes con riesgo fiscal alto categoría',
        declaredBase: '—',
        pretendedBase: '—',
        difference: '—',
        tax: '—',
        netDebt: '—'
      }
    ],
    analysisRows: [
      {
        cuit: '27-30606839-9',
        businessName: 'LOAYZA LOPEZ NORA SILVIA',
        declaredBase: '$ 6.773.257.728',
        pretendedBase: '$ 13.841.229.628',
        difference: '$ 7.067.971.900',
        tax: '$ 318.058.735',
        netDebt: '$ 309.959.038',
        status: 'relevante'
      },
      {
        cuit: '27-13889915-8',
        businessName: 'TARIFA NIEVES DOMINGA',
        declaredBase: '$ 1.226.296.007',
        pretendedBase: '$ 2.407.579.984',
        difference: '$ 1.181.283.978',
        tax: '$ 52.850.799',
        netDebt: '$ 48.041.621',
        status: 'relevante'
      },
      {
        cuit: '20-35555846-1',
        businessName: 'TORREZ DANIEL FERNANDO',
        declaredBase: '$ 31.486.500',
        pretendedBase: '$ 239.280.102',
        difference: '$ 207.793.602',
        tax: '$ 6.000.928',
        netDebt: '$ 5.754.719',
        status: 'relevante'
      }
    ]
  },
  'cross-2': {
    ...crossItemsMock[1],
    relevantCountLabel: '1 relevante',
    indicators: [
      { id: 'fuentes-bi', label: 'Fuentes BI', tone: 'blue' },
      { id: 'cm05', label: 'CM05', tone: 'violet' },
      { id: 'coeficientes', label: 'Coeficientes', tone: 'green' },
      { id: 'bi-estimada', label: 'BI Estimada', tone: 'orange' },
      { id: 'impuesto', label: 'Impuesto', tone: 'red' },
      { id: 'final', label: 'Final', tone: 'darkBlue' }
    ],
    planColumns: defaultPlanColumns,
    planRows: [
      {
        id: 'cross-2-row-1',
        cuit: '30-50401884-5',
        businessName: 'VOLKSWAGEN ARGENTINA S.A.',
        cells: [
          '305040188452024',
          '305040188452025',
          '30-50401884-5',
          'VOLKSWAGEN ARGENTINA S.A.',
          '$42.937.860.598',
          '$42.937.860.598',
          '$20.141.951.996',
          '—',
          '—',
          '—',
          '$42.937.860.598',
          '$22.361.024.153',
          '$20.576.836.445',
          '12',
          '2024',
          '31/12/2024',
          '$2.927.995.069.414',
          '0.7600%',
          '$556.230.000.000',
          '0.2000%',
          '1.4664%',
          '0.4800%',
          '0.8332%',
          '$3.512.364.508.204',
          '$29.266.065.257',
          '$16.879.656.323',
          '1.50%',
          '$185.796.134',
          '+$4.589.233',
          '—',
          '$185.814.166'
        ]
      }
    ],
    summaryRows: [
      {
        regime: 'CM',
        declaredBase: '$ 16.879.656.323',
        pretendedBase: '$ 29.266.065.257',
        difference: '$ 12.386.408.934',
        tax: '$ 185.796.134',
        netDebt: '$ 185.814.166'
      }
    ],
    analysisRows: [
      {
        cuit: '30-50401884-5',
        businessName: 'VOLKSWAGEN ARGENTINA S.A.',
        declaredBase: '$ 16.879.656.323',
        pretendedBase: '$ 29.266.065.257',
        difference: '$ 12.386.408.934',
        tax: '$ 185.796.134',
        netDebt: '$ 185.814.166',
        status: 'relevante'
      }
    ]
  },
  'cross-3': {
    ...crossItemsMock[2],
    relevantCountLabel: '12 relevantes',
    indicators: [
      { id: 'fuentes-bi', label: 'Fuentes BI', tone: 'blue' },
      { id: 'cm05', label: 'CM05', tone: 'violet' },
      { id: 'coeficientes', label: 'Coeficientes', tone: 'green' },
      { id: 'bi-estimada', label: 'BI Estimada', tone: 'orange' },
      { id: 'impuesto', label: 'Impuesto', tone: 'red' },
      { id: 'final', label: 'Final', tone: 'darkBlue' }
    ],
    planColumns: defaultPlanColumns,
    planRows: [
      {
        id: 'cross-3-row-1',
        cuit: '30-61234567-2',
        businessName: 'TRANSPORTES QUEBRADA ALTA S.A.',
        cells: [
          '306123456722023',
          '306123456722024',
          '30-61234567-2',
          'TRANSPORTES QUEBRADA ALTA S.A.',
          '$9.420.000.000',
          '$9.420.000.000',
          '$2.100.000.000',
          '$1.220.000.000',
          '—',
          '—',
          '$9.420.000.000',
          '$8.910.000.000',
          '$510.000.000',
          '11',
          '2023',
          '31/12/2023',
          '$580.000.000.000',
          '1.2200%',
          '$310.000.000.000',
          '0.4800%',
          '1.5112%',
          '0.8500%',
          '0.6612%',
          '$880.000.000.000',
          '$5.818.560.000',
          '$5.308.560.000',
          '1.50%',
          '$7.650.000',
          '$500.000',
          '—',
          '$7.150.000'
        ]
      }
    ],
    summaryRows: [
      {
        regime: 'Local',
        declaredBase: '$ 5.308.560.000',
        pretendedBase: '$ 5.818.560.000',
        difference: '$ 510.000.000',
        tax: '$ 7.650.000',
        netDebt: '$ 7.150.000'
      }
    ],
    analysisRows: [
      {
        cuit: '30-61234567-2',
        businessName: 'TRANSPORTES QUEBRADA ALTA S.A.',
        declaredBase: '$ 5.308.560.000',
        pretendedBase: '$ 5.818.560.000',
        difference: '$ 510.000.000',
        tax: '$ 7.650.000',
        netDebt: '$ 7.150.000',
        status: 'reproceso'
      }
    ]
  },
  'cross-4': {
    ...crossItemsMock[3],
    relevantCountLabel: '5 relevantes',
    indicators: [
      { id: 'fuentes-bi', label: 'Fuentes BI', tone: 'blue' },
      { id: 'cm05', label: 'CM05', tone: 'violet' },
      { id: 'coeficientes', label: 'Coeficientes', tone: 'green' },
      { id: 'bi-estimada', label: 'BI Estimada', tone: 'orange' },
      { id: 'impuesto', label: 'Impuesto', tone: 'red' },
      { id: 'final', label: 'Final', tone: 'darkBlue' }
    ],
    planColumns: defaultPlanColumns,
    planRows: [
      {
        id: 'cross-4-row-1',
        cuit: '27-32178654-3',
        businessName: 'MINERA ALTIPLANO JUJUY S.A.',
        cells: [
          '273217865432022',
          '273217865432023',
          '27-32178654-3',
          'MINERA ALTIPLANO JUJUY S.A.',
          '$3.850.000.000',
          '$4.120.000.000',
          '$820.000.000',
          '—',
          '—',
          '—',
          '$4.120.000.000',
          '$1.920.000.000',
          '$2.200.000.000',
          '9',
          '2022',
          '31/12/2022',
          '$215.000.000.000',
          '0.8200%',
          '$104.000.000.000',
          '0.4100%',
          '1.1754%',
          '0.6400%',
          '0.5354%',
          '$356.000.000.000',
          '$1.906.024.000',
          '$706.024.000',
          '1.50%',
          '$33.000.000',
          '—',
          '$220.000',
          '$32.780.000'
        ]
      }
    ],
    summaryRows: [
      {
        regime: 'Local',
        declaredBase: '$ 706.024.000',
        pretendedBase: '$ 1.906.024.000',
        difference: '$ 1.200.000.000',
        tax: '$ 33.000.000',
        netDebt: '$ 32.780.000'
      }
    ],
    analysisRows: [
      {
        cuit: '27-32178654-3',
        businessName: 'MINERA ALTIPLANO JUJUY S.A.',
        declaredBase: '$ 706.024.000',
        pretendedBase: '$ 1.906.024.000',
        difference: '$ 1.200.000.000',
        tax: '$ 33.000.000',
        netDebt: '$ 32.780.000',
        status: 'estado'
      }
    ]
  }
}
