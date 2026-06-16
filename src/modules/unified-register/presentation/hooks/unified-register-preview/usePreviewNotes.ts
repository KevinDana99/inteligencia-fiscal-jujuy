'use client';

import { useCallback, useState, useTransition } from 'react';
import { TOAST_DASHBOARD_MESSAGES, toast } from '@/components/core/toasts';
import { mapNoteRecordToViewModel } from '../../../data/mappers/mapNote';
import type { IUnifiedRegisterNote, IUnifiedRegisterNotesListData } from '../../../data/models/UnifiedRegister';
import {
  deleteNoteRecord,
  loadNotesPage,
  saveNoteRecord
} from './noteOperations';

type UsePreviewNotesParams = { contributorId: string; initialNotes: IUnifiedRegisterNote[]; initialNotesData: IUnifiedRegisterNotesListData | null; shouldHydrateOnMount?: boolean; };

export function usePreviewNotes({
  contributorId,
  initialNotes,
  initialNotesData,
  shouldHydrateOnMount = false
}: UsePreviewNotesParams) {
  const [notes, setNotes] = useState(initialNotes);
  const [isNotesHydrating, setIsNotesHydrating] = useState(shouldHydrateOnMount);
  const [noteActionError, setNoteActionError] = useState<string | null>(null);
  const [notesCurrentPage, setNotesCurrentPage] = useState(
    initialNotesData?.pagina ?? 1
  );
  const [notesTotalPages, setNotesTotalPages] = useState(
    initialNotesData?.totalPaginas ?? 0
  );
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);
  const [isNotesPagePending, startNotesPageTransition] = useTransition();
  const [isNoteSavePending, startNoteSaveTransition] = useTransition();
  const [isNoteDeletePending, startNoteDeleteTransition] = useTransition();
  const activeNote = notes[activeNoteIndex] ?? null;

  const applyNotesListData = useCallback((data: IUnifiedRegisterNotesListData) => {
    setNotes(data.notas.map(mapNoteRecordToViewModel));
    setNotesCurrentPage(data.pagina);
    setNotesTotalPages(data.totalPaginas);
    setActiveNoteIndex(0);
  }, []);

  const refreshNotes = async (page: number) => {
    const result = await loadNotesPage(contributorId, page);

    if (!result.data) {
      setNoteActionError(result.error ?? 'No fue posible listar las notas.');
      return false;
    }

    applyNotesListData(result.data);
    setNoteActionError(null);
    return true;
  };

  const hydrateNotes = (
    data: IUnifiedRegisterNotesListData | null,
    error?: string | null
  ) => {
    if (data) {
      applyNotesListData(data);
    } else {
      setNotes([]);
      setNotesCurrentPage(1);
      setNotesTotalPages(0);
      setActiveNoteIndex(0);
    }

    setNoteActionError(error ?? null);
    setIsNotesHydrating(false);
  };

  const saveNote = (
    editingItemId: string | null,
    text: string,
    onSuccess: () => void
  ) => {
    const nextNoteText = text.trim();

    if (!nextNoteText) {
      return;
    }

    setNoteActionError(null);
    startNoteSaveTransition(async () => {
      const result = await saveNoteRecord(
        contributorId,
        editingItemId,
        nextNoteText
      );

      if (!result.success) {
        setNoteActionError(result.error ?? 'No fue posible guardar la nota.');
        return;
      }

      const refreshed = await refreshNotes(editingItemId ? notesCurrentPage : 1);
      toast.show(
        editingItemId
          ? TOAST_DASHBOARD_MESSAGES.UPDATE_NOTE_SUCCESS
          : TOAST_DASHBOARD_MESSAGES.ADD_NOTE_SUCCESS
      );
      if (refreshed) {
        onSuccess();
      }
    });
  };

  const deleteNote = (noteId: string, onSuccess: () => void) => {
    setNoteActionError(null);
    startNoteDeleteTransition(async () => {
      const targetPage =
        notesCurrentPage > 1 && notes.length === 1
          ? notesCurrentPage - 1
          : notesCurrentPage;
      const result = await deleteNoteRecord(contributorId, noteId);

      if (!result.success) {
        setNoteActionError(result.error ?? 'No fue posible borrar la nota.');
        return;
      }

      const refreshed = await refreshNotes(targetPage);
      toast.show(TOAST_DASHBOARD_MESSAGES.DELETE_NOTE_ERROR);
      if (refreshed) {
        onSuccess();
      }
    });
  };

  const goToPreviousNote = () => {
    if (notesCurrentPage > 1) {
      startNotesPageTransition(() => { void refreshNotes(notesCurrentPage - 1); });
    }
  };

  const goToNextNote = () => {
    if (notesCurrentPage < notesTotalPages) {
      startNotesPageTransition(() => { void refreshNotes(notesCurrentPage + 1); });
    }
  };

  return {
    notes, activeNote, noteActionError, notesCurrentPage,
    notesTotalPages, isNotesHydrating, isNotesPagePending, isNoteSavePending,
    isNoteDeletePending, setNoteActionError, hydrateNotes, saveNote, deleteNote,
    goToPreviousNote, goToNextNote
  };
}
