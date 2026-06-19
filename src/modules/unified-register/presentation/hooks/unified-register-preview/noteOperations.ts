import {
  createNoteAction,
  deleteNoteAction,
  getNotesAction,
  updateNoteAction
} from '../../../data/actions';

export async function loadNotesPage(contributorId: string, page: number) {
  return getNotesAction(contributorId, {
    pagina: page,
    itemsPagina: 1
  });
}

export async function saveNoteRecord(
  contributorId: string,
  editingItemId: string | null,
  text: string
) {
  return editingItemId
    ? updateNoteAction(contributorId, editingItemId, { descripcion: text })
    : createNoteAction(contributorId, { descripcion: text });
}

export async function deleteNoteRecord(contributorId: string, noteId: string) {
  return deleteNoteAction(contributorId, noteId);
}
