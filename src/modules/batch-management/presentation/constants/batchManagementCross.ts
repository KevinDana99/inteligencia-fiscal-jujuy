import type { SelectProps } from "@mantine/core";

export const MONTHLY_BATCH_CROSS_OPTIONS: string[] = [];

export const ANNUAL_BATCH_CROSS_OPTIONS = [
  "Control de desvio de BI - Regimen CM",
] as const;

export const BATCH_CROSS_MONTH_OPTIONS = [
  { value: "01", label: "Ene" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Abr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Ago" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dic" },
] as const;

export const BATCH_CROSS_OPTIONS_BY_LABEL = {
  "cruce-bi-papel": {
    publicCode: "cruce-bi-papel",
    version: "1.0.0",
    parameters: {
      jurisdiccion: "910",
      umbralAnalisisDeudaTotal: "1",
      jurisdiccionesExcluidasTotalIngresos: "923",
    },
  },
  "Control de desvio de BI - Regimen Gral": {
    legacyCode: "CONTROL_DESVIO_BI_REGIMEN_GRAL",
  },
  "Control de desvio de BI - Regimen CM": {
    legacyCode: "CONTROL_DESVIO_BI_REGIMEN_CM",
    publicCode: "desvio-bi-convenio-multilateral",
    version: "1.0.0",
    parameters: {
      jurisdiccion: "910",
      jurisdiccionesExcluidasTotalIngresos: "923",
    },
  },
  "Control de BI declarada por actividad": {
    legacyCode: "CONTROL_BI_DECLARADA_POR_ACTIVIDAD",
  },
  "Control de creditos": {
    legacyCode: "CONTROL_CREDITOS",
  },
  "Control de SAF": {
    legacyCode: "CONTROL_SAF",
  },
  "Control de Agentes": {
    legacyCode: "CONTROL_AGENTES",
  },
  "Deteccion de no inscriptos": {
    legacyCode: "DETECCION_CONTRIBUYENTES_NO_INSCRIPTOS",
  },
  "Comparacion de Bases Presuntivas": {
    legacyCode: "COMPARACION_BASES_PRESUNTIVAS",
  },
  "Contribuyentes con más de dos inmuebles": {
    legacyCode: "CONTRIBUYENTES_MAS_DOS_INMUEBLES",
  },
} as const;

export const BATCH_CROSS_SELECT_COMBOBOX_PROPS = {
  withinPortal: false,
  zIndex: 10001,
  width: "target",
  offset: 4,
  position: "bottom-start",
  middlewares: {
    flip: false,
    shift: true,
  },
} satisfies NonNullable<SelectProps["comboboxProps"]>;

export const EMPTY_EXECUTABLE_CROSS_MESSAGE =
  "No hay cruces disponibles para ejecutar.";
