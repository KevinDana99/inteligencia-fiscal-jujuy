import { Button, Text } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import type { InformeGenerationReport } from '../types';
import classes from '../InformeGenerationModal.module.css';

export function GenerationModalFooter({
  report,
  onClose
}: {
  report: InformeGenerationReport;
  onClose: () => void;
}) {
  return (
    <>
      {report.generationError ? (
        <Text className={classes.errorText}>{report.generationError}</Text>
      ) : null}
      <div className={classes.footer}>
        <div className={classes.footerActions}>
          <Button
            variant="default"
            className={classes.ghostButton}
            onClick={onClose}
            disabled={report.isGenerating}
          >
            Cancelar
          </Button>
          <Button
            className={classes.primaryButton}
            rightSection={<IconArrowRight size={14} />}
            onClick={report.generateDocuments}
            disabled={!report.canGenerate}
            loading={report.isGenerating}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </>
  );
}
