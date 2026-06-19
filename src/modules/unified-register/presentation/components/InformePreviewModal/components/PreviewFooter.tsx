import { Button, Text } from '@mantine/core';
import { IconArrowLeft, IconDownload } from '@tabler/icons-react';
import type { InformePreviewReport } from '../types';
import classes from '../InformePreviewModal.module.css';

export function PreviewFooter({ report }: { report: InformePreviewReport }) {
  return (
    <div className={classes.bottomBar}>
      <Button
        variant="default"
        className={classes.backButton}
        leftSection={<IconArrowLeft size={14} />}
        onClick={report.backToForm}
      >
        Volver
      </Button>
      {report.downloadError ? (
        <Text className={classes.errorText}>{report.downloadError}</Text>
      ) : null}
      <div className={classes.footerDownloads}>
        <Button
          variant="default"
          className={classes.downloadButton}
          leftSection={<IconDownload size={14} />}
          onClick={() => report.downloadGeneratedDocument('docx')}
          loading={report.downloadingFormat === 'docx'}
          disabled={report.isDownloading}
        >
          Descargar Word
        </Button>
        <Button
          className={classes.primaryDownloadButton}
          leftSection={<IconDownload size={14} />}
          onClick={() => report.downloadGeneratedDocument('pdf')}
          loading={report.downloadingFormat === 'pdf'}
          disabled={report.isDownloading}
        >
          Descargar PDF
        </Button>
      </div>
    </div>
  );
}
