'use client';

import { useState } from 'react';
import {
  type DocumentDownloadFormat,
  type IGeneratedInformeDocuments,
  type IGenerateInformeDocumentsPayload
} from '@/modules/documents';
import type { IUnifiedRegisterDetail } from '../../../data/models/UnifiedRegister';
import type { InformeCrossOption, InformeGenerationForm } from '../../constants/informeGeneration';
import { buildInformeGenerationPayload } from '../../utils/buildInformeGenerationPayload';
import {
  downloadInformeDocument,
  generateInformeDocuments
} from '../../utils/informeDocumentGeneration';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const clearGenerationError = () => setGenerationError(null);

  const generateDocuments = () => {
    if (isGenerating) {
      return;
    }

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
    setIsGenerating(true);
    void (async () => {
      try {
        const generatedInformeDocuments = await generateInformeDocuments(payload);
        setGeneratedDocuments(generatedInformeDocuments);
        setPreviewPayload(payload);
        setStep('preview');
      } catch (error) {
        setGenerationError(
          resolveInformeDocumentError(error, 'No fue posible generar el informe.')
        );
      } finally {
        setIsGenerating(false);
      }
    })();
  };

  const downloadGeneratedDocument = (formato: DocumentDownloadFormat) => {
    if (isDownloading) {
      return;
    }

    const documentToDownload = generatedDocuments?.[formato];
    if (!documentToDownload) {
      setDownloadError('Todavía no hay un documento generado para descargar.');
      return;
    }
    setDownloadError(null);
    setDownloadingFormat(formato);
    setIsDownloading(true);
    void (async () => {
      try {
        await downloadInformeDocument({
          documentId: documentToDownload.documentoId,
          format: formato
        });
      } catch (error) {
        setDownloadError(
          resolveInformeDocumentError(
            error,
            'No fue posible descargar el documento.'
          )
        );
      } finally {
        setDownloadingFormat(null);
        setIsDownloading(false);
      }
    })();
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
    setIsGenerating(false);
    setIsDownloading(false);
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

function resolveInformeDocumentError(error: unknown, fallbackMessage: string) {
  return error instanceof Error && error.message.trim()
    ? error.message
    : fallbackMessage;
}
