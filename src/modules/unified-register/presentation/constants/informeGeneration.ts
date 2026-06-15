import type { IInformeSelectedCross } from '@/modules/documents';

export type InformeFiscalActionField =
  | 'origenPedido'
  | 'impuestosAVerificar'
  | 'periodo'
  | 'origenOI'
  | 'programa'
  | 'tipoInstruccion'
  | 'impuestoNeto';

export interface InformeGenerationForm {
  titulo: string;
  destinatario: string;
  datosAccionFiscalizadora: Record<InformeFiscalActionField, string>;
}

export interface InformeCrossPreviewColumn {
  key: string;
  label: string;
  align?: 'left' | 'right';
}

export interface InformeCrossOption extends IInformeSelectedCross {
  id: string;
  description: string;
  previewTitle: string;
  previewColumns: InformeCrossPreviewColumn[];
  summary: string;
}

export const INFORME_DEFAULT_FORM: InformeGenerationForm = {
  titulo: 'INFORME DE INVESTIGACIÓN',
  destinatario: '',
  datosAccionFiscalizadora: {
    origenPedido: 'DPTO. INTELIGENCIA FISCAL',
    impuestosAVerificar: 'IMPUESTO SOBRE LOS INGRESOS BRUTOS',
    periodo: '',
    origenOI: '',
    programa: '',
    tipoInstruccion: '',
    impuestoNeto: ''
  }
};

const BASE_IMPONIBLE_COLUMNS: InformeCrossPreviewColumn[] = [
  {
    key: 'baseImponibleIngresosBrutos',
    label: 'BASE IMPONIBLE INGRESOS BRUTOS',
    align: 'right'
  },
  {
    key: 'baseImponibleInformadaPorTerceros',
    label: 'BASE IMPONIBLE INFORMADA POR TERCEROS (*)',
    align: 'right'
  },
  {
    key: 'diferenciaBaseImponible',
    label: 'DIFERENCIA DE BASE IMPONIBLE',
    align: 'right'
  }
];

export const INFORME_CROSS_OPTIONS: InformeCrossOption[] = [
  {
    id: 'cruce_cm',
    nombre: 'Control de desvío de BI — Régimen CM',
    description: 'Ejecutado · 2 CUITs analizados',
    previewTitle: 'CRUCE DE BASE IMPONIBLE',
    previewColumns: BASE_IMPONIBLE_COLUMNS,
    summary: 'Posee diferencia de base imponible en IIBB de $ 360.872.791.',
    columnasSeleccionadas: {
      claves: [
        'baseImponibleIngresosBrutos',
        'baseImponibleInformadaPorTerceros',
        'diferenciaBaseImponible'
      ],
      filas: [
        {
          periodo: '2025',
          baseImponibleIngresosBrutos: '$ 29.525.523',
          baseImponibleInformadaPorTerceros: '$ 236.729.879',
          diferenciaBaseImponible: '$ 207.204.355'
        },
        {
          periodo: '2026',
          baseImponibleIngresosBrutos: '$ 0',
          baseImponibleInformadaPorTerceros: '$ 156.668.436',
          diferenciaBaseImponible: '$ 153.668.436'
        },
        {
          periodo: 'TOTAL',
          baseImponibleIngresosBrutos: '$ 29.525.523',
          baseImponibleInformadaPorTerceros: '$ 393.398.315',
          diferenciaBaseImponible: '$ 360.872.791'
        }
      ]
    }
  },
  {
    id: 'cruce_gral',
    nombre: 'Control de desvío de BI — Régimen Gral',
    description: 'Ejecutado · 2 CUITs analizados',
    previewTitle: 'CRUCE DE BASE IMPONIBLE RÉGIMEN GENERAL',
    previewColumns: BASE_IMPONIBLE_COLUMNS,
    summary: 'Posee diferencia de base imponible en régimen general de $ 94.000.000.',
    columnasSeleccionadas: {
      claves: [
        'baseImponibleIngresosBrutos',
        'baseImponibleInformadaPorTerceros',
        'diferenciaBaseImponible'
      ],
      filas: [
        {
          periodo: '2025',
          baseImponibleIngresosBrutos: '$ 88.000.000',
          baseImponibleInformadaPorTerceros: '$ 141.000.000',
          diferenciaBaseImponible: '$ 53.000.000'
        },
        {
          periodo: '2026',
          baseImponibleIngresosBrutos: '$ 74.000.000',
          baseImponibleInformadaPorTerceros: '$ 115.000.000',
          diferenciaBaseImponible: '$ 41.000.000'
        }
      ]
    }
  },
  {
    id: 'cruce_act',
    nombre: 'Control de BI declarada por actividad',
    description: 'Ejecutado · 2 CUITs analizados',
    previewTitle: 'CRUCE DE ACTIVIDAD DECLARADA',
    previewColumns: [
      {
        key: 'actividadDeclarada',
        label: 'ACTIVIDAD DECLARADA'
      },
      {
        key: 'baseImponibleDeclarada',
        label: 'BASE IMPONIBLE DECLARADA',
        align: 'right'
      },
      {
        key: 'baseImponibleEstimada',
        label: 'BASE IMPONIBLE ESTIMADA',
        align: 'right'
      }
    ],
    summary: 'Posee desvío por actividad declarada de $ 48.500.000.',
    columnasSeleccionadas: {
      claves: [
        'actividadDeclarada',
        'baseImponibleDeclarada',
        'baseImponibleEstimada'
      ],
      filas: [
        {
          periodo: '2025',
          actividadDeclarada: 'Venta mayorista',
          baseImponibleDeclarada: '$ 92.500.000',
          baseImponibleEstimada: '$ 124.000.000'
        },
        {
          periodo: '2026',
          actividadDeclarada: 'Fabricación de vehículos',
          baseImponibleDeclarada: '$ 78.000.000',
          baseImponibleEstimada: '$ 95.000.000'
        }
      ]
    }
  }
];

export const DEFAULT_SELECTED_INFORME_CROSS_IDS = [INFORME_CROSS_OPTIONS[0].id];

export const INFORME_INTRO_TEXT =
  'Se eleva para su conocimiento y consideración, informe sobre la situación fiscal del contribuyente abajo descripto, solicitando el cargo al Dpto. Inspecciones y Verificaciones, conforme a los fundamentos, datos y periodos fiscales que se indican a continuación:';
