import { Text } from '@mantine/core';
import { IconFileText, IconX } from '@tabler/icons-react';
import classes from '../InformePreviewModal.module.css';

export function PreviewTopBar({ onClose }: { onClose: () => void }) {
  return (
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
  );
}
