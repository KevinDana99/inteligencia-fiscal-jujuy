import { Button, Group, Stack, Text, Textarea } from '@mantine/core';
import type { PreviewController } from '../../types';
import classes from '../../UnifiedRegisterPreviewPage.module.css';

type NoteEditFormProps = {
  preview: PreviewController;
};

export function NoteEditForm({ preview }: NoteEditFormProps) {
  return (
    <Stack gap={0}>
      <Textarea
        classNames={{ input: classes.noteModalTextarea }}
        value={preview.formValue ?? ''}
        onChange={(event) => preview.setFormValue(event.currentTarget.value)}
        placeholder="Escribí la nota..."
        rows={4}
      />
      {preview.noteActionError ? (
        <Text className={classes.modalText} c="red">{preview.noteActionError}</Text>
      ) : null}
      <Group justify="flex-end" gap="sm">
        <Button variant="default" radius="xl" className={`${classes.modalGhostButton} ${classes.staticButton}`} onClick={preview.closeEditModal} disabled={preview.isNoteSavePending}>
          Cancelar
        </Button>
        <Button radius="xl" className={`${classes.modalPrimaryButton} ${classes.staticButton}`} onClick={preview.submitEditModal} disabled={!preview.formValue?.trim()} loading={preview.isNoteSavePending}>
          Guardar
        </Button>
      </Group>
    </Stack>
  );
}
