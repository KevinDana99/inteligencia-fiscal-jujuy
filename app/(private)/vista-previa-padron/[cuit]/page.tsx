import { notFound } from 'next/navigation';
import {
  getAlternateAddressesAction,
  getContactsAction,
  getNotesAction,
  getUnifiedRegisterHeaderAction,
  getUnifiedRegisterInterventionOrdersAction,
  getUnifiedRegisterListAction,
  getUnifiedRegisterMercurioAction
} from '@/modules/unified-register/data/actions';
import { mapAlternateAddressRecordToViewModel } from '@/modules/unified-register/data/mappers/mapAlternateAddress';
import { mapContactRecordToViewModel } from '@/modules/unified-register/data/mappers/mapContact';
import { mapNoteRecordToViewModel } from '@/modules/unified-register/data/mappers/mapNote';
import type { IUnifiedRegisterDetail } from '@/modules/unified-register/data/models/UnifiedRegister';
import { UnifiedRegisterPreviewPage } from '@/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage';
import { unifiedRegisterDetailsFixture } from '@/modules/unified-register/data/sources/mock/fixtures/unifiedRegisterItems';

const unifiedRegisterDetailTemplate = unifiedRegisterDetailsFixture[0];
const CONTRIBUTOR_LOOKUP_PAGE_SIZE = 50;

function normalizeCuit(value: string) {
  return value.replace(/\D/g, '');
}

function isSameCuit(candidate: string, target: string) {
  const normalizedCandidate = normalizeCuit(candidate);
  const normalizedTarget = normalizeCuit(target);

  return candidate === target || normalizedCandidate === normalizedTarget;
}

async function findContribuyenteIdByCuit(cuit: string) {
  const firstPageResult = await getUnifiedRegisterListAction(
    1,
    CONTRIBUTOR_LOOKUP_PAGE_SIZE
  );
  const firstPage = firstPageResult.data;

  if (!firstPage) {
    return null;
  }

  const firstPageMatch = firstPage.contribuyentes.find((entry) =>
    isSameCuit(entry.cuit, cuit)
  );

  if (firstPageMatch) {
    return firstPageMatch.contribuyenteId;
  }

  for (let page = 2; page <= firstPage.totalPaginas; page += 1) {
    const pageResult = await getUnifiedRegisterListAction(
      page,
      CONTRIBUTOR_LOOKUP_PAGE_SIZE
    );
    const pageData = pageResult.data;

    if (!pageData) {
      continue;
    }

    const match = pageData.contribuyentes.find((entry) =>
      isSameCuit(entry.cuit, cuit)
    );

    if (match) {
      return match.contribuyenteId;
    }
  }

  return null;
}

function buildUnifiedRegisterDetailFallback(
  contribuyenteId: string,
  cuit: string
): IUnifiedRegisterDetail {
  return {
    ...unifiedRegisterDetailTemplate,
    contribuyenteId,
    cuit
  };
}

export default async function UnifiedRegisterPreviewRoute({
  params,
  searchParams
}: {
  params: Promise<{ cuit: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { cuit } = await params;
  const { id } = await searchParams;
  const decodedCuit = decodeURIComponent(cuit);
  const fixtureItem = unifiedRegisterDetailsFixture.find((entry) =>
    id ? entry.contribuyenteId === id : isSameCuit(entry.cuit, decodedCuit)
  );
  const contribuyenteId =
    id ??
    fixtureItem?.contribuyenteId ??
    (await findContribuyenteIdByCuit(decodedCuit));

  if (!contribuyenteId) {
    notFound();
  }

  const headerResult = await getUnifiedRegisterHeaderAction(contribuyenteId);

  if (!fixtureItem && !headerResult.data) {
    notFound();
  }

  const item =
    fixtureItem ?? buildUnifiedRegisterDetailFallback(contribuyenteId, decodedCuit);
  const alternateAddressesResult = await getAlternateAddressesAction(contribuyenteId);
  const notesResult = await getNotesAction(contribuyenteId, {
    pagina: 1,
    itemsPagina: 1
  });
  const contactsResult = await getContactsAction(contribuyenteId, {
    pagina: 1,
    itemsPagina: 1
  });
  const mercurioResult = await getUnifiedRegisterMercurioAction(contribuyenteId, {
    pagina: 1,
    itemsPagina: 3
  });
  const interventionOrdersResult = await getUnifiedRegisterInterventionOrdersAction(
    contribuyenteId,
    {
      pagina: 1,
      itemsPagina: 3
    }
  );

  const header = headerResult.data;
  const resolvedItem = {
    ...item,
    cuit: header?.cuit ?? item.cuit,
    businessName: header?.razonSocial ?? item.businessName,
    status: header ? (header.activo ? 'Activo' : 'Inactivo') : item.status,
    regime: header?.tipoContribuyente ?? item.regime,
    activity: header?.actividadPrimaria.nombre ?? item.activity,
    riskLevel: header?.riesgo ?? item.riskLevel,
    startedAt: header?.inicioActividad ?? item.startedAt,
    fiscalAddress: header?.domicilios.fiscal ?? item.fiscalAddress,
    commercialAddress: header?.domicilios.comercial ?? item.commercialAddress,
    alternateAddress:
      header?.domicilios.alternativo[0]?.nombre ?? item.alternateAddress,
    controlLotsLabel: header ? `${header.cantidadLotes} lotes` : item.controlLotsLabel,
    secondaryActivity:
      header?.actividadSecundaria.nombre ?? item.secondaryActivity,
    widgets: header
      ? item.widgets.map((widget) => {
          if (widget.id === 'declared-bi') {
            return { ...widget, value: header.biDeclarada };
          }

          if (widget.id === 'declared-taxes') {
            return { ...widget, value: header.impuestosDeclarados };
          }

          if (widget.id === 'debt') {
            return { ...widget, value: header.deuda };
          }

          if (widget.id === 'returns') {
            return {
              ...widget,
              splitValue: {
                primaryValue: String(header.declaraionesJuradas.presentadas),
                primaryLabel: 'Presentadas',
                secondaryValue: String(header.declaraionesJuradas.noPresentadas),
                secondaryLabel: 'No presentadas'
              }
            };
          }

          return widget;
        })
      : item.widgets,
    activities: header
      ? [
          {
            ...(item.activities[0] ?? {
              id: 'primary',
              type: 'Primaria' as const,
              tag: 'Principal',
              tagTone: 'blue' as const
            }),
            label: header.actividadPrimaria.nombre
          },
          {
            ...(item.activities[1] ?? {
              id: 'secondary',
              type: 'Secundaria' as const,
              tag: 'Secundaria',
              tagTone: 'violet' as const
            }),
            label: header.actividadSecundaria.nombre
          }
        ]
      : item.activities,
    addresses:
      alternateAddressesResult.data?.domiciliosAlternativos.map(
        mapAlternateAddressRecordToViewModel
      ) ?? item.addresses,
    contacts:
      contactsResult.data?.contactos.flatMap(mapContactRecordToViewModel) ?? item.contacts,
    notes: notesResult.data?.notas.map(mapNoteRecordToViewModel) ?? item.notes,
    fines:
      mercurioResult.data?.multas.map((fine) => ({
        id: fine.numero,
        issuedAt: fine.fecha,
        description: fine.descripcion ?? '-',
        amount: fine.monto,
        status: fine.estado
      })) ?? item.fines,
    interventionOrders:
      interventionOrdersResult.data?.ordenes.map((order) => ({
        id: order.numero,
        period: order.periodo,
        reason: order.motivo,
        amount: order.monto,
        status: order.estado
      })) ?? item.interventionOrders
  };

  return (
    <UnifiedRegisterPreviewPage
      item={resolvedItem}
      initialContactsData={contactsResult.data ?? null}
      initialMercurioData={mercurioResult.data ?? null}
      initialInterventionOrdersData={interventionOrdersResult.data ?? null}
      initialNotesData={notesResult.data ?? null}
    />
  );
}
