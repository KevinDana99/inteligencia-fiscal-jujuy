'use client';

import { useMemo, useState, useTransition } from 'react';
import {
  downloadDocumentAction,
  generateInformeDocumentsAction,
  type DocumentDownloadFormat,
  type IGeneratedInformeDocuments,
  type IGenerateInformeDocumentsPayload
} from '@/modules/documents';
import type { IUnifiedRegisterDetail } from '../../data/models/UnifiedRegister';
import {
  DEFAULT_SELECTED_INFORME_CROSS_IDS,
  INFORME_CROSS_OPTIONS,
  INFORME_DEFAULT_FORM,
  type InformeFiscalActionField,
  type InformeGenerationForm
} from '../constants/informeGeneration';
import {
  buildInformeContributorData,
  buildInformeGenerationPayload,
  getSelectedInformeCrosses
} from '../utils/buildInformeGenerationPayload';
import { downloadBase64File } from '../utils/downloadBase64File';

type InformeGenerationStep = 'form' | 'preview';

const cloneDefaultForm = (): InformeGenerationForm => ({
  titulo: INFORME_DEFAULT_FORM.titulo,
  destinatario: INFORME_DEFAULT_FORM.destinatario,
  datosAccionFiscalizadora: {
    ...INFORME_DEFAULT_FORM.datosAccionFiscalizadora
  }
});

export function useInformeGeneration(item: IUnifiedRegisterDetail) {
  const [step, setStep] = useState<InformeGenerationStep>('form');
  const [form, setForm] = useState<InformeGenerationForm>(cloneDefaultForm);
  const [selectedCrossIds, setSelectedCrossIds] = useState<string[]>(
    DEFAULT_SELECTED_INFORME_CROSS_IDS
  );
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

  const contributorData = useMemo(() => buildInformeContributorData(item), [item]);
  const selectedCrosses = useMemo(
    () => getSelectedInformeCrosses(selectedCrossIds),
    [selectedCrossIds]
  );
  const canGenerate = Boolean(form.titulo.trim()) && selectedCrossIds.length > 0;

  const updateFormField = (field: 'titulo' | 'destinatario', value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
    setGenerationError(null);
  };

  const updateFiscalActionField = (
    field: InformeFiscalActionField,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      datosAccionFiscalizadora: {
        ...current.datosAccionFiscalizadora,
        [field]: value
      }
    }));
    setGenerationError(null);
  };

  const toggleCross = (crossId: string) => {
    setSelectedCrossIds((current) =>
      current.includes(crossId)
        ? current.filter((selectedCrossId) => selectedCrossId !== crossId)
        : [...current, crossId]
    );
    setGenerationError(null);
  };

  const generateDocuments = () => {
    if (!form.titulo.trim()) {
      setGenerationError('El título del informe es obligatorio.');
      return;
    }

    if (selectedCrossIds.length === 0) {
      setGenerationError('Seleccioná al menos un cruce para generar el informe.');
      return;
    }

    const payload = buildInformeGenerationPayload(item, form, selectedCrossIds);

    setGenerationError(null);
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

  const resetFlow = () => {
    setStep('form');
    setForm(cloneDefaultForm());
    setSelectedCrossIds(DEFAULT_SELECTED_INFORME_CROSS_IDS);
    setGeneratedDocuments(null);
    setPreviewPayload(null);
    setGenerationError(null);
    setDownloadError(null);
    setDownloadingFormat(null);
  };

  return {
    availableCrosses: INFORME_CROSS_OPTIONS,
    canGenerate,
    contributorData,
    downloadError,
    downloadingFormat,
    form,
    generatedDocuments,
    generationError,
    isDownloading,
    isGenerating,
    previewPayload,
    selectedCrosses,
    selectedCrossIds,
    step,
    backToForm,
    downloadGeneratedDocument,
    generateDocuments,
    resetFlow,
    toggleCross,
    updateFiscalActionField,
    updateFormField
  };
}

export type UseInformeGenerationReturn = ReturnType<typeof useInformeGeneration>;
