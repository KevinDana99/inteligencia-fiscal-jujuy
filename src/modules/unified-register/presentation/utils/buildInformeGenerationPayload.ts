import type {
  DocumentCellValue,
  IGenerateInformeDocumentsPayload,
  IInformeContributorData,
  IInformeFiscalActionData,
  IInformeSelectedCross
} from '@/modules/documents';
import type { IUnifiedRegisterDetail } from '../../data/models/UnifiedRegister';
import {
  INFORME_CROSS_OPTIONS,
  type InformeCrossOption,
  type InformeGenerationForm
} from '../constants/informeGeneration';
export { mapContributorCrossesToInformeOptions } from './mapContributorCrossesToInformeOptions';

const TEMPORARY_FISCAL_ADDRESS_FALLBACK = 'calle falsa 123';

function normalizeOptionalText(value: string) {
  const normalizedValue = value.trim();
  return normalizedValue ? normalizedValue : null;
}

function resolveFiscalAddress(item: IUnifiedRegisterDetail) {
  return (
    item.fiscalAddress.trim() ||
    item.alternateAddress.trim() ||
    TEMPORARY_FISCAL_ADDRESS_FALLBACK
  );
}

function getContactValue(item: IUnifiedRegisterDetail, contactId: string) {
  return (
    item.contacts.find((contact) => contact.id === contactId)?.value ??
    item.contacts.find((contact) =>
      contact.label.toLowerCase().includes(contactId.toLowerCase())
    )?.value ??
    ''
  );
}

function toDocumentCellValue(value: unknown): DocumentCellValue {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (value === undefined) {
    return null;
  }

  try {
    return JSON.stringify(value) ?? null;
  } catch {
    return String(value);
  }
}

function resolveRowPeriod(row: Record<string, unknown>) {
  const periodValue = row.periodo ?? row.anio ?? row.periodoFiscal ?? row.year;
  const normalizedPeriod = toDocumentCellValue(periodValue);

  return normalizedPeriod === null ? null : String(normalizedPeriod);
}

function cloneRows(
  cross: InformeCrossOption
): IInformeSelectedCross['columnasSeleccionadas']['filas'] {
  return cross.columnasSeleccionadas.filas
    .filter(
      (row) =>
        String(resolveRowPeriod(row) ?? '').trim().toUpperCase() !== 'TOTAL'
    )
    .map((row) => cloneSelectedColumnsRow(row, cross.columnasSeleccionadas.claves));
}

function cloneSelectedColumnsRow(
  row: Record<string, DocumentCellValue>,
  columnKeys: string[]
) {
  const selectedEntries = columnKeys.map(
    (columnKey): [string, DocumentCellValue] => [
      columnKey,
      toDocumentCellValue(row[columnKey])
    ]
  );

  if (columnKeys.includes('periodo')) {
    return Object.fromEntries(selectedEntries);
  }

  return Object.fromEntries([
    ['periodo', resolveRowPeriod(row)] as [string, DocumentCellValue],
    ...selectedEntries
  ]);
}

export function buildInformeContributorData(
  item: IUnifiedRegisterDetail
): IInformeContributorData {
  const actividadesDeclaradas = item.activities.length
    ? item.activities.map((activity) => activity.label)
    : item.activity
      ? [item.activity]
      : [];

  return {
    razonSocial: item.businessName,
    cuit: item.cuit,
    domicilioFiscal: resolveFiscalAddress(item),
    domicilioFiscalElectronico: true,
    emailInformado: getContactValue(item, 'mail'),
    riesgoFiscal: item.riskLevel ?? '',
    actividadesDeclaradas
  };
}

export function getSelectedInformeCrosses(
  selectedCrossIds: string[],
  availableCrosses: InformeCrossOption[] = INFORME_CROSS_OPTIONS
): InformeCrossOption[] {
  return availableCrosses
    .filter((cross) => selectedCrossIds.includes(cross.id))
    .map((cross) => ({
      ...cross,
      columnasSeleccionadas: {
        claves: [...cross.columnasSeleccionadas.claves],
        filas: cloneRows(cross)
      }
    }));
}

export function buildInformeSelectedCrosses(
  selectedCrossIds: string[],
  availableCrosses: InformeCrossOption[] = INFORME_CROSS_OPTIONS
): IInformeSelectedCross[] {
  return getSelectedInformeCrosses(selectedCrossIds, availableCrosses).map(
    (cross) => ({
      nombre: cross.nombre,
      columnasSeleccionadas: {
        claves: [...cross.columnasSeleccionadas.claves],
        filas: cloneRows(cross)
      }
    })
  );
}

export function buildInformeFiscalActionData(
  form: InformeGenerationForm
): IInformeFiscalActionData {
  return {
    origenPedido: form.datosAccionFiscalizadora.origenPedido,
    impuestosAVerificar: form.datosAccionFiscalizadora.impuestosAVerificar,
    periodo: normalizeOptionalText(form.datosAccionFiscalizadora.periodo),
    origenOI: normalizeOptionalText(form.datosAccionFiscalizadora.origenOI),
    programa: normalizeOptionalText(form.datosAccionFiscalizadora.programa),
    tipoInstruccion: normalizeOptionalText(
      form.datosAccionFiscalizadora.tipoInstruccion
    ),
    impuestoNeto: normalizeOptionalText(form.datosAccionFiscalizadora.impuestoNeto)
  };
}

export function buildInformeGenerationPayload(
  item: IUnifiedRegisterDetail,
  form: InformeGenerationForm,
  selectedCrossIds: string[],
  availableCrosses: InformeCrossOption[] = INFORME_CROSS_OPTIONS
): IGenerateInformeDocumentsPayload {
  return {
    contribuyenteId: item.contribuyenteId,
    destinatario: normalizeOptionalText(form.destinatario),
    titulo: form.titulo.trim(),
    datosContribuyente: buildInformeContributorData(item),
    datosAccionFiscalizadora: buildInformeFiscalActionData(form),
    crucesSeleccionados: buildInformeSelectedCrosses(
      selectedCrossIds,
      availableCrosses
    )
  };
}
