import type { InformeCrossOption } from '../../../constants/informeGeneration';
import { getInformeCrossColumnsByKeys } from '../../../utils/informeCrossColumnSelection';
import classes from '../InformePreviewModal.module.css';

export function CrossPreviewTable({ cross }: { cross: InformeCrossOption }) {
  const selectedColumns = getInformeCrossColumnsByKeys(cross);
  const showLegacyPeriodColumn =
    cross.columnasSeleccionadas.filas.some((row) =>
      Object.prototype.hasOwnProperty.call(row, 'periodo')
    ) && !cross.columnasSeleccionadas.claves.includes('periodo');

  return (
    <table className={classes.table}>
      <thead>
        <tr>
          {showLegacyPeriodColumn ? <th>AÑO</th> : null}
          {selectedColumns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cross.columnasSeleccionadas.filas.map((row, rowIndex) => {
          const period = String(row.periodo ?? '');
          const totalCandidate = String(row.periodo ?? row.anio ?? '');
          const isTotal = totalCandidate.toUpperCase() === 'TOTAL';

          return (
            <tr key={`${cross.id}-${period || rowIndex}`}>
              {showLegacyPeriodColumn ? (
                <td className={isTotal ? classes.totalCell : undefined}>
                  {period}
                </td>
              ) : null}
              {selectedColumns.map((column) => (
                <td
                  key={`${cross.id}-${period}-${column.key}`}
                  className={`${column.align === 'right' ? classes.amountCell : ''} ${
                    isTotal ? classes.totalCell : ''
                  }`}
                >
                  {String(row[column.key] ?? '')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
