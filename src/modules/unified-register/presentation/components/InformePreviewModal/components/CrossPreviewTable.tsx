import type { InformeCrossOption } from '../../../constants/informeGeneration';
import { getInformeCrossColumnsByKeys } from '../../../utils/informeCrossColumnSelection';
import classes from '../InformePreviewModal.module.css';

export function CrossPreviewTable({ cross }: { cross: InformeCrossOption }) {
  const selectedColumns = getInformeCrossColumnsByKeys(cross);

  return (
    <table className={classes.table}>
      <thead>
        <tr>
          <th>AÑO</th>
          {selectedColumns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cross.columnasSeleccionadas.filas.map((row) => {
          const period = String(row.periodo ?? '');
          const isTotal = period.toUpperCase() === 'TOTAL';

          return (
            <tr key={`${cross.id}-${period}`}>
              <td className={isTotal ? classes.totalCell : undefined}>
                {period}
              </td>
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
