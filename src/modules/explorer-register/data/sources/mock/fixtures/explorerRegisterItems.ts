import type {
  IExplorerRegisterCatalog,
  IExplorerRegisterRow
} from '../../../models/ExplorerRegister';

export const explorerRegisterCatalogFixture: IExplorerRegisterCatalog = {
  fixedColumns: [
    {
      code: 'cuit',
      name: 'CUIT',
      dataType: 'texto',
      fixed: true
    },
    {
      code: 'razonSocial',
      name: 'Razon social',
      dataType: 'texto',
      fixed: true
    }
  ],
  availableColumns: [
    {
      code: 'tipoContribuyente',
      name: 'Tipo contribuyente',
      dataType: 'texto',
      fixed: false
    },
    {
      code: 'actividad',
      name: 'Actividad',
      dataType: 'texto',
      fixed: false
    },
    {
      code: 'rubro',
      name: 'Rubro',
      dataType: 'texto',
      fixed: false
    },
    {
      code: 'domicilio',
      name: 'Domicilio',
      dataType: 'texto',
      fixed: false
    },
    {
      code: 'localidad',
      name: 'Localidad',
      dataType: 'texto',
      fixed: false
    },
    {
      code: 'provincia',
      name: 'Provincia',
      dataType: 'texto',
      fixed: false
    },
    {
      code: 'matrizRiesgo',
      name: 'Matriz de riesgo',
      dataType: 'texto',
      fixed: false
    },
    {
      code: 'sistemaControl',
      name: 'Sistema de control',
      dataType: 'texto',
      fixed: false
    },
    {
      code: 'mercurioRuta',
      name: 'Mercurio ruta',
      dataType: 'texto',
      fixed: false
    },
    {
      code: 'trufa',
      name: 'Trufa',
      dataType: 'texto',
      fixed: false
    },
    {
      code: 'agente',
      name: 'Agente',
      dataType: 'texto',
      fixed: false
    },
    {
      code: 'sujetoRetenido',
      name: 'Sujeto retenido',
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
      code: 'tipoContribuyente',
      name: 'Tipo contribuyente',
      inputType: 'multiseleccion',
      temporal: false,
      available: true,
      unavailableReason: null,
      allowedValues: ['LOCAL', 'CONVENIO', 'NO INSCRIPTO'],
      relatedColumns: ['tipoContribuyente'],
      valuesOrigin: 'fijo',
      dependencies: []
    },
    {
      code: 'actividad',
      name: 'Actividad',
      inputType: 'multiseleccion',
      temporal: false,
      available: true,
      unavailableReason: null,
      allowedValues: [],
      relatedColumns: ['actividad'],
      valuesOrigin: 'datos',
      dependencies: []
    },
    {
      code: 'rubro',
      name: 'Rubro',
      inputType: 'multiseleccion',
      temporal: false,
      available: true,
      unavailableReason: null,
      allowedValues: ['Gastronomia', 'Textil', 'Automotor', 'Construccion', 'Tecnologia'],
      relatedColumns: ['rubro'],
      valuesOrigin: 'fijo',
      dependencies: []
    },
    {
      code: 'domicilio',
      name: 'Domicilio',
      inputType: 'texto',
      temporal: false,
      available: true,
      unavailableReason: null,
      allowedValues: [],
      relatedColumns: ['domicilio'],
      valuesOrigin: 'libre',
      dependencies: []
    },
    {
      code: 'localidad',
      name: 'Localidad',
      inputType: 'multiseleccion',
      temporal: false,
      available: true,
      unavailableReason: null,
      allowedValues: [],
      relatedColumns: ['localidad'],
      valuesOrigin: 'datos',
      dependencies: []
    },
    {
      code: 'provincia',
      name: 'Provincia',
      inputType: 'multiseleccion',
      temporal: false,
      available: true,
      unavailableReason: null,
      allowedValues: [],
      relatedColumns: ['provincia'],
      valuesOrigin: 'datos',
      dependencies: []
    },
    {
      code: 'matrizRiesgo',
      name: 'Matriz de riesgo',
      inputType: 'multiseleccion',
      temporal: false,
      available: true,
      unavailableReason: null,
      allowedValues: ['A', 'B', 'C', 'D'],
      relatedColumns: ['matrizRiesgo'],
      valuesOrigin: 'fijo',
      dependencies: []
    },
    {
      code: 'sistemaControl',
      name: 'Sistema de control',
      inputType: 'multiseleccion',
      temporal: false,
      available: true,
      unavailableReason: null,
      allowedValues: [
        'CONVENIO MULTILATERAL',
        'SITI',
        'SIR',
        'NO CATEGORIZADO'
      ],
      relatedColumns: ['sistemaControl'],
      valuesOrigin: 'fijo',
      dependencies: []
    },
    {
      code: 'mercurioRuta',
      name: 'Mercurio ruta',
      inputType: 'multiseleccion',
      temporal: true,
      available: true,
      unavailableReason: null,
      allowedValues: ['REMITENTE', 'DESTINATARIO', 'TRANSPORTISTA'],
      relatedColumns: ['mercurioRuta'],
      valuesOrigin: 'fijo',
      dependencies: []
    },
    {
      code: 'trufa',
      name: 'Trufa',
      inputType: 'multiseleccion',
      temporal: true,
      available: true,
      unavailableReason: null,
      allowedValues: [],
      relatedColumns: ['trufa'],
      valuesOrigin: 'datos',
      dependencies: []
    },
    {
      code: 'agente',
      name: 'Agente',
      inputType: 'multiseleccion',
      temporal: true,
      available: true,
      unavailableReason: null,
      allowedValues: [],
      relatedColumns: ['agente'],
      valuesOrigin: 'datos',
      dependencies: []
    },
    {
      code: 'sujetoRetenido',
      name: 'Sujeto retenido',
      inputType: 'switch',
      temporal: true,
      available: true,
      unavailableReason: null,
      allowedValues: ['SI'],
      relatedColumns: ['sujetoRetenido'],
      valuesOrigin: 'fijo',
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

export const explorerRegisterRowsFixture: IExplorerRegisterRow[] = [
  {
    cuit: '30504018845',
    businessName: 'VOLKSWAGEN ARGENTINA S.A.',
    values: {
      tipoContribuyente: 'CONVENIO',
      rubro: 'Automotor',
      actividad: 'Fabricacion de vehiculos',
      domicilio: 'Av. Industrial 1240',
      localidad: 'Palpala',
      provincia: 'Jujuy',
      matrizRiesgo: 'A',
      sistemaControl: 'CONVENIO MULTILATERAL',
      mercurioRuta: 'REMITENTE',
      trufa: 'Operativo 2025',
      agente: 'Percepcion',
      sujetoRetenido: null,
      controlInteligenciaFiscal: 2
    }
  },
  {
    cuit: '30501685212',
    businessName: 'CERAMICA DEL NORTE S.A.',
    values: {
      tipoContribuyente: 'LOCAL',
      rubro: 'Construccion',
      actividad: 'Fabricacion de materiales ceramicos',
      domicilio: 'Ruta 66 Km 4',
      localidad: 'Perico',
      provincia: 'Jujuy',
      matrizRiesgo: 'B',
      sistemaControl: 'SITI',
      mercurioRuta: 'DESTINATARIO',
      trufa: 'Operativo 2024',
      agente: 'Retencion',
      sujetoRetenido: 'SI',
      controlInteligenciaFiscal: null
    }
  },
  {
    cuit: '20284567894',
    businessName: 'COMERCIAL PUNA NORTE S.R.L.',
    values: {
      tipoContribuyente: 'CONVENIO',
      rubro: 'Tecnologia',
      actividad: 'Venta de equipamiento informatico',
      domicilio: 'Belgrano 550',
      localidad: 'San Salvador de Jujuy',
      provincia: 'Jujuy',
      matrizRiesgo: 'C',
      sistemaControl: 'NO CATEGORIZADO',
      mercurioRuta: 'TRANSPORTISTA',
      trufa: null,
      agente: 'Percepcion',
      sujetoRetenido: null,
      controlInteligenciaFiscal: 1
    }
  },
  {
    cuit: '27321786543',
    businessName: 'SABORES DE LA QUEBRADA S.A.',
    values: {
      tipoContribuyente: 'LOCAL',
      rubro: 'Gastronomia',
      actividad: 'Servicios de restaurante',
      domicilio: 'Lavalle 88',
      localidad: 'Tilcara',
      provincia: 'Jujuy',
      matrizRiesgo: 'B',
      sistemaControl: 'SIR',
      mercurioRuta: null,
      trufa: 'Operativo 2024',
      agente: 'Retencion',
      sujetoRetenido: 'SI',
      controlInteligenciaFiscal: null
    }
  },
  {
    cuit: '30707123456',
    businessName: 'TEXTIL NORTE S.A.',
    values: {
      tipoContribuyente: 'NO INSCRIPTO',
      rubro: 'Textil',
      actividad: 'Fabricacion de prendas',
      domicilio: 'Parque Industrial Lote 8',
      localidad: 'Palpala',
      provincia: 'Jujuy',
      matrizRiesgo: 'D',
      sistemaControl: 'NO CATEGORIZADO',
      mercurioRuta: null,
      trufa: 'Operativo 2025',
      agente: null,
      sujetoRetenido: null,
      controlInteligenciaFiscal: null
    }
  }
];
