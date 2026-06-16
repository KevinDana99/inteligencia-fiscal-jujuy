'use client';

import { useState } from 'react';
import type {
  InformeFiscalActionField,
  InformeGenerationForm
} from '../../constants/informeGeneration';
import { cloneDefaultForm } from './utils';

export function useInformeForm() {
  const [form, setForm] = useState<InformeGenerationForm>(cloneDefaultForm);

  const updateFormField = (field: 'titulo' | 'destinatario', value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
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
  };

  const resetForm = () => {
    setForm(cloneDefaultForm());
  };

  return { form, resetForm, updateFiscalActionField, updateFormField };
}
