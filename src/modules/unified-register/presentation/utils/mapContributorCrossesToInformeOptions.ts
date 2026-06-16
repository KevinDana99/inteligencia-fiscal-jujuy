import type { IUnifiedRegisterContributorCross } from '../../data/models/UnifiedRegister';
import {
  INFORME_CROSS_OPTIONS,
  type InformeCrossOption
} from '../constants/informeGeneration';

function cloneRows(
  cross: InformeCrossOption
): InformeCrossOption['columnasSeleccionadas']['filas'] {
  return cross.columnasSeleccionadas.filas.map((row) => ({ ...row }));
}

function cloneInformeCrossOption(cross: InformeCrossOption): InformeCrossOption {
  return {
    ...cross,
    sourceCodes: [...cross.sourceCodes],
    previewColumns: cross.previewColumns.map((column) => ({ ...column })),
    columnasSeleccionadas: {
      claves: [...cross.columnasSeleccionadas.claves],
      filas: cloneRows(cross)
    }
  };
}

function findInformeCrossTemplate(
  contributorCross: IUnifiedRegisterContributorCross
) {
  return INFORME_CROSS_OPTIONS.find((option) =>
    option.sourceCodes.includes(contributorCross.code)
  );
}

export function mapContributorCrossesToInformeOptions(
  contributorCrosses: IUnifiedRegisterContributorCross[]
): InformeCrossOption[] {
  return contributorCrosses.map((contributorCross) => {
    const template = findInformeCrossTemplate(contributorCross);

    if (template) {
      return {
        ...cloneInformeCrossOption(template),
        id: contributorCross.id,
        nombre: contributorCross.name,
        description: 'Ejecutado · datos disponibles para informe'
      };
    }

    return {
      id: contributorCross.id,
      nombre: contributorCross.name,
      description: 'Ejecutado · sin datos de detalle para informe',
      sourceCodes: [contributorCross.code],
      previewTitle: contributorCross.name.toUpperCase(),
      previewColumns: [],
      summary: '',
      isReportReady: false,
      columnasSeleccionadas: {
        claves: [],
        filas: []
      }
    };
  });
}
