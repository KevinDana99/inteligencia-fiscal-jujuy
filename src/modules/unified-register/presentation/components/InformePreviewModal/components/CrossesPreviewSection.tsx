import type { InformeCrossOption } from '../../../constants/informeGeneration';
import classes from '../InformePreviewModal.module.css';
import { CrossPreviewTable } from './CrossPreviewTable';

export function CrossesPreviewSection({
  selectedCrosses
}: {
  selectedCrosses: InformeCrossOption[];
}) {
  return (
    <>
      <div className={classes.sectionTitle}>
        3)&nbsp;&nbsp;&nbsp;INCONSISTENCIAS DETECTADAS
      </div>
      {selectedCrosses.map((cross) => (
        <div key={cross.id}>
          <div className={classes.crossTitle}>{cross.previewTitle}</div>
          <CrossPreviewTable cross={cross} />
          <div className={classes.summary}>{cross.summary}</div>
        </div>
      ))}
    </>
  );
}
