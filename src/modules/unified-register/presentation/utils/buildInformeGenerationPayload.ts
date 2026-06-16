import type {
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

function normalizeOptionalText(value: string) {
  const normalizedValue = value.trim();
  return normalizedValue ? normalizedValue : null;
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

function cloneRows(
  cross: InformeCrossOption
): IInformeSelectedCross['columnasSeleccionadas']['filas'] {
  return cross.columnasSeleccionadas.filas.map((row) => ({ ...row }));
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
    domicilioFiscal: item.fiscalAddress || item.alternateAddress,
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
  return availableCrosses.filter((cross) => selectedCrossIds.includes(cross.id));
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
