import { Checkbox, Text } from '@mantine/core';
import type { InformeGenerationReport } from '../types';
import classes from '../InformeGenerationModal.module.css';

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
          ? report.availableCrosses.map((cross) => {
              const isSelected = report.selectedCrossIds.includes(cross.id);
              const isDisabled = cross.isReportReady === false;

              return (
                <div
                  key={cross.id}
                  className={classes.crossRow}
                  data-disabled={isDisabled || undefined}
                  data-selected={isSelected || undefined}
                  role={isDisabled ? undefined : 'button'}
                  tabIndex={isDisabled ? undefined : 0}
                  onClick={() => report.openCrossColumnPicker(cross.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      report.openCrossColumnPicker(cross.id);
                    }
                  }}
                >
                  <Checkbox
                    aria-label={`Seleccionar ${cross.nombre}`}
                    checked={isSelected}
                    onClick={(event) => event.stopPropagation()}
                    onChange={() => report.toggleCross(cross.id)}
                    color="blue"
                    size="sm"
                    disabled={isDisabled}
                    classNames={{ input: classes.crossInput }}
                  />
                  <div className={classes.crossText}>
                    <Text className={classes.crossTitle}>{cross.nombre}</Text>
                    <Text className={classes.crossDescription}>
                      {cross.description}
                    </Text>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </>
  );
}
