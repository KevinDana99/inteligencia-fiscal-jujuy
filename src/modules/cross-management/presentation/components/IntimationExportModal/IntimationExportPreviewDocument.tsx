import { Text } from '@mantine/core'
import type { IntimationTemplateState } from '@/modules/configuration-module/presentation/hooks/intimation-template'
import type { IntimationExportContributor } from '../../hooks/intimation-export/useIntimationExportModal'
import { useIntimationExportDocument } from '../../hooks/intimation-export/useIntimationExportDocument'
import { IntimationExportPreviewTable } from './IntimationExportPreviewTable'
import classes from './IntimationExportPreview.module.css'

interface IntimationExportPreviewDocumentProps {
  contributor: IntimationExportContributor | undefined
  templateState: IntimationTemplateState
}

export function IntimationExportPreviewDocument({
  contributor,
  templateState
}: IntimationExportPreviewDocumentProps) {
  const {
    contributorCuit,
    contributorName,
    paragraphs,
    shouldShowSource,
    tableCells
  } = useIntimationExportDocument({ contributor, templateState })

  return (
    <div className={classes.previewSurface}>
      <div className={classes.pageSheet}>
        <div className={classes.pageNumber}>Página 1</div>
        <div className={classes.docHeaderBlock}>
          <Text className={classes.docContributor}>
            CONTRIBUYENTE: {contributorName}
          </Text>
          <Text className={classes.docContributor}>CUIT: {contributorCuit}</Text>
        </div>

        <Text className={classes.docSubject}>{templateState.asunto}</Text>

        <div className={classes.docBody}>
          <Text className={classes.docParagraph}>{templateState.saludo}</Text>
          {paragraphs.map((paragraph, index) => (
            <Text key={`${paragraph}-${index}`} className={classes.docParagraph}>
              {paragraph || '\u00A0'}
            </Text>
          ))}
        </div>

        <IntimationExportPreviewTable
          columns={templateState.columnas}
          cells={tableCells}
        />

        {shouldShowSource ? (
          <Text className={classes.docFooterMeta}>
            Fuente de información: {templateState.fuenteInformacion}
          </Text>
        ) : null}
        <Text className={classes.docFooterMeta}>{templateState.fechaCorte}</Text>
      </div>
    </div>
  )
}
