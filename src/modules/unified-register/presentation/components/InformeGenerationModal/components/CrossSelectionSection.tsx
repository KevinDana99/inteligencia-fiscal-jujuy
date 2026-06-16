import { Checkbox, Text } from '@mantine/core';
import type { InformeGenerationReport } from '../types';
import classes from '../InformeGenerationModal.module.css';

const crossCheckboxClasses = {
  root: classes.crossRow,
  body: classes.crossBody,
  input: classes.crossInput,
  label: classes.crossTitle,
  description: classes.crossDescription
};

export function CrossSelectionSection({
  report
}: {
  report: InformeGenerationReport;
}) {
  const hasEmptyCrosses =
    !report.isLoadingCrosses &&
    !report.crossesError &&
    report.availableCrosses.length === 0;

  return (
    <>
      <div className={classes.sectionLabel}>
        3) Inconsistencias detectadas — Cruces
      </div>
      <div className={classes.crossesBox}>
        {report.isLoadingCrosses ? (
          <Text className={classes.crossStateText}>Cargando cruces...</Text>
        ) : null}
        {!report.isLoadingCrosses && report.crossesError ? (
          <Text className={classes.crossStateText}>{report.crossesError}</Text>
        ) : null}
        {hasEmptyCrosses ? (
          <Text className={classes.crossStateText}>
            No se encontraron cruces asociados
          </Text>
        ) : null}
        {!report.isLoadingCrosses
          ? report.availableCrosses.map((cross) => (
              <Checkbox
                key={cross.id}
                checked={report.selectedCrossIds.includes(cross.id)}
                onChange={() => report.toggleCross(cross.id)}
                label={cross.nombre}
                description={cross.description}
                color="blue"
                size="sm"
                disabled={cross.isReportReady === false}
                classNames={crossCheckboxClasses}
              />
            ))
          : null}
      </div>
    </>
  );
}
