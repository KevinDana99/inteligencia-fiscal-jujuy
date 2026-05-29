'use client';

import { useCallback, useMemo, useState } from 'react';

export type DashboardConfigurationTab = 'intimacion' | 'informe';

type DashboardConfigurationColumn = {
  id: string;
  value: string;
  locked?: boolean;
};

type DashboardConfigurationColumnOption = {
  id: string;
  label: string;
  locked?: boolean;
};

type DashboardConfigurationState = {
  activeTab: DashboardConfigurationTab;
  intimacion: {
    asunto: string;
    saludo: string;
    cuerpo: string;
    cierre: string;
    piePlanilla: string;
    columnas: DashboardConfigurationColumn[];
  };
  informe: {
    titulo: string;
  };
};

const COLUMN_OPTIONS: DashboardConfigurationColumnOption[] = [
  { id: 'fact-arca-anio', label: 'Fact. ARCA (año)' },
  { id: 'ag-percepcion', label: 'Ag. Percepción' },
  { id: 'ag-retencion', label: 'Ag. Retención' },
  { id: 'pago-a-cta', label: 'Pago a Cta.' },
  { id: 'mes', label: 'Mes' },
  { id: 'anio', label: 'Año' },
  { id: 'cierre-ej', label: 'Cierre Ej.' },
  { id: 'tot-ing-pais', label: 'Tot. Ing. País' },
  { id: 'ci-decl', label: 'CI Decl.' },
  { id: 'tot-egr', label: 'Tot. Egr.' },
  { id: 'coef-egr', label: 'Coef. Egr.' },
  { id: 'nuevo-ci', label: 'Nuevo CI' },
  { id: 'cu-decl', label: 'CU Decl.' },
  { id: 'ncu', label: 'NCU' },
  { id: 'bi-total-pais', label: 'BI Total País' },
  { id: 'bi-estimada', label: 'BI Estimada' },
  { id: 'bi-decl-cm03', label: 'BI Decl. CM03' },
  { id: 'alicuota', label: 'Alícuota' },
  { id: 'dif-creditos', label: 'Dif. Créditos' },
  { id: 'saf', label: 'SAF' }
];

const DEFAULT_STATE: DashboardConfigurationState = {
  activeTab: 'intimacion',
  intimacion: {
    asunto: 'PRESUNTA DIFERENCIA DE BASE IMPONIBLE',
    saludo: 'Señor Contribuyente:',
    cuerpo:
      'Por medio de la presente, la Dirección Provincial de Rentas de Jujuy pone en su conocimiento que sobre la base de información cierta, derivada del cruce de bases de datos con el organismo recaudador nacional (ARCA) y los agentes de recaudación designados por este organismo, se han detectado inconsistencias en sus declaraciones juradas y en el cumplimiento de sus obligaciones fiscales en los periodos que se detallan en planilla adjunta.\n\nPor ello, y en uso de las facultades conferidas a este organismo por el art. 10º inc. 3 del Código Fiscal, Ley Nro. 5791/2013, se lo intima para que en el término de diez (10) días proceda a presentar las declaraciones juradas originales o rectificativas, e ingrese el impuesto omitido más los intereses a la fecha del efectivo pago.\n\nEn caso de no regularizar su situación fiscal, la Dirección podrá dar inicio a una verificación integral, perdiendo Ud. el beneficio del cumplimiento voluntario debiendo abonar además del tributo las sanciones previstas en los artículos 48° y 49º del Código Fiscal (Ley 5791/2013), sin perjuicio de dar inicio al procedimiento de determinación de oficio en los términos del artículo 37° del mencionado plexo normativo.\n\nPara dar cumplimiento a esta intimación podrá comunicarse con el Departamento Inteligencia Fiscal al siguiente correo electrónico: inteligenciafiscal@rentasjujuy.gob.ar o al Centro de Atención 0800-555-5599 en el horario de 07:30 a 12:30 o personalmente en Lavalle 55 - San Salvador de Jujuy - de Lunes a Viernes en el horario de 07:30 a 12:30.',
    cierre: 'Queda/n Ud/s. debidamente notificado/s.',
    piePlanilla: 'Queda/n Ud/s. debidamente notificado/s.',
    columnas: [
      { id: 'anio', value: 'AÑO', locked: true },
      { id: 'base-interna', value: 'Base Imponible Ingresos Brutos', locked: true },
      {
        id: 'base-terceros',
        value: 'Base Imponible Informada por Terceros (_)',
        locked: true
      },
      { id: 'diferencia-base', value: 'Diferencia de Base Imponible', locked: true },
      { id: 'fuente-info', value: 'Fuente de Información (_)', locked: true }
    ]
  },
  informe: {
    titulo: 'Informe de análisis'
  }
};

export function useDashboardConfiguration() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [successOpened, setSuccessOpened] = useState(false);
  const [columnPickerOpened, setColumnPickerOpened] = useState(false);
  const [selectedAvailableColumnId, setSelectedAvailableColumnId] = useState<string | null>(null);
  const [selectedVisibleColumnId, setSelectedVisibleColumnId] = useState<string | null>(null);
  const [columnPickerDraft, setColumnPickerDraft] = useState(
    DEFAULT_STATE.intimacion.columnas
  );

  const activeTab = state.activeTab;

  const updateIntimacion = useCallback(
    (field: keyof DashboardConfigurationState['intimacion'], value: string) => {
      setState((current) => ({
        ...current,
        intimacion: {
          ...current.intimacion,
          [field]: value
        }
      }));
    },
    []
  );

  const updateTab = useCallback((tab: DashboardConfigurationTab) => {
    setState((current) => ({
      ...current,
      activeTab: tab
    }));
  }, []);

  const openColumnPicker = useCallback(() => {
    setColumnPickerDraft(state.intimacion.columnas);
    setSelectedAvailableColumnId(null);
    setSelectedVisibleColumnId(null);
    setColumnPickerOpened(true);
  }, [state.intimacion.columnas]);

  const closeColumnPicker = useCallback(() => {
    setColumnPickerOpened(false);
    setColumnPickerDraft(state.intimacion.columnas);
    setSelectedAvailableColumnId(null);
    setSelectedVisibleColumnId(null);
  }, [state.intimacion.columnas]);

  const confirmColumnPicker = useCallback(() => {
    setState((current) => ({
      ...current,
      intimacion: {
        ...current.intimacion,
        columnas: columnPickerDraft
      }
    }));
    setColumnPickerOpened(false);
    setSelectedAvailableColumnId(null);
    setSelectedVisibleColumnId(null);
  }, [columnPickerDraft]);

  const selectAvailableColumn = useCallback((optionId: string) => {
    setSelectedAvailableColumnId(optionId);
    setSelectedVisibleColumnId(null);
  }, []);

  const selectVisibleColumn = useCallback((columnId: string) => {
    setSelectedVisibleColumnId(columnId);
    setSelectedAvailableColumnId(null);
  }, []);

  const addSelectedColumn = useCallback(() => {
    if (!selectedAvailableColumnId) {
      return;
    }

    const option = COLUMN_OPTIONS.find((item) => item.id === selectedAvailableColumnId);

    if (!option) {
      return;
    }

    setColumnPickerDraft((current) => {
      if (current.some((column) => column.id === option.id)) {
        return current;
      }

      return [
        ...current,
        {
          id: option.id,
          value: option.label,
          locked: option.locked
        }
      ];
    });
    setSelectedAvailableColumnId(null);
  }, [selectedAvailableColumnId]);

  const removeSelectedColumn = useCallback(() => {
    if (!selectedVisibleColumnId) {
      return;
    }

    setColumnPickerDraft((current) =>
      current.filter((column) => column.id !== selectedVisibleColumnId || column.locked)
    );
    setSelectedVisibleColumnId(null);
  }, [selectedVisibleColumnId]);

  const removeDraftColumn = useCallback((optionId: string) => {
    setColumnPickerDraft((current) =>
      current.filter((column) => column.id !== optionId || column.locked)
    );
  }, []);

  const updateColumn = useCallback((columnId: string, value: string) => {
    setState((current) => ({
      ...current,
      intimacion: {
        ...current.intimacion,
        columnas: current.intimacion.columnas.map((column) =>
          column.id === columnId ? { ...column, value } : column
        )
      }
    }));
  }, []);

  const removeColumn = useCallback((columnId: string) => {
    setState((current) => ({
      ...current,
      intimacion: {
        ...current.intimacion,
        columnas: current.intimacion.columnas.filter((column) => column.id !== columnId)
      }
    }));
  }, []);

  const openPdfPreview = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.open('', '_blank', 'noopener,noreferrer');
  }, []);

  const confirmChanges = useCallback(() => {
    setSuccessOpened(true);
  }, []);

  const closeSuccess = useCallback(() => {
    setSuccessOpened(false);
  }, []);

  const visibleColumns = useMemo(() => state.intimacion.columnas, [state.intimacion.columnas]);
  const availableColumns = useMemo(
    () => COLUMN_OPTIONS.filter((option) => !columnPickerDraft.some((column) => column.id === option.id)),
    [columnPickerDraft]
  );

  return {
    state,
    activeTab,
    columnPickerOpened,
    columnPickerDraft,
    selectedAvailableColumnId,
    selectedVisibleColumnId,
    availableColumns,
    visibleColumns,
    successOpened,
    updateTab,
    updateIntimacion,
    openColumnPicker,
    closeColumnPicker,
    confirmColumnPicker,
    selectAvailableColumn,
    selectVisibleColumn,
    addSelectedColumn,
    removeSelectedColumn,
    removeDraftColumn,
    updateColumn,
    removeColumn,
    openPdfPreview,
    confirmChanges,
    closeSuccess
  };
}
