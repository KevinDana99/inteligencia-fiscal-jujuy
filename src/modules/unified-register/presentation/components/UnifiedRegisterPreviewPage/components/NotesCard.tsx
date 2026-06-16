import { Button, Text } from '@mantine/core';
import type { PreviewController } from '../types';
import { Pager } from './shared/Pager';
import { SectionCard } from './shared/SectionCard';
import classes from '../UnifiedRegisterPreviewPage.module.css';

type NotesCardProps = {
  preview: PreviewController;
};

export function NotesCard({ preview }: NotesCardProps) {
  return (
    <SectionCard
      title="Notas internas"
      action={<AddButton onClick={() => preview.openCreateModal('note')} />}
      footer={
        <Pager
          current={preview.notesTotalPages ? preview.notesCurrentPage : 0}
          total={Math.max(preview.notesTotalPages, 1)}
          onPrevious={preview.goToPreviousNote}
          onNext={preview.goToNextNote}
          disabled={preview.isNotesHydrating || preview.isNotesPagePending || preview.notesTotalPages <= 1}
        />
      }
    >
      <div className={classes.highlightPanel}>
        {preview.isNotesHydrating ? (
          <Text className={classes.emptyStateText}>Cargando notas...</Text>
        ) : preview.activeNote ? (
          <>
            <div className={classes.inlineActionRow}>
              <button className={classes.editLink} onClick={() => preview.openEditModal('note', preview.activeNote!)}>Editar</button>
              <button className={classes.deleteLink} onClick={() => preview.openDeleteModal('note', preview.activeNote!.id)}>Eliminar</button>
            </div>
            <Text className={classes.noteText}>{preview.activeNote.text}</Text>
          </>
        ) : (
          <Text className={classes.emptyStateText}>No hay notas cargadas.</Text>
        )}
        {preview.noteActionError ? (
          <Text className={classes.modalText} c="red">{preview.noteActionError}</Text>
        ) : null}
      </div>
    </SectionCard>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="light" color="blue" radius="md" size="xs" className={`${classes.inlineAddButton} ${classes.staticButton}`} onClick={onClick}>
      + Nota
    </Button>
  );
}
