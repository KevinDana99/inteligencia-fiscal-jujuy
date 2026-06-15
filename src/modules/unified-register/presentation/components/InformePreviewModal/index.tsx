'use client';

import Image from 'next/image';
import { Button, Modal, Text } from '@mantine/core';
import {
  IconArrowLeft,
  IconDownload,
  IconFileText,
  IconX
} from '@tabler/icons-react';
import { INFORME_INTRO_TEXT } from '../../constants/informeGeneration';
import type { UseInformeGenerationReturn } from '../../hooks/useInformeGeneration';
import classes from './InformePreviewModal.module.css';

function formatBoolean(value: boolean) {
  return value ? 'SI' : 'NO';
}

export function InformePreviewModal({
  opened,
  report,
  onClose
}: {
  opened: boolean;
  report: UseInformeGenerationReturn;
  onClose: () => void;
}) {
  const payload = report.previewPayload;

  if (!payload) {
    return null;
  }

  const contributor = payload.datosContribuyente;
  const actionData = payload.datosAccionFiscalizadora;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered={false}
      size={760}
      zIndex={910}
      classNames={{
        overlay: classes.overlay,
        inner: classes.inner,
        content: classes.content,
        body: classes.body
      }}
    >
      <div className={classes.topBar}>
        <div className={classes.topTitleGroup}>
          <IconFileText size={16} color="#94A3B8" />
          <Text className={classes.topTitle}>
            Informe de Investigación — Previsualización
          </Text>
          <span className={classes.statusPill}>PDF generado</span>
        </div>
        <button type="button" className={classes.closeButton} onClick={onClose}>
          <IconX size={14} />
        </button>
      </div>

      <div className={classes.documentStage}>
        <div className={classes.paper}>
          <Image
            src="/assets/branding/logo.svg"
            alt="Dirección Provincial de Rentas"
            width={160}
            height={38}
            className={classes.logo}
          />

          <div className={classes.documentTitle}>{payload.titulo}</div>
          <div className={classes.introText}>{INFORME_INTRO_TEXT}</div>

          <div className={classes.sectionTitle}>1)&nbsp;&nbsp;&nbsp;CONTRIBUYENTE</div>
          <table className={classes.table}>
            <tbody>
              <tr>
                <td className={classes.labelCell}>Denominación/Razón Social</td>
                <td colSpan={3}>{contributor.razonSocial}</td>
              </tr>
              <tr>
                <td className={classes.labelCell}>C.U.I.T. Nº</td>
                <td>{contributor.cuit}</td>
                <td className={classes.labelCell}>Riesgo Fiscal</td>
                <td className={classes.riskCell}>{contributor.riesgoFiscal}</td>
              </tr>
              <tr>
                <td className={classes.labelCell}>Domicilio Fiscal DPR</td>
                <td colSpan={3}>{contributor.domicilioFiscal}</td>
              </tr>
              <tr>
                <td className={classes.labelCell}>Domicilio Fiscal Electrónico</td>
                <td>{formatBoolean(contributor.domicilioFiscalElectronico)}</td>
                <td className={classes.labelCell}>Email Informado</td>
                <td>{contributor.emailInformado}</td>
              </tr>
              <tr>
                <td className={classes.labelCell}>Actividades Declaradas</td>
                <td colSpan={3}>{contributor.actividadesDeclaradas.join(' / ')}</td>
              </tr>
            </tbody>
          </table>

          <div className={classes.sectionTitle}>
            2)&nbsp;&nbsp;&nbsp;DATOS DE LA ACCIÓN FISCALIZADORA
          </div>
          <table className={classes.table}>
            <tbody>
              <tr>
                <td className={classes.labelCell}>Origen del Pedido</td>
                <td colSpan={3}>{actionData.origenPedido}</td>
              </tr>
              <tr>
                <td className={classes.labelCell}>Impuesto/s a Verificar</td>
                <td>{actionData.impuestosAVerificar}</td>
                <td className={classes.labelCell}>Periodos</td>
                <td>{actionData.periodo ?? ''}</td>
              </tr>
              <tr>
                <td className={classes.labelCell}>Origen de la O.I.</td>
                <td colSpan={3}>{actionData.origenOI ?? ''}</td>
              </tr>
              <tr>
                <td className={classes.labelCell}>Programa</td>
                <td colSpan={3}>{actionData.programa ?? ''}</td>
              </tr>
              <tr>
                <td className={classes.labelCell}>Tipo de Instrucción</td>
                <td>{actionData.tipoInstruccion ?? ''}</td>
                <td className={classes.labelCell}>Impuesto Neto</td>
                <td>{actionData.impuestoNeto ?? ''}</td>
              </tr>
            </tbody>
          </table>

          <div className={classes.sectionTitle}>
            3)&nbsp;&nbsp;&nbsp;INCONSISTENCIAS DETECTADAS
          </div>
          {report.selectedCrosses.map((cross) => (
            <div key={cross.id}>
              <div className={classes.crossTitle}>{cross.previewTitle}</div>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th>AÑO</th>
                    {cross.previewColumns.map((column) => (
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
                        {cross.previewColumns.map((column) => (
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
              <div className={classes.summary}>{cross.summary}</div>
            </div>
          ))}

          <div className={classes.stamp}>DPR Jujuy</div>
        </div>
      </div>

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
    </Modal>
  );
}
