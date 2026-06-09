import { Button } from '@mantine/core'
import { IconChevronLeft, IconDownload } from '@tabler/icons-react'
import {
  INTIMATION_EXPORT_BACK_LABEL,
  INTIMATION_EXPORT_DOCX_LABEL,
  INTIMATION_EXPORT_PDF_LABEL
} from '../../constants/intimationExportLabels'
import classes from './IntimationExportFooter.module.css'

interface IntimationExportFooterProps {
  isDocxDownloading?: boolean
  isDownloadDisabled?: boolean
  isPdfDownloading?: boolean
  onBack: () => void
  onDownloadDocx?: () => void
  onDownloadPdf?: () => void
}

export function IntimationExportFooter({
  isDocxDownloading = false,
  isDownloadDisabled = false,
  isPdfDownloading = false,
  onBack,
  onDownloadDocx,
  onDownloadPdf
}: IntimationExportFooterProps) {
  const isDocxDisabled =
    !onDownloadDocx ||
    isPdfDownloading ||
    (isDownloadDisabled && !isDocxDownloading)
  const isPdfDisabled =
    !onDownloadPdf ||
    isDocxDownloading ||
    (isDownloadDisabled && !isPdfDownloading)

  return (
    <div className={classes.bottomBar}>
      <Button
        variant="subtle"
        className={classes.backButton}
        leftSection={<IconChevronLeft size={14} />}
        onClick={onBack}
      >
        {INTIMATION_EXPORT_BACK_LABEL}
      </Button>

      <div className={classes.downloadActions}>
        <Button
          variant="subtle"
          className={classes.secondaryDownloadButton}
          leftSection={<IconDownload size={14} />}
          disabled={isDocxDisabled}
          loading={isDocxDownloading}
          loaderProps={{ color: 'white', size: 16 }}
          onClick={onDownloadDocx}
        >
          {INTIMATION_EXPORT_DOCX_LABEL}
        </Button>
        <Button
          className={classes.primaryDownloadButton}
          leftSection={<IconDownload size={14} />}
          disabled={isPdfDisabled}
          loading={isPdfDownloading}
          loaderProps={{ color: 'gray.9', size: 16 }}
          onClick={onDownloadPdf}
        >
          {INTIMATION_EXPORT_PDF_LABEL}
        </Button>
      </div>
    </div>
  )
}
