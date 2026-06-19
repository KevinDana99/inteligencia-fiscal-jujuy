'use client';

import { Modal } from '@mantine/core';
import { ContributorReadonlySection } from './components/ContributorReadonlySection';
import { CrossColumnsPickerModal } from './components/CrossColumnsPickerModal';
import { CrossSelectionSection } from './components/CrossSelectionSection';
import { FiscalActionSection } from './components/FiscalActionSection';
import { GenerationModalFooter } from './components/GenerationModalFooter';
import { GenerationModalHeader } from './components/GenerationModalHeader';
import { InformeHeaderFields } from './components/InformeHeaderFields';
import type { InformeGenerationModalProps } from './types';
import classes from './InformeGenerationModal.module.css';

export function InformeGenerationModal({
  opened,
  report,
  onClose
}: InformeGenerationModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered={false}
      size={680}
      zIndex={900}
      classNames={{
        overlay: classes.overlay,
        inner: classes.inner,
        content: classes.content,
        body: classes.body
      }}
    >
      <GenerationModalHeader onClose={onClose} />
      <InformeHeaderFields report={report} />
      <ContributorReadonlySection report={report} />
      <FiscalActionSection report={report} />
      <CrossSelectionSection report={report} />
      <GenerationModalFooter report={report} onClose={onClose} />
      <CrossColumnsPickerModal report={report} />
    </Modal>
  );
}
