import type { InformeFiscalActionField } from './informeGeneration';

export const INFORME_FISCAL_ACTION_FIELDS: Array<{
  field: InformeFiscalActionField;
  label: string;
  placeholder?: string;
}> = [
  {
    field: 'origenPedido',
    label: 'Origen del Pedido'
  },
  {
    field: 'impuestosAVerificar',
    label: 'Impuesto/s a Verificar'
  },
  {
    field: 'periodo',
    label: 'Periodos',
    placeholder: 'Ej: 01/2025 a 03/2026'
  },
  {
    field: 'origenOI',
    label: 'Origen de la O.I.',
    placeholder: 'Ej: DIV. INVESTIGACIONES'
  },
  {
    field: 'programa',
    label: 'Programa',
    placeholder: 'Ej: CRUCE DE B.I.'
  },
  {
    field: 'tipoInstruccion',
    label: 'Tipo de Instrucción',
    placeholder: 'Ej: INTEGRAL'
  },
  {
    field: 'impuestoNeto',
    label: 'Impuesto Neto',
    placeholder: 'Ej: $ 11.768.706'
  }
];
