import type {
  IUnifiedRegisterContributorCross,
  IUnifiedRegisterContributorCrossColumnsData,
  IUnifiedRegisterContributorCrossRow
} from '../../data/models/UnifiedRegister';
import {
  INFORME_CROSS_OPTIONS,
  type InformeCrossOption,
  type InformeCrossPreviewColumn
} from '../constants/informeGeneration';

export interface ContributorCrossInformeSource {
  columnsData: IUnifiedRegisterContributorCrossColumnsData | null;
  cross: IUnifiedRegisterContributorCross;
  error?: string;
}

const COLUMN_LABELS: Record<string, string> = {
  anio: 'AÑO',
  biDeclarada: 'BI DECLARADA',
  biEstimada: 'BI ESTIMADA',
  cuit: 'CUIT',
  cu: 'CU',
  df: 'DF',
  diferenciaBi: 'DIFERENCIA BI',
  estadoCalculo: 'ESTADO CÁLCULO',
  razonSocial: 'RAZÓN SOCIAL'
};

const RIGHT_ALIGNED_COLUMN_PATTERN =
  /(anio|base|bi|cantidad|coeficiente|cu|df|deuda|diferencia|importe|monto|saldo|total|valor)/i;

function cloneRows(rows: IUnifiedRegisterContributorCrossRow[]) {
  return rows.map((row) => ({ ...row }));
}

function cloneInformeCrossOption(cross: InformeCrossOption): InformeCrossOption {
  return {
    ...cross,
    sourceCodes: [...cross.sourceCodes],
    previewColumns: cross.previewColumns.map((column) => ({ ...column })),
    columnasSeleccionadas: {
      claves: [...cross.columnasSeleccionadas.claves],
      filas: cloneRows(cross.columnasSeleccionadas.filas)
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

function formatColumnLabel(columnKey: string) {
  return (
    COLUMN_LABELS[columnKey] ??
    columnKey
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim()
      .toLocaleUpperCase('es-AR')
  );
}

function isRightAlignedColumn(
  columnKey: string,
  rows: IUnifiedRegisterContributorCrossRow[]
) {
  const hasNumericValue = rows.some((row) => typeof row[columnKey] === 'number');

  return hasNumericValue || RIGHT_ALIGNED_COLUMN_PATTERN.test(columnKey);
}

function buildPreviewColumns(
  columnKeys: string[],
  rows: IUnifiedRegisterContributorCrossRow[],
  template?: InformeCrossOption
): InformeCrossPreviewColumn[] {
  const templateColumns = new Map(
    template?.previewColumns.map((column) => [column.key, column]) ?? []
  );

  return columnKeys.map((columnKey) => {
    const templateColumn = templateColumns.get(columnKey);

    if (templateColumn) {
      return { ...templateColumn };
    }

    return {
      key: columnKey,
      label: formatColumnLabel(columnKey),
      align: isRightAlignedColumn(columnKey, rows) ? 'right' : undefined
    };
  });
}

function buildSuccessDescription(columnsData: IUnifiedRegisterContributorCrossColumnsData) {
  if (columnsData.columns.length === 0) {
    return 'Ejecutado · detalle sin columnas para informe';
  }

  const rowLabel = columnsData.rows.length === 1 ? 'fila disponible' : 'filas disponibles';

  return `Ejecutado · ${columnsData.rows.length} ${rowLabel} para informe`;
}

function buildUnavailableOption(
  contributorCross: IUnifiedRegisterContributorCross,
  template: InformeCrossOption | undefined,
  error?: string
): InformeCrossOption {
  return {
    ...(template
      ? cloneInformeCrossOption(template)
      : {
          sourceCodes: [contributorCross.code],
          previewTitle: contributorCross.name.toUpperCase(),
          previewColumns: [],
          summary: ''
        }),
    id: contributorCross.id,
    nombre: contributorCross.name,
    description: error
      ? `Ejecutado · ${error}`
      : 'Ejecutado · sin datos de detalle para informe',
    sourceCodes: [contributorCross.code],
    isReportReady: false,
    columnasSeleccionadas: {
      claves: [],
      filas: []
    }
  };
}

export function mapContributorCrossesToInformeOptions(
  contributorCrosses: ContributorCrossInformeSource[]
): InformeCrossOption[] {
  return contributorCrosses.map(({ columnsData, cross, error }) => {
    const template = findInformeCrossTemplate(cross);

    if (!columnsData) {
      return buildUnavailableOption(cross, template, error);
    }

    return {
      ...(template
        ? cloneInformeCrossOption(template)
        : {
            sourceCodes: [cross.code],
            previewTitle: cross.name.toUpperCase(),
            previewColumns: [],
            summary: ''
          }),
      id: cross.id,
      nombre: cross.name,
      description: buildSuccessDescription(columnsData),
      sourceCodes: [cross.code],
      previewColumns: buildPreviewColumns(
        columnsData.columns,
        columnsData.rows,
        template
      ),
      isReportReady: columnsData.columns.length === 0 ? false : undefined,
      columnasSeleccionadas: {
        claves: [],
        filas: cloneRows(columnsData.rows)
      }
    };
  });
}
