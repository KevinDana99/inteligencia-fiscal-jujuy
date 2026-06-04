import type {
  ICrossManagementItems,
  ICrossPreviewData
} from '../../../models/CrossManagement'

export const crossItemsMock: ICrossManagementItems = [
  {
    id: 'cross-1',
    name: 'Control de desvío de BI — Régimen CM',
    source: 'Lote',
    sourceRef: 'ANOVA-622',
    period: '2024',
    cuitCount: 2,
    date: '27/04/2026'
  },
  {
    id: 'cross-2',
    name: 'Control de desvío de BI — Régimen CM',
    source: 'Padrón',
    sourceRef: '30-50401884-5',
    period: '2024–2025',
    cuitCount: 1,
    date: '26/04/2026'
  },
  {
    id: 'cross-3',
    name: 'Control de créditos',
    source: 'Lote',
    sourceRef: 'TRUFA-589',
    period: '2023',
    cuitCount: 83,
    date: '20/04/2026'
  },
  {
    id: 'cross-4',
    name: 'Detección de contribuyentes no inscriptos',
    source: 'Lote',
    sourceRef: 'SECTOR-498',
    period: '2022',
    cuitCount: 22,
    date: '15/04/2026'
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

export const crossPreviewMockById: Record<string, ICrossPreviewData> = {
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
    planColumns: defaultPlanColumns,
    planRows: [
      {
        id: 'cross-1-row-1',
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
      },
      {
        id: 'cross-1-row-2',
        cuit: '30-50168521-2',
        businessName: 'CERÁMICA DEL NORTE S.A.',
        cells: [
          '305016852122024',
          '305016852122025',
          '30-50168521-2',
          'CERÁMICA DEL NORTE S.A.',
          '$1.109.054.107',
          '$1.305.623.207',
          '$1.366.863.071',
          '—',
          '—',
          '—',
          '$1.366.863.071',
          '$55.803.248',
          '$1.311.059.823',
          '8',
          '2024',
          '31/08/2024',
          '$11.158.844.393',
          '0.5000%',
          '$8.929.036.168',
          '0.0000%',
          '12.2491%',
          '0.2500%',
          '6.1246%',
          '$13.970.733.232',
          '$855.647.711',
          '$32.767.157',
          '1.50%',
          '$12.343.208',
          '—',
          '$503.979',
          '$12.343.208'
        ]
      }
    ],
    summaryRows: [
      {
        regime: 'CM',
        declaredBase: '$ 16.912.423.480',
        pretendedBase: '$ 0',
        difference: '-$ 16.912.423.480',
        tax: '-$ 253.686.352',
        netDebt: '-$ 253.668.320'
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
      },
      {
        cuit: '30-50168521-2',
        businessName: 'CERÁMICA DEL NORTE S.A.',
        declaredBase: '$ 32.767.157',
        pretendedBase: '$ 855.647.711',
        difference: '$ 822.880.554',
        tax: '$ 12.343.208',
        netDebt: '$ 12.343.208',
        status: 'estado'
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
