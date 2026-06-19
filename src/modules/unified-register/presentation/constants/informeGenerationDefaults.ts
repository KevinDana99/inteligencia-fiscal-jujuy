import type { InformeGenerationForm } from './informeGenerationTypes';

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

export const INFORME_INTRO_TEXT =
  'Se eleva para su conocimiento y consideración, informe sobre la situación fiscal del contribuyente abajo descripto, solicitando el cargo al Dpto. Inspecciones y Verificaciones, conforme a los fundamentos, datos y periodos fiscales que se indican a continuación:';
