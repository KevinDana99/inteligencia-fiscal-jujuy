import type {
  IUnifiedRegisterDetail,
  IUnifiedRegisterItems
} from '../../../models/UnifiedRegister';

export const unifiedRegisterItemsFixture: IUnifiedRegisterItems = [
  {
    contribuyenteId: '62495ad7-e17d-4edc-9400-5fef2d2a1012',
    cuit: '30-50401884-5',
    businessName: 'VOLKSWAGEN ARGENTINA S.A.',
    activity: 'Fabricación de vehículos automotores',
    regime: 'Convenio Multilateral',
    status: 'Activo',
    riskLevel: 'A'
  },
  {
    contribuyenteId: '9651b151-a51e-4ac9-914a-854230fbaa0a',
    cuit: '30501685212',
    businessName: 'CERAMICA DEL NORTE S.A.',
    activity: 'Fabricacion de materiales ceramicos',
    regime: 'Convenio Multilateral',
    status: 'Activo',
    riskLevel: 'A'
  },
  {
    contribuyenteId: '94f4d83f-c0f0-4478-afd2-511ff0a6051b',
    cuit: '30-70712345-6',
    businessName: 'DISTRIBUIDORA NORTE ANDINO S.A.',
    activity: 'Comercio mayorista de alimentos',
    regime: 'Régimen General',
    status: 'Activo',
    riskLevel: 'B'
  },
  {
    contribuyenteId: '96ea57a4-4ab0-4ce2-b14c-29dd75d89c8f',
    cuit: '20-28456789-4',
    businessName: 'COMERCIAL PUNA NORTE S.R.L.',
    activity: 'Venta minorista de artículos regionales',
    regime: 'Convenio Multilateral',
    status: 'Activo',
    riskLevel: 'B'
  },
  {
    contribuyenteId: 'ed3cb5ff-7398-4ff8-b8c7-af5111c1ca78',
    cuit: '30-61234567-2',
    businessName: 'TRANSPORTES QUEBRADA ALTA S.A.',
    activity: 'Transporte de cargas generales',
    regime: 'Convenio Multilateral',
    status: 'Activo',
    riskLevel: 'A'
  },
  {
    contribuyenteId: '24eaef63-c447-4f17-ab6e-f554dad883ad',
    cuit: '27-32178654-3',
    businessName: 'MINERA ALTIPLANO JUJUY S.A.',
    activity: 'Servicios vinculados a minería',
    regime: 'Régimen General',
    status: 'Inactivo',
    riskLevel: 'C'
  },
  {
    contribuyenteId: '06b815b5-b68b-41b9-be4c-10a7cb566c01',
    cuit: '30-12345678-1',
    businessName: 'Test Business',
    activity: 'Test Activity',
    regime: 'Régimen General',
    status: 'Activo',
    riskLevel: 'B'
  }
];

function buildDefaultDetail(item: (typeof unifiedRegisterItemsFixture)[number]): IUnifiedRegisterDetail {
  const alternateAddressIdByContribuyenteId: Record<string, string> = {
    '62495ad7-e17d-4edc-9400-5fef2d2a1012': 'd9d4eb81-52bf-4ea8-8d22-25a3be161d40',
    '9651b151-a51e-4ac9-914a-854230fbaa0a': '49a1e806-2554-4d88-9d08-4ea2c7ac7758',
    '94f4d83f-c0f0-4478-afd2-511ff0a6051b': '71fb3981-3e16-4225-a96a-77ab6208443a',
    '96ea57a4-4ab0-4ce2-b14c-29dd75d89c8f': 'bfd7bb93-c8e1-4fcb-8bab-c207f1dfc70f',
    'ed3cb5ff-7398-4ff8-b8c7-af5111c1ca78': '697cd36d-dc4d-48f4-ae5f-eac993bd3191',
    '24eaef63-c447-4f17-ab6e-f554dad883ad': '8ebef6ea-4919-4135-b7ba-03e4576b20e9'
  };

  const detail: IUnifiedRegisterDetail = {
    ...item,
    startedAt: '01/06/2005',
    jurisdiction: 'Jujuy (J.910)',
    headquartersJurisdiction: '902',
    strangeJurisdictions: '903, 904, 905, 906',
    fiscalAddress: 'Av. San Martín 1234, S.S. de Jujuy',
    commercialAddress: 'Ruta Nac. 9 km 12, Palpalá',
    alternateAddress: 'Belgrano 890, S.S. de Jujuy',
    controlLotsLabel: '3 lotes',
    secondaryActivity: 'Venta mayorista',
    widgets: [
      {
        id: 'declared-bi',
        label: 'BI Declarada',
        value: '$16.879 M',
        tone: 'blue',
        badgeLabel: 'Convenio multilateral'
      },
      {
        id: 'declared-taxes',
        label: 'Impuestos declarados',
        value: '$253.194 K',
        tone: 'blue',
        subtitle: 'Últimos 12 meses'
      },
      {
        id: 'debt',
        label: 'Deuda',
        value: '$38.450 K',
        tone: 'red',
        subtitle: 'Últimos 12 meses'
      },
      {
        id: 'returns',
        label: 'Declaraciones juradas',
        value: '',
        tone: 'green',
        splitValue: {
          primaryValue: '10',
          primaryLabel: 'Presentadas',
          secondaryValue: '2',
          secondaryLabel: 'No presentadas'
        }
      }
    ],
    activities: [
      {
        id: 'primary',
        type: 'Primaria',
        label: item.activity,
        tag: 'Principal',
        tagTone: 'blue'
      },
      {
        id: 'secondary',
        type: 'Secundaria',
        label: 'Venta al por mayor de vehículos y repuestos',
        tag: 'Secundaria',
        tagTone: 'violet'
      }
    ],
    fines: [
      {
        id: 'MER-001',
        issuedAt: '12/03/2025',
        type: 'Destinatario',
        description: 'Exceso de carga — Ruta 9 km 34',
        amount: '$180.000',
        status: 'ANULADO'
      },
      {
        id: 'MER-002',
        issuedAt: '08/09/2024',
        type: 'Remitente',
        description: 'Documentación incompleta — Ruta 9',
        amount: '$95.000',
        status: 'ANULADO'
      },
      {
        id: 'MER-003',
        issuedAt: '15/04/2024',
        type: 'Destinatario',
        description: 'Mercadería sin remito — Ruta 34',
        amount: '$220.000',
        status: 'ACTIVO'
      }
    ],
    interventionOrders: [
      {
        id: 'OI-2025-0341',
        origin: 'Cruce SIF',
        instruction: 'Desvío de BI — Régimen CM',
        period: '2023 — 2024',
        debt: '$253.194.844',
        declaredBi: '$1.840.000.000',
        reason: 'Desvío de BI — Régimen CM',
        amount: '$253.194.844',
        status: 'En curso'
      },
      {
        id: 'OI-2022-0187',
        origin: 'Manual',
        instruction: 'Control de créditos — Local',
        period: '2020 — 2021',
        debt: '$38.450.000',
        declaredBi: '$320.000.000',
        reason: 'Control de créditos — Local',
        amount: '$38.450.000',
        status: 'Cerrada'
      }
    ],
    taxes: [
      {
        id: 'TAX-001',
        name: 'Ingresos Brutos',
        period: '04/2026',
        amount: '$18.420.113',
        status: 'Presentado'
      },
      {
        id: 'TAX-002',
        name: 'Sellos',
        period: '03/2026',
        amount: '$3.120.000',
        status: 'Presentado'
      },
      {
        id: 'TAX-003',
        name: 'Percepciones',
        period: '04/2026',
        amount: '$1.280.440',
        status: 'Pendiente'
      }
    ],
    addresses: [
      {
        id: alternateAddressIdByContribuyenteId[item.contribuyenteId],
        label: 'Alternativo',
        address: 'Belgrano 890, S.S. de Jujuy'
      }
    ],
    contacts: [
      { id: 'phone', label: 'Teléfono', value: '+54 388 422-0000' },
      { id: 'mail', label: 'Mail', value: 'impuestos@vw-arg.com' },
      { id: 'legal', label: 'Representante legal', value: 'Carlos Méndez' },
      { id: 'accountant', label: 'Contador', value: 'Estudio García & Asoc.' }
    ],
    notes: [
      {
        id: 'note-1',
        text: 'Pendiente de respuesta de intimación.',
        createdAt: '24/04/2026'
      },
      {
        id: 'note-2',
        text: 'Revisar cruce de bases presuntivas en próxima iteración.',
        createdAt: '19/04/2026'
      }
    ],
    sourceTables: [
      {
        id: 'iibb',
        label: 'Ingresos Brutos',
        columns: ['Período', 'BI Declarada', 'Ingresos', 'Egresos', 'Actualización', 'Calidad', 'Estado'],
        rows: [
          ['2026-01', '$95.000.000', '$95.000.000', '$71.000.000', '10/02/2026', 'Alta', '✓ Validado'],
          ['2026-02', '$101.000.000', '$101.000.000', '$73.000.000', '09/03/2026', 'Media', '✓ Validado'],
          ['2026-03', '$108.000.000', '$108.000.000', '$74.000.000', '10/04/2026', 'Alta', '✓ Validado']
        ]
      },
      {
        id: 'arca',
        label: 'ARCA',
        columns: ['Período', 'Facturación ARCA', 'BI declarada IIBB', 'Diferencia', 'Actualización', 'Estado'],
        rows: [
          ['2026-01', '$138.000.000', '$95.000.000', '+$43.000.000', '11/02/2026', 'Diferencia'],
          ['2026-02', '$151.000.000', '$101.000.000', '+$50.000.000', '11/03/2026', 'Diferencia'],
          ['2026-03', '$162.000.000', '$108.000.000', '+$54.000.000', '11/04/2026', 'Diferencia']
        ]
      },
      {
        id: 'cm',
        label: 'Convenio Multilateral',
        columns: ['Período', 'Jurisdicción', 'BI Declarada CM03', 'Coef. Unificado', 'Tot. Ingresos País', 'Estado'],
        rows: [
          ['2026-01', 'Jujuy (J.910)', '$16.879.656.323', '0.4800%', '$2.927.995.069.414', 'Desvío'],
          ['2025-12', 'Jujuy (J.910)', '$15.200.000.000', '0.4750%', '$2.800.000.000.000', 'Revisar'],
          ['2025-06', 'Jujuy (J.910)', '$12.100.000.000', '0.4600%', '$2.630.000.000.000', '✓ OK']
        ]
      },
      {
        id: 'ret',
        label: 'Retenciones',
        columns: ['Período', 'Agente', 'Monto retenido', 'Declarado por contribuyente', 'Diferencia', 'Estado'],
        rows: [
          ['2026-01', 'ARCOR S.A.', '$1.240.000', '$1.240.000', '$0', '✓ OK'],
          ['2026-01', 'CARREFOUR ARG.', '$2.890.000', '$2.450.000', '+$440.000', 'Diferencia'],
          ['2026-02', 'WALMART ARG.', '$1.890.000', '$1.890.000', '$0', '✓ OK']
        ]
      },
      {
        id: 'perc',
        label: 'Percepciones',
        columns: ['Período', 'Agente', 'Monto percibido', 'Base de percepción', 'Alícuota', 'Estado'],
        rows: [
          ['2026-01', 'DGR Jujuy', '$3.120.000', '$208.000.000', '1.50%', '✓ OK'],
          ['2026-02', 'DGR Jujuy', '$3.450.000', '$230.000.000', '1.50%', '✓ OK'],
          ['2026-03', 'DGR Jujuy', '$3.780.000', '$252.000.000', '1.50%', '✓ OK']
        ]
      },
      {
        id: 'inm',
        label: 'Inmuebles',
        columns: ['Partida', 'Domicilio', 'Categoría', 'Valuación fiscal', 'Impuesto anual', 'Estado'],
        rows: [
          ['12-345-678', 'Av. San Martín 1234', 'Comercial', '$45.000.000', '$1.350.000', 'Al día'],
          ['12-345-679', 'Ruta Nac. 9 km 12', 'Industrial', '$120.000.000', '$3.600.000', 'Al día'],
          ['12-345-680', 'Calle Belgrano 890', 'Comercial', '$32.000.000', '$960.000', 'Deuda parcial']
        ]
      },
      {
        id: 'mer',
        label: 'Mercurio',
        columns: ['Período', 'Concepto', 'Monto', 'Vencimiento', 'Estado'],
        rows: [
          ['2026-01', 'Anticipo IIBB', '$4.200.000', '15/02/2026', 'Pagado'],
          ['2026-02', 'Anticipo IIBB', '$4.500.000', '15/03/2026', 'Pagado'],
          ['2026-03', 'Anticipo IIBB', '$4.800.000', '15/04/2026', 'Pendiente']
        ]
      }
    ],
    lotOptions: [
      {
        id: 'lot-622',
        label: 'ANOVA-622',
        regime: 'Convenio Multilateral',
        cuitCount: 47
      },
      {
        id: 'lot-589',
        label: 'TRUFA-589',
        regime: 'Convenio Multilateral',
        cuitCount: 83
      },
      {
        id: 'lot-541',
        label: 'GC-2023',
        regime: 'Régimen Local',
        cuitCount: 31
      }
    ]
  };

  if (item.contribuyenteId !== '9651b151-a51e-4ac9-914a-854230fbaa0a') {
    return detail;
  }

  return {
    ...detail,
    startedAt: '10/02/2012',
    jurisdiction: 'Jujuy (J.910)',
    headquartersJurisdiction: '902',
    strangeJurisdictions: '903, 904, 905, 906',
    fiscalAddress: 'Ruta 66 Km 4, Perico, Jujuy',
    commercialAddress: 'Ruta 66 Km 4, Parque Industrial Perico',
    alternateAddress: 'San Martin 420, Perico',
    controlLotsLabel: '2 lotes',
    secondaryActivity: 'Comercio mayorista de materiales para construccion',
    widgets: [
      {
        id: 'declared-bi',
        label: 'BI Declarada',
        value: '$8.420 M',
        tone: 'blue',
        badgeLabel: 'Convenio multilateral'
      },
      {
        id: 'declared-taxes',
        label: 'Impuestos declarados',
        value: '$126.380 K',
        tone: 'blue',
        subtitle: 'Ultimos 12 meses'
      },
      {
        id: 'debt',
        label: 'Deuda',
        value: '$14.800 K',
        tone: 'red',
        subtitle: 'Ultimos 12 meses'
      },
      {
        id: 'returns',
        label: 'Declaraciones juradas',
        value: '',
        tone: 'green',
        splitValue: {
          primaryValue: '11',
          primaryLabel: 'Presentadas',
          secondaryValue: '1',
          secondaryLabel: 'No presentadas'
        }
      }
    ],
    activities: [
      {
        id: 'primary',
        type: 'Primaria',
        label: item.activity,
        tag: 'Principal',
        tagTone: 'blue'
      },
      {
        id: 'secondary',
        type: 'Secundaria',
        label: 'Comercio mayorista de materiales para construccion',
        tag: 'Secundaria',
        tagTone: 'violet'
      }
    ],
    fines: [
      {
        id: 'MER-2026-014',
        issuedAt: '18/04/2026',
        type: 'Destinatario',
        description: 'Mercaderia con documentacion incompleta',
        amount: '$140.000',
        status: 'ACTIVO'
      },
      {
        id: 'MER-2025-221',
        issuedAt: '03/11/2025',
        type: 'Remitente',
        description: 'Diferencia en remito de transporte',
        amount: '$85.000',
        status: 'ANULADO'
      },
      {
        id: 'MER-2025-118',
        issuedAt: '12/06/2025',
        type: 'Destinatario',
        description: 'Control de ruta regularizado',
        amount: '$52.000',
        status: 'ANULADO'
      }
    ],
    interventionOrders: [
      {
        id: 'OI-2026-0098',
        origin: 'Cruce SIF',
        instruction: 'Cruce ARCA contra BI declarada',
        period: '2024 - 2025',
        debt: '$126.380.000',
        declaredBi: '$910.000.000',
        reason: 'Cruce ARCA contra BI declarada',
        amount: '$126.380.000',
        status: 'En curso'
      },
      {
        id: 'OI-2023-0412',
        origin: 'Manual',
        instruction: 'Control de actividad industrial',
        period: '2022 - 2023',
        debt: '$14.800.000',
        declaredBi: '$180.000.000',
        reason: 'Control de actividad industrial',
        amount: '$14.800.000',
        status: 'Cerrada'
      }
    ],
    addresses: [
      {
        id: alternateAddressIdByContribuyenteId[item.contribuyenteId],
        label: 'Alternativo',
        address: 'San Martin 420, Perico'
      }
    ],
    contacts: [
      { id: 'phone', label: 'Telefono', value: '+54 388 491-2040' },
      { id: 'mail', label: 'Mail', value: 'administracion@ceramicanorte.com.ar' },
      { id: 'legal', label: 'Representante legal', value: 'Laura Benitez' },
      { id: 'accountant', label: 'Contador', value: 'Estudio Salvatierra' }
    ],
    notes: [
      {
        id: 'note-1',
        text: 'Pendiente validar diferencia de base imponible declarada.',
        createdAt: '28/05/2026'
      },
      {
        id: 'note-2',
        text: 'Contribuyente incorporado al lote de control por riesgo A.',
        createdAt: '20/05/2026'
      }
    ],
    sourceTables: detail.sourceTables.map((table) => {
      if (table.id === 'iibb') {
        return {
          ...table,
          rows: [
            ['2026-01', '$43.000.000', '$43.000.000', '$31.000.000', '10/02/2026', 'Alta', '✓ Validado'],
            ['2026-02', '$47.500.000', '$47.500.000', '$34.000.000', '09/03/2026', 'Alta', '✓ Validado'],
            ['2026-03', '$52.000.000', '$52.000.000', '$36.000.000', '10/04/2026', 'Media', 'Revisar']
          ]
        };
      }

      if (table.id === 'arca') {
        return {
          ...table,
          rows: [
            ['2026-01', '$58.000.000', '$43.000.000', '+$15.000.000', '11/02/2026', 'Diferencia'],
            ['2026-02', '$63.000.000', '$47.500.000', '+$15.500.000', '11/03/2026', 'Diferencia'],
            ['2026-03', '$69.000.000', '$52.000.000', '+$17.000.000', '11/04/2026', 'Diferencia']
          ]
        };
      }

      return table;
    })
  };
}

export const unifiedRegisterDetailsFixture: IUnifiedRegisterDetail[] =
  unifiedRegisterItemsFixture.map((item) => buildDefaultDetail(item));
