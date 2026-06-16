'use client';

import { useMemo } from 'react';
import type { IUnifiedRegisterDetail } from '../../data/models/UnifiedRegister';
import { buildInformeContributorData, getSelectedInformeCrosses } from '../utils/buildInformeGenerationPayload';
import { useInformeCrosses } from './informe-generation/useInformeCrosses';
import { useInformeDocuments } from './informe-generation/useInformeDocuments';
import { useInformeForm } from './informe-generation/useInformeForm';

export function useInformeGeneration(
  item: IUnifiedRegisterDetail,
  shouldLoadCrosses = true
) {
  const formState = useInformeForm();
  const crosses = useInformeCrosses(item, shouldLoadCrosses);
  const contributorData = useMemo(() => buildInformeContributorData(item), [item]);
  const selectedCrosses = useMemo(
    () => getSelectedInformeCrosses(crosses.selectedCrossIds, crosses.availableCrosses),
    [crosses.availableCrosses, crosses.selectedCrossIds]
  );
  const hasUnavailableSelectedCross =
    selectedCrosses.length !== crosses.selectedCrossIds.length ||
    selectedCrosses.some((cross) => cross.isReportReady === false);
  const documents = useInformeDocuments({
    item,
    form: formState.form,
    selectedCrossIds: crosses.selectedCrossIds,
    availableCrosses: crosses.availableCrosses,
    hasUnavailableSelectedCross
  });
  const canGenerate =
    Boolean(formState.form.titulo.trim()) &&
    crosses.selectedCrossIds.length > 0 &&
    !hasUnavailableSelectedCross &&
    !crosses.isLoadingCrosses;

  const updateFormField: typeof formState.updateFormField = (field, value) => {
    formState.updateFormField(field, value);
    documents.clearGenerationError();
  };
  const updateFiscalActionField: typeof formState.updateFiscalActionField = (
    field,
    value
  ) => {
    formState.updateFiscalActionField(field, value);
    documents.clearGenerationError();
  };
  const toggleCross = (crossId: string) => {
    crosses.toggleCrossSelection(crossId);
    documents.clearGenerationError();
  };
  const resetFlow = () => {
    documents.resetDocuments();
    formState.resetForm();
    crosses.resetSelectedCrosses();
  };

  return {
    ...crosses,
    ...documents,
    canGenerate,
    contributorData,
    form: formState.form,
    selectedCrosses,
    resetFlow,
    toggleCross,
    updateFiscalActionField,
    updateFormField
  };
}

export type UseInformeGenerationReturn = ReturnType<typeof useInformeGeneration>;
