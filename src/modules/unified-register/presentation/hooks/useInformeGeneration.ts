'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import {
  downloadDocumentAction,
  generateInformeDocumentsAction,
  type DocumentDownloadFormat,
  type IGeneratedInformeDocuments,
  type IGenerateInformeDocumentsPayload
} from '@/modules/documents';
import { getContributorCrossesAction } from '../../data/actions';
import type { IUnifiedRegisterDetail } from '../../data/models/UnifiedRegister';
import {
  DEFAULT_SELECTED_INFORME_CROSS_IDS,
  INFORME_CROSS_OPTIONS,
  INFORME_DEFAULT_FORM,
  type InformeCrossOption,
  type InformeFiscalActionField,
  type InformeGenerationForm
} from '../constants/informeGeneration';
import {
  buildInformeContributorData,
  buildInformeGenerationPayload,
  getSelectedInformeCrosses,
  mapContributorCrossesToInformeOptions
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

const getDefaultSelectedCrossIds = (crosses: InformeCrossOption[]) => {
  const firstReportReadyCross = crosses.find(
    (cross) => cross.isReportReady !== false
  );

  return firstReportReadyCross ? [firstReportReadyCross.id] : [];
};

export function useInformeGeneration(
  item: IUnifiedRegisterDetail,
  shouldLoadCrosses = true
) {
  const [step, setStep] = useState<InformeGenerationStep>('form');
  const [form, setForm] = useState<InformeGenerationForm>(cloneDefaultForm);
  const [availableCrosses, setAvailableCrosses] =
    useState<InformeCrossOption[]>(INFORME_CROSS_OPTIONS);
  const [selectedCrossIds, setSelectedCrossIds] = useState<string[]>(
    DEFAULT_SELECTED_INFORME_CROSS_IDS
  );
  const [generatedDocuments, setGeneratedDocuments] =
    useState<IGeneratedInformeDocuments | null>(null);
  const [previewPayload, setPreviewPayload] =
    useState<IGenerateInformeDocumentsPayload | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [crossesError, setCrossesError] = useState<string | null>(null);
  const [loadedCrossesContributorId, setLoadedCrossesContributorId] =
    useState<string | null>(null);
  const [downloadingFormat, setDownloadingFormat] =
    useState<DocumentDownloadFormat | null>(null);
  const [isGenerating, startGenerationTransition] = useTransition();
  const [isDownloading, startDownloadTransition] = useTransition();

  const contributorData = useMemo(
    () => buildInformeContributorData(item),
    [item]
  );
  const selectedCrosses = useMemo(
    () => getSelectedInformeCrosses(selectedCrossIds, availableCrosses),
    [availableCrosses, selectedCrossIds]
  );
  const isLoadingCrosses =
    shouldLoadCrosses && loadedCrossesContributorId !== item.contribuyenteId;
  const hasUnavailableSelectedCross =
    selectedCrosses.length !== selectedCrossIds.length ||
    selectedCrosses.some((cross) => cross.isReportReady === false);
  const canGenerate =
    Boolean(form.titulo.trim()) &&
    selectedCrossIds.length > 0 &&
    !hasUnavailableSelectedCross &&
    !isLoadingCrosses;

  useEffect(() => {
    if (!shouldLoadCrosses || loadedCrossesContributorId === item.contribuyenteId) {
      return;
    }

    let isActive = true;

    getContributorCrossesAction(item.contribuyenteId)
      .then((result) => {
        if (!isActive) {
          return;
        }

        if (!result.data) {
          setAvailableCrosses([]);
          setSelectedCrossIds([]);
          setCrossesError(
            result.error ?? 'No fue posible listar los cruces del contribuyente.'
          );
          setLoadedCrossesContributorId(item.contribuyenteId);
          return;
        }

        const nextCrosses = mapContributorCrossesToInformeOptions(
          result.data.crosses
        );

        setAvailableCrosses(nextCrosses);
        setSelectedCrossIds((current) => {
          const availableReportReadyIds = new Set(
            nextCrosses
              .filter((cross) => cross.isReportReady !== false)
              .map((cross) => cross.id)
          );
          const currentAvailableIds = current.filter((crossId) =>
            availableReportReadyIds.has(crossId)
          );

          return currentAvailableIds.length
            ? currentAvailableIds
            : getDefaultSelectedCrossIds(nextCrosses);
        });
        setCrossesError(null);
        setLoadedCrossesContributorId(item.contribuyenteId);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setAvailableCrosses([]);
        setSelectedCrossIds([]);
        setCrossesError('No fue posible listar los cruces del contribuyente.');
        setLoadedCrossesContributorId(item.contribuyenteId);
      });

    return () => {
      isActive = false;
    };
  }, [item.contribuyenteId, loadedCrossesContributorId, shouldLoadCrosses]);

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
    const cross = availableCrosses.find(
      (availableCross) => availableCross.id === crossId
    );

    if (cross?.isReportReady === false) {
      return;
    }

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

    if (hasUnavailableSelectedCross) {
      setGenerationError(
        'Los cruces seleccionados no tienen datos suficientes para generar el informe.'
      );
      return;
    }

    const payload = buildInformeGenerationPayload(
      item,
      form,
      selectedCrossIds,
      availableCrosses
    );

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
    setSelectedCrossIds(getDefaultSelectedCrossIds(availableCrosses));
    setGeneratedDocuments(null);
    setPreviewPayload(null);
    setGenerationError(null);
    setDownloadError(null);
    setDownloadingFormat(null);
  };

  return {
    availableCrosses,
    canGenerate,
    contributorData,
    crossesError,
    downloadError,
    downloadingFormat,
    form,
    generatedDocuments,
    generationError,
    isDownloading,
    isGenerating,
    isLoadingCrosses,
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
