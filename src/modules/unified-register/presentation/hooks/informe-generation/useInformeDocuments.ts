'use client';

import { useState, useTransition } from 'react';
import {
  downloadDocumentAction,
  generateInformeDocumentsAction,
  type DocumentDownloadFormat,
  type IGeneratedInformeDocuments,
  type IGenerateInformeDocumentsPayload
} from '@/modules/documents';
import type { IUnifiedRegisterDetail } from '../../../data/models/UnifiedRegister';
import type { InformeCrossOption, InformeGenerationForm } from '../../constants/informeGeneration';
import { buildInformeGenerationPayload } from '../../utils/buildInformeGenerationPayload';
import { downloadBase64File } from '../../utils/downloadBase64File';

type InformeGenerationStep = 'form' | 'preview';

type UseInformeDocumentsParams = {
  item: IUnifiedRegisterDetail;
  form: InformeGenerationForm;
  selectedCrossIds: string[];
  availableCrosses: InformeCrossOption[];
  hasUnavailableSelectedCross: boolean;
};

export function useInformeDocuments({
  item,
  form,
  selectedCrossIds,
  availableCrosses,
  hasUnavailableSelectedCross
}: UseInformeDocumentsParams) {
  const [step, setStep] = useState<InformeGenerationStep>('form');
  const [generatedDocuments, setGeneratedDocuments] =
    useState<IGeneratedInformeDocuments | null>(null);
  const [previewPayload, setPreviewPayload] =
    useState<IGenerateInformeDocumentsPayload | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadingFormat, setDownloadingFormat] =
    useState<DocumentDownloadFormat | null>(null);
  const [isGenerating, startGenerationTransition] = useTransition();
  const [isDownloading, startDownloadTransition] = useTransition();

  const clearGenerationError = () => setGenerationError(null);

  const generateDocuments = () => {
    const validationError = validateGeneration(
      form,
      selectedCrossIds,
      hasUnavailableSelectedCross
    );
    if (validationError) {
      setGenerationError(validationError);
      return;
    }

    const payload = buildInformeGenerationPayload(
      item,
      form,
      selectedCrossIds,
      availableCrosses
    );
    clearGenerationError();
    setDownloadError(null);
    startGenerationTransition(async () => {
      const result = await generateInformeDocumentsAction(payload);
      if (!result.success || !result.data) {
        setGenerationError(result.error ?? 'No fue posible generar el informe.');
        return;
      }
      setGeneratedDocuments(result.data);
      setPreviewPayload(payload);
      setStep('preview');
    });
  };

  const downloadGeneratedDocument = (formato: DocumentDownloadFormat) => {
    const documentToDownload = generatedDocuments?.[formato];
    if (!documentToDownload) {
      setDownloadError('Todavía no hay un documento generado para descargar.');
      return;
    }
    setDownloadError(null);
    setDownloadingFormat(formato);
    startDownloadTransition(async () => {
      const result = await downloadDocumentAction(
        documentToDownload.documentoId,
        formato
      );
      setDownloadingFormat(null);
      if (!result.success || !result.data) {
        setDownloadError(result.error ?? 'No fue posible descargar el documento.');
        return;
      }
      downloadBase64File(result.data);
    });
  };

  const backToForm = () => {
    setStep('form');
    setDownloadError(null);
  };

  const resetDocuments = () => {
    setStep('form');
    setGeneratedDocuments(null);
    setPreviewPayload(null);
    setGenerationError(null);
    setDownloadError(null);
    setDownloadingFormat(null);
  };

  return {
    backToForm, clearGenerationError, downloadError, downloadingFormat,
    downloadGeneratedDocument, generateDocuments, generatedDocuments,
    generationError, isDownloading, isGenerating, previewPayload, resetDocuments,
    step
  };
}

function validateGeneration(
  form: InformeGenerationForm,
  selectedCrossIds: string[],
  hasUnavailableSelectedCross: boolean
) {
  if (!form.titulo.trim()) return 'El título del informe es obligatorio.';
  if (selectedCrossIds.length === 0) {
    return 'Seleccioná al menos un cruce para generar el informe.';
  }
  if (hasUnavailableSelectedCross) {
    return 'Los cruces seleccionados no tienen datos suficientes para generar el informe.';
  }
  return null;
}
