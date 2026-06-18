import {
  INFORME_DEFAULT_FORM,
  type InformeGenerationForm
} from '../../constants/informeGeneration';

export const cloneDefaultForm = (): InformeGenerationForm => ({
  titulo: INFORME_DEFAULT_FORM.titulo,
  destinatario: INFORME_DEFAULT_FORM.destinatario,
  datosAccionFiscalizadora: {
    ...INFORME_DEFAULT_FORM.datosAccionFiscalizadora
  }
});
