import {
  INFORME_DEFAULT_FORM,
  type InformeCrossOption,
  type InformeGenerationForm
} from '../../constants/informeGeneration';

export const cloneDefaultForm = (): InformeGenerationForm => ({
  titulo: INFORME_DEFAULT_FORM.titulo,
  destinatario: INFORME_DEFAULT_FORM.destinatario,
  datosAccionFiscalizadora: {
    ...INFORME_DEFAULT_FORM.datosAccionFiscalizadora
  }
});

export const getDefaultSelectedCrossIds = (crosses: InformeCrossOption[]) => {
  const firstReportReadyCross = crosses.find(
    (cross) => cross.isReportReady !== false
  );

  return firstReportReadyCross ? [firstReportReadyCross.id] : [];
};
