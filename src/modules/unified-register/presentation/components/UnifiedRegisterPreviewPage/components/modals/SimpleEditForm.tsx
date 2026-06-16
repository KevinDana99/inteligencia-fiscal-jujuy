import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { getEditModalMeta } from '../../../../utils/unifiedRegisterPreviewModals';
import type { PreviewController } from '../../types';
import classes from '../../UnifiedRegisterPreviewPage.module.css';

type SimpleEditFormProps = {
  preview: PreviewController;
};

export function SimpleEditForm({ preview }: SimpleEditFormProps) {
  const meta = getEditModalMeta(preview.editKind, preview.editingItemId);

  if (!preview.editKind) {
    return null;
  }

  return (
    <Stack gap="md">
      <TextInput
        classNames={{ label: classes.modalInputLabel, input: classes.modalInputField }}
        label={meta.label}
        value={preview.formValue ?? ''}
        onChange={(event) => preview.setFormValue(event.currentTarget.value)}
        placeholder={meta.placeholder}
      />
      {preview.editKind === 'address' && preview.addressActionError ? (
        <Text className={classes.modalText} c="red">{preview.addressActionError}</Text>
      ) : null}
      <Group justify="flex-end">
        <Button variant="default" radius="xl" className={`${classes.modalGhostButton} ${classes.staticButton}`} onClick={preview.closeEditModal} disabled={preview.editKind === 'address' && preview.isAddressSavePending}>
          Cancelar
        </Button>
        <Button radius="xl" className={`${classes.modalPrimaryButton} ${classes.staticButton}`} onClick={preview.submitEditModal} disabled={!preview.formValue?.trim()} loading={preview.editKind === 'address' && preview.isAddressSavePending}>
          Guardar
        </Button>
      </Group>
    </Stack>
  );
}
