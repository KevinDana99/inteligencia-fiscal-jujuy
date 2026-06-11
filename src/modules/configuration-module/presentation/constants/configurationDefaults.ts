import type {
  ConfigurationType,
  IntimationType,
  ReportType
} from '../../data/models/Configuration'

export const DEFAULT_INTIMATION: IntimationType = {
  id: null,
  asunto: 'PRESUNTA DIFERENCIA DE BASE IMPONIBLE',
  saludo: 'Señor Contribuyente:',
  cuerpo:
    'Por medio de la presente, la Dirección Provincial de Rentas de Jujuy pone en su conocimiento que sobre la base de información cierta, derivada del cruce de bases de datos con el organismo recaudador nacional (ARCA) y los agentes de recaudación designados por este organismo, se han detectado inconsistencias en sus declaraciones juradas y en el cumplimiento de sus obligaciones fiscales en los periodos que se detallan en planilla adjunta.\n\nPor ello, y en uso de las facultades conferidas a este organismo por el art. 10º inc. 3 del Código Fiscal, Ley Nro. 5791/2013, se lo intima para que en el término de diez (10) días proceda a presentar las declaraciones juradas originales o rectificativas, e ingrese el impuesto omitido más los intereses a la fecha del efectivo pago.\n\nEn caso de no regularizar su situación fiscal, la Dirección podrá dar inicio a una verificación integral, perdiendo Ud. el beneficio del cumplimiento voluntario debiendo abonar además del tributo las sanciones previstas en los artículos 48° y 49º del Código Fiscal (Ley 5791/2013), sin perjuicio de dar inicio al procedimiento de determinación de oficio en los términos del artículo 37° del mencionado plexo normativo.\n\nPara dar cumplimiento a esta intimación podrá comunicarse con el Departamento Inteligencia Fiscal al siguiente correo electrónico: inteligenciafiscal@rentasjujuy.gob.ar o al Centro de Atención 0800-555-5599 en el horario de 07:30 a 12:30 o personalmente en Lavalle 55 - San Salvador de Jujuy - de Lunes a Viernes en el horario de 07:30 a 12:30.',
  fuente_informacion: '',
  pie: 'Fecha de corte 11/2025.',
  columnas_seleccionadas: [
    'anio',
    'baseImponibleIngresosBrutos',
    'baseImponibleInformadaPorTerceros',
    'diferenciaBaseImponible'
  ]
}

export const DEFAULT_REPORT: ReportType = {
  id: null,
  titulo: 'INFORME DE INVESTIGACIÓN',
  cuerpo:
    'Se eleva para su conocimiento y consideración, informe sobre la situación fiscal del contribuyente abajo descripto, solicitando el cargo al Dpto. Inspecciones y Verificaciones, conforme a los fundamentos, datos y periodos fiscales que se indican a continuación:'
}

export const DEFAULT_CONFIGURATION: ConfigurationType = {
  intimacion: DEFAULT_INTIMATION,
  informe: DEFAULT_REPORT
}
