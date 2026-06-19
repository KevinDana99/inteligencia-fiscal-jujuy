import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { isContactFormEmpty } from '../../../../utils/unifiedRegisterPreviewModals';
import type { PreviewController } from '../../types';
import classes from '../../UnifiedRegisterPreviewPage.module.css';

type ContactEditFormProps = {
  preview: PreviewController;
};

const CONTACT_FIELDS = [
  ['phone', 'Teléfono', '+5388 000-0000'],
  ['mail', 'Mail', 'correo@ejemplo.com'],
  ['legal', 'Representante legal', 'Nombre completo'],
  ['accountant', 'Contador', 'Nombre o estudio']
] as const;

export function ContactEditForm({ preview }: ContactEditFormProps) {
  return (
    <Stack gap={0}>
      <div className={classes.contactModalFields}>
        {CONTACT_FIELDS.map(([field, label, placeholder]) => (
          <div key={field}>
            <Text className={classes.contactModalLabel}>
              {label} <span className={classes.contactModalOptional}>(opcional)</span>
            </Text>
            <TextInput
              classNames={{ input: classes.modalInputField }}
              value={preview.contactForm[field]}
              onChange={(event) => preview.setContactField(field, event.currentTarget.value)}
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>
      {preview.contactActionError ? (
        <Text className={classes.modalText} c="red">{preview.contactActionError}</Text>
      ) : null}
      <Group justify="flex-end" gap="sm" className={classes.contactModalFooter}>
        <Button
          variant="default"
          radius="xl"
          className={`${classes.modalGhostButton} ${classes.staticButton}`}
          onClick={preview.closeEditModal}
          disabled={preview.isContactSavePending}
        >
          Cancelar
        </Button>
        <Button
          radius="xl"
          className={`${classes.modalPrimaryButton} ${classes.staticButton}`}
          onClick={preview.submitEditModal}
          disabled={isContactFormEmpty(preview.contactForm)}
          loading={preview.isContactSavePending}
        >
          Guardar
        </Button>
      </Group>
    </Stack>
  );
}
