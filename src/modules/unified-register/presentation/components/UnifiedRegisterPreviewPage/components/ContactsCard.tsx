import { Button, Text } from '@mantine/core';
import type { IUnifiedRegisterContact } from '../../../../data/models/UnifiedRegister';
import type { PreviewController } from '../types';
import { Pager } from './shared/Pager';
import { SectionCard } from './shared/SectionCard';
import classes from '../UnifiedRegisterPreviewPage.module.css';

type ContactsCardProps = {
  preview: PreviewController;
};

export function ContactsCard({ preview }: ContactsCardProps) {
  const firstContact = preview.contacts[0];

  return (
    <SectionCard
      title="Contactos"
      action={<AddButton onClick={() => preview.openCreateModal('contact')} />}
      footer={
        <Pager
          current={preview.contactsTotalPages ? preview.contactsCurrentPage : 0}
          total={Math.max(preview.contactsTotalPages, 1)}
          onPrevious={preview.goToPreviousContactPage}
          onNext={preview.goToNextContactPage}
          disabled={
            preview.isContactsHydrating ||
            preview.isContactsPagePending ||
            preview.contactsTotalPages <= 1
          }
        />
      }
    >
      <div className={classes.highlightPanel}>
        <ContactActions contact={firstContact} preview={preview} />
        <div className={classes.contactsList}>
          {preview.contacts.map((contact) => (
            <ContactItem key={`${contact.recordId ?? 'contact'}-${contact.id}`} contact={contact} />
          ))}
        </div>
        {preview.isContactsHydrating ? (
          <Text className={classes.emptyStateText}>Cargando contactos...</Text>
        ) : !preview.contacts.length ? (
          <Text className={classes.emptyStateText}>No hay contactos cargados.</Text>
        ) : null}
        {preview.contactActionError ? (
          <Text className={classes.modalText} c="red">{preview.contactActionError}</Text>
        ) : null}
      </div>
    </SectionCard>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="light" color="blue" radius="md" size="xs" className={`${classes.inlineAddButton} ${classes.staticButton}`} onClick={onClick}>
      + Agregar
    </Button>
  );
}

function ContactActions({
  contact,
  preview
}: {
  contact?: IUnifiedRegisterContact;
  preview: PreviewController;
}) {
  if (!contact) {
    return <div className={classes.inlineActionRow} />;
  }

  return (
    <div className={classes.inlineActionRow}>
      <button className={classes.editLink} onClick={() => preview.openEditModal('contact', contact)}>Editar</button>
      <button className={classes.deleteLink} onClick={() => preview.openDeleteModal('contact', contact.recordId ?? contact.id)}>Eliminar</button>
    </div>
  );
}

function ContactItem({ contact }: { contact: IUnifiedRegisterContact }) {
  return (
    <div className={classes.contactItem}>
      <Text className={classes.contactLabel}>{contact.label}</Text>
      <Text className={classes.contactValue}>{contact.value}</Text>
    </div>
  );
}
