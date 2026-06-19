import { Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import classes from '../InformeGenerationModal.module.css';

export function GenerationModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className={classes.header}>
      <div>
        <Text className={classes.title}>Generar Informe</Text>
        <Text className={classes.subtitle}>
          Completá los datos y elegí los cruces a incluir
        </Text>
      </div>
      <button type="button" className={classes.closeButton} onClick={onClose}>
        <IconX size={18} />
      </button>
    </div>
  );
}
