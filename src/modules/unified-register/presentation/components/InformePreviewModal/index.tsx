'use client';

import { Modal } from '@mantine/core';
import { PreviewDocument } from './components/PreviewDocument';
import { PreviewFooter } from './components/PreviewFooter';
import { PreviewTopBar } from './components/PreviewTopBar';
import type { InformePreviewModalProps } from './types';
import classes from './InformePreviewModal.module.css';

export function InformePreviewModal({
  opened,
  report,
  onClose
}: InformePreviewModalProps) {
  const payload = report.previewPayload;

  if (!payload) {
    return null;
  }

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
      <PreviewTopBar onClose={onClose} />
      <PreviewDocument payload={payload} report={report} />
      <PreviewFooter report={report} />
    </Modal>
  );
}
