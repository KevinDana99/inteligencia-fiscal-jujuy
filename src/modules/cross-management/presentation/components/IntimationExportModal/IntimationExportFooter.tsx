import { Button } from '@mantine/core'
import { IconChevronLeft, IconDownload } from '@tabler/icons-react'
import {
  INTIMATION_EXPORT_BACK_LABEL,
  INTIMATION_EXPORT_DOCX_LABEL,
  INTIMATION_EXPORT_PDF_LABEL
} from '../../constants/intimationExportLabels'
import classes from './IntimationExportFooter.module.css'

interface IntimationExportFooterProps {
  onBack: () => void
  onDownloadDocx?: () => void
  onDownloadPdf?: () => void
}

export function IntimationExportFooter({
  onBack,
  onDownloadDocx,
  onDownloadPdf
}: IntimationExportFooterProps) {
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
          onClick={onDownloadDocx}
        >
          {INTIMATION_EXPORT_DOCX_LABEL}
        </Button>
        <Button
          className={classes.primaryDownloadButton}
          leftSection={<IconDownload size={14} />}
          onClick={onDownloadPdf}
        >
          {INTIMATION_EXPORT_PDF_LABEL}
        </Button>
      </div>
    </div>
  )
}
