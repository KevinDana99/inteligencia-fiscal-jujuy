"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition
} from "react";
import { TOAST_DASHBOARD_MESSAGES, toast } from "@/components/core/toasts";
import {
  addContributorToBatchAction,
  getBatchManagementAction,
} from "@/modules/batch-management/data/actions";
import type {
  IBatchAvailableCrosses,
  IBatchManagementItem
} from "@/modules/batch-management/data/models/BatchManagement";
import { useBatchManagementCrossFilters } from "@/modules/batch-management/presentation/hooks/batch-management/useBatchManagementCrossFilters";
import {
  buildBatchCrossExecutionPayloads,
  getBatchCrossValidationMessage,
  hasExecutableBatchCrosses,
  getEmptyExecutableBatchCrossMessage
} from "@/modules/batch-management/presentation/utils";
import { executeCrossAction } from "@/modules/cross-management/data/actions";
import {
  markReprocessingAction,
  unmarkReprocessingAction,
} from "@/modules/reprocessing/data/actions";
import type { IReprocessingMarkPayload } from "@/modules/reprocessing/data/models/Reprocessing";
import {
  createAlternateAddressAction,
  createContactAction,
  createNoteAction,
  deleteAlternateAddressAction,
  deleteContactAction,
  deleteNoteAction,
  getContactsAction,
  getNotesAction,
  updateContactAction,
  updateNoteAction,
  updateAlternateAddressAction,
} from "../../data/actions";
import { mapAlternateAddressRecordToViewModel } from "../../data/mappers/mapAlternateAddress";
import { mapContactRecordToViewModel } from "../../data/mappers/mapContact";
import { mapNoteRecordToViewModel } from "../../data/mappers/mapNote";
import type {
  IUnifiedRegisterAddress,
  IUnifiedRegisterBatchOption,
  IUnifiedRegisterContact,
  IUnifiedRegisterContactsListData,
  IUnifiedRegisterDetail,
  IUnifiedRegisterFinesListData,
  IUnifiedRegisterInterventionOrdersListData,
  IUnifiedRegisterNote,
  IUnifiedRegisterNotesListData,
  IUnifiedRegisterSourceTable,
} from "../../data/models/UnifiedRegister";
import { useUnifiedRegisterInterventionOrders } from "./useUnifiedRegisterInterventionOrders";
import { useUnifiedRegisterMercurio } from "./useUnifiedRegisterMercurio";

type HeaderModal = null | "reprocessing" | "crosses" | "report" | "batch";
type EditKind = null | "address" | "contact" | "note";
type DeleteKind = null | "address" | "contact" | "note";

type EditableItem =
  | IUnifiedRegisterAddress
  | IUnifiedRegisterContact
  | IUnifiedRegisterNote;
type ContactForm = {
  phone: string;
  mail: string;
  legal: string;
  accountant: string;
};

type UnifiedRegisterPreviewHydrationFlags = {
  addresses?: boolean;
  contacts?: boolean;
  notes?: boolean;
  mercurio?: boolean;
  interventionOrders?: boolean;
  availableCrosses?: boolean;
  reprocessing?: boolean;
};

type UseUnifiedRegisterPreviewParams = {
  item: IUnifiedRegisterDetail;
  initialAvailableCrosses: IBatchAvailableCrosses;
  initialIsReprocessing: boolean;
  initialContactsData: IUnifiedRegisterContactsListData | null;
  initialNotesData: IUnifiedRegisterNotesListData | null;
  initialMercurioData: IUnifiedRegisterFinesListData | null;
  initialInterventionOrdersData: IUnifiedRegisterInterventionOrdersListData | null;
  hydration?: UnifiedRegisterPreviewHydrationFlags;
};

const EMPTY_CONTACT_FORM: ContactForm = {
  phone: "",
  mail: "",
  legal: "",
  accountant: "",
};

const BATCH_OPTIONS_SEARCH_DEBOUNCE_MS = 250;

function mapBatchItemToLotOption(
  batch: IBatchManagementItem
): IUnifiedRegisterBatchOption {
  return {
    id: batch.id,
    label: batch.name,
    batchNumber: batch.batchNumber,
    regime: batch.regime,
    cuitCount: batch.cuitCount,
  };
}

export function useUnifiedRegisterPreview({
  item,
  initialAvailableCrosses,
  initialIsReprocessing,
  initialContactsData,
  initialNotesData,
  initialMercurioData,
  initialInterventionOrdersData,
  hydration = {},
}: UseUnifiedRegisterPreviewParams) {
  const crossFilters = useBatchManagementCrossFilters();
  const [activeHeaderModal, setActiveHeaderModal] = useState<HeaderModal>(null);
  const [crossExecutionError, setCrossExecutionError] = useState<string | null>(
    null
  );
  const [batchSearch, setBatchSearch] = useState("");
  const [lotOptions, setLotOptions] = useState<IUnifiedRegisterBatchOption[]>(
    item.lotOptions
  );
  const [batchOptionsError, setBatchOptionsError] = useState<string | null>(
    null
  );
  const [addToBatchError, setAddToBatchError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState(item.addresses);
  const [isAddressesHydrating, setIsAddressesHydrating] = useState(
    Boolean(hydration.addresses)
  );
  const [addressActionError, setAddressActionError] = useState<string | null>(
    null
  );
  const [contacts, setContacts] = useState(item.contacts);
  const [isContactsHydrating, setIsContactsHydrating] = useState(
    Boolean(hydration.contacts)
  );
  const [contactActionError, setContactActionError] = useState<string | null>(
    null
  );
  const [contactsCurrentPage, setContactsCurrentPage] = useState(
    initialContactsData?.pagina ?? 1
  );
  const [contactsTotalPages, setContactsTotalPages] = useState(
    initialContactsData?.totalPaginas ?? 0
  );
  const [notes, setNotes] = useState(item.notes);
  const [isNotesHydrating, setIsNotesHydrating] = useState(
    Boolean(hydration.notes)
  );
  const [noteActionError, setNoteActionError] = useState<string | null>(null);
  const [notesCurrentPage, setNotesCurrentPage] = useState(
    initialNotesData?.pagina ?? 1
  );
  const [notesTotalPages, setNotesTotalPages] = useState(
    initialNotesData?.totalPaginas ?? 0
  );
  const [reprocessingActionError, setReprocessingActionError] = useState<
    string | null
  >(null);
  const [availableCrosses, setAvailableCrosses] = useState(
    initialAvailableCrosses
  );
  const [isAvailableCrossesHydrating, setIsAvailableCrossesHydrating] =
    useState(Boolean(hydration.availableCrosses));
  const [isReprocessingMarked, setIsReprocessingMarked] = useState(
    initialIsReprocessing
  );
  const [isReprocessingHydrating, setIsReprocessingHydrating] = useState(
    Boolean(hydration.reprocessing)
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editKind, setEditKind] = useState<EditKind>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [formValue, setFormValue] = useState<string | null>(null);
  const [contactForm, setContactForm] =
    useState<ContactForm>(EMPTY_CONTACT_FORM);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteKind, setDeleteKind] = useState<DeleteKind>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [selectedLotOption, setSelectedLotOption] =
    useState<IUnifiedRegisterBatchOption | null>(null);
  const [activeSourceTableId, setActiveSourceTableId] =
    useState<IUnifiedRegisterSourceTable["id"]>("inm");
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);
  const [isAddressSavePending, startAddressSaveTransition] = useTransition();
  const [isAddressDeletePending, startAddressDeleteTransition] =
    useTransition();
  const [isContactsPagePending, startContactsPageTransition] = useTransition();
  const [isContactSavePending, startContactSaveTransition] = useTransition();
  const [isContactDeletePending, startContactDeleteTransition] =
    useTransition();
  const [isNotesPagePending, startNotesPageTransition] = useTransition();
  const [isNoteSavePending, startNoteSaveTransition] = useTransition();
  const [isNoteDeletePending, startNoteDeleteTransition] = useTransition();
  const [isReprocessingTogglePending, startReprocessingToggleTransition] =
    useTransition();
  const [isCrossExecutionPending, startCrossExecutionTransition] =
    useTransition();
  const [isBatchOptionsPending, startBatchOptionsTransition] = useTransition();
  const [isAddToBatchPending, startAddToBatchTransition] = useTransition();
  const latestBatchOptionsRequestIdRef = useRef(0);
  const mercurio = useUnifiedRegisterMercurio({
    contribuyenteId: item.contribuyenteId,
    initialData: initialMercurioData,
    initialFines: item.fines,
    waitForInitialPage: Boolean(hydration.mercurio),
  });
  const interventionOrdersList = useUnifiedRegisterInterventionOrders({
    contribuyenteId: item.contribuyenteId,
    initialData: initialInterventionOrdersData,
    initialInterventionOrders: item.interventionOrders,
    waitForInitialPage: Boolean(hydration.interventionOrders),
  });
  const {
    hydratePage: hydrateMercurioPage,
    hydrateError: hydrateMercurioError,
  } = mercurio;
  const {
    hydratePage: hydrateInterventionOrdersPage,
    hydrateError: hydrateInterventionOrdersError,
  } = interventionOrdersList;
  const crossTargetId = item.contribuyenteId;
  const currentCrossFilters = crossFilters.getBatchCrossFilters(crossTargetId);
  const crossValidationMessage =
    getBatchCrossValidationMessage(currentCrossFilters);
  const canConfirmCrosses =
    !isAvailableCrossesHydrating &&
    hasExecutableBatchCrosses(
      crossTargetId,
      currentCrossFilters,
      availableCrosses
    ) &&
    !crossValidationMessage &&
    !isCrossExecutionPending;

  const filteredLotOptions = useMemo(() => {
    const normalizedSearch = batchSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return lotOptions;
    }

    return lotOptions.filter((lot) => {
      return (
        lot.label.toLowerCase().includes(normalizedSearch) ||
        lot.batchNumber?.toLowerCase().includes(normalizedSearch) ||
        lot.regime.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [batchSearch, lotOptions]);

  useEffect(() => {
    if (activeHeaderModal !== "batch") {
      return;
    }

    const requestId = latestBatchOptionsRequestIdRef.current + 1;
    latestBatchOptionsRequestIdRef.current = requestId;

    const timeoutId = setTimeout(
      () => {
        startBatchOptionsTransition(() => {
          void (async () => {
            const result = await getBatchManagementAction({
              search: batchSearch.trim() || null,
              page: 1,
              itemsPerPage: 20,
            });

            if (latestBatchOptionsRequestIdRef.current !== requestId) {
              return;
            }

            if (!result.data) {
              setBatchOptionsError(
                result.error ?? "No fue posible listar los lotes."
              );
              return;
            }

            setLotOptions(result.data.batches.map(mapBatchItemToLotOption));
            setBatchOptionsError(null);
          })();
        });
      },
      batchSearch.trim() ? BATCH_OPTIONS_SEARCH_DEBOUNCE_MS : 0
    );

    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeHeaderModal, batchSearch]);

  const activeSourceTable =
    item.sourceTables.find((table) => table.id === activeSourceTableId) ??
    item.sourceTables[0];

  const activeNote = notes[activeNoteIndex] ?? null;

  const applyContactsListData = useCallback((
    data: IUnifiedRegisterContactsListData
  ) => {
    setContacts(data.contactos.flatMap(mapContactRecordToViewModel));
    setContactsCurrentPage(data.pagina);
    setContactsTotalPages(data.totalPaginas);
  }, []);

  const refreshContacts = async (page: number) => {
    const result = await getContactsAction(item.contribuyenteId, {
      pagina: page,
      itemsPagina: 1,
    });

    if (!result.data) {
      setContactActionError(
        result.error ?? "No fue posible listar los contactos."
      );
      return false;
    }

    applyContactsListData(result.data);
    setContactActionError(null);
    return true;
  };

  const applyNotesListData = useCallback((data: IUnifiedRegisterNotesListData) => {
    setNotes(data.notas.map(mapNoteRecordToViewModel));
    setNotesCurrentPage(data.pagina);
    setNotesTotalPages(data.totalPaginas);
    setActiveNoteIndex(0);
  }, []);

  const refreshNotes = async (page: number) => {
    const result = await getNotesAction(item.contribuyenteId, {
      pagina: page,
      itemsPagina: 1,
    });

    if (!result.data) {
      setNoteActionError(result.error ?? "No fue posible listar las notas.");
      return false;
    }

    applyNotesListData(result.data);
    setNoteActionError(null);
    return true;
  };

  const hydrateAvailableCrosses = useCallback(
    (nextAvailableCrosses: IBatchAvailableCrosses) => {
      setAvailableCrosses(nextAvailableCrosses);
      setIsAvailableCrossesHydrating(false);
    },
    []
  );

  const hydrateReprocessingState = useCallback(
    (nextIsReprocessingMarked: boolean) => {
      setIsReprocessingMarked(nextIsReprocessingMarked);
      setIsReprocessingHydrating(false);
    },
    []
  );

  const hydrateAddresses = useCallback(
    (nextAddresses: IUnifiedRegisterAddress[], error?: string | null) => {
      setAddresses(nextAddresses);
      setAddressActionError(error ?? null);
      setIsAddressesHydrating(false);
    },
    []
  );

  const hydrateContacts = useCallback(
    (data: IUnifiedRegisterContactsListData | null, error?: string | null) => {
      if (data) {
        applyContactsListData(data);
      } else {
        setContacts([]);
        setContactsCurrentPage(1);
        setContactsTotalPages(0);
      }

      setContactActionError(error ?? null);
      setIsContactsHydrating(false);
    },
    [applyContactsListData]
  );

  const hydrateNotes = useCallback(
    (data: IUnifiedRegisterNotesListData | null, error?: string | null) => {
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
    },
    [applyNotesListData]
  );

  const hydrateMercurio = useCallback(
    (data: IUnifiedRegisterFinesListData | null, error?: string | null) => {
      if (data) {
        hydrateMercurioPage(data);
        return;
      }

      hydrateMercurioError(
        error ?? 'No fue posible listar las multas Mercurio.'
      );
    },
    [hydrateMercurioError, hydrateMercurioPage]
  );

  const hydrateInterventionOrders = useCallback(
    (
      data: IUnifiedRegisterInterventionOrdersListData | null,
      error?: string | null
    ) => {
      if (data) {
        hydrateInterventionOrdersPage(data);
        return;
      }

      hydrateInterventionOrdersError(
        error ?? 'No fue posible listar las órdenes de intervención.'
      );
    },
    [hydrateInterventionOrdersError, hydrateInterventionOrdersPage]
  );
  const previewHydration = useMemo(
    () => ({
      hydrateAvailableCrosses,
      hydrateReprocessingState,
      hydrateAddresses,
      hydrateContacts,
      hydrateNotes,
      hydrateMercurio,
      hydrateInterventionOrders,
    }),
    [
      hydrateAddresses,
      hydrateAvailableCrosses,
      hydrateContacts,
      hydrateInterventionOrders,
      hydrateMercurio,
      hydrateNotes,
      hydrateReprocessingState,
    ]
  );

  const openHeaderModal = (modal: HeaderModal) => {
    if (modal === "reprocessing") {
      setReprocessingActionError(null);
    }

    if (modal === "batch") {
      setBatchOptionsError(null);
      setAddToBatchError(null);
    }

    if (modal === "crosses") {
      setCrossExecutionError(null);
    }

    setActiveHeaderModal(modal);
  };

  const closeHeaderModal = () => {
    setActiveHeaderModal(null);
    setBatchSearch("");
    setReprocessingActionError(null);
    setBatchOptionsError(null);
    setCrossExecutionError(null);
  };

  const toggleCrossSection = (section: "monthly" | "annual") => {
    setCrossExecutionError(null);
    crossFilters.toggleBatchCrossSection(crossTargetId, section);
  };

  const setCrossYear = (
    section: "monthly" | "annual",
    field: "fromYear" | "toYear",
    value: string | null
  ) => {
    setCrossExecutionError(null);
    crossFilters.setBatchCrossYear(crossTargetId, section, field, value);
  };

  const setCrossMonth = (
    field: "fromMonth" | "toMonth",
    value: string | null
  ) => {
    setCrossExecutionError(null);
    crossFilters.setBatchCrossMonth(crossTargetId, field, value);
  };

  const toggleCrossType = (
    section: "monthly" | "annual",
    crossType: string
  ) => {
    setCrossExecutionError(null);
    crossFilters.toggleBatchCrossType(crossTargetId, section, crossType);
  };

  const confirmCrossExecution = async () => {
    if (crossValidationMessage) {
      setCrossExecutionError(crossValidationMessage);
      return false;
    }

    const payloads = buildBatchCrossExecutionPayloads(
      crossTargetId,
      currentCrossFilters,
      availableCrosses
    );

    if (!payloads.length) {
      setCrossExecutionError(
        getEmptyExecutableBatchCrossMessage(availableCrosses)
      );
      return false;
    }

    setCrossExecutionError(null);

    return await new Promise<boolean>((resolve) => {
      startCrossExecutionTransition(() => {
        void (async () => {
          const results = await Promise.all(
            payloads.map((payload) =>
              executeCrossAction({
                crossCode: payload.crossCode,
                crossVersion: payload.crossVersion,
                originType: "individual",
                batchId: null,
                contributorId: item.contribuyenteId,
                periodFrom: payload.periodFrom,
                periodTo: payload.periodTo,
                parameters: payload.parameters ?? {},
              })
            )
          );
          const failedResult = results.find(
            (result) => !result.success || !result.data
          );

          if (failedResult) {
            setCrossExecutionError(
              failedResult.error ?? "No fue posible ejecutar el cruce."
            );
            resolve(false);
            return;
          }

          closeHeaderModal();
          resolve(true);
        })();
      });
    });
  };

  const toggleReprocessing = () => {
    setReprocessingActionError(null);

    if (!isReprocessingMarked) {
      setActiveHeaderModal("reprocessing");
      return;
    }

    startReprocessingToggleTransition(() => {
      void (async () => {
        const result = await unmarkReprocessingAction(item.contribuyenteId);

        if (!result.success) {
          setReprocessingActionError(
            result.error ?? "No fue posible quitar el CUIT de reproceso."
          );
          return;
        }

        setIsReprocessingMarked(false);
        toast.show(TOAST_DASHBOARD_MESSAGES.REMOVE_REPROCESSING_SUCCESS);
      })();
    });
  };

  const confirmReprocessing = async (payload: IReprocessingMarkPayload) => {
    setReprocessingActionError(null);
    const reprocessingPayload: IReprocessingMarkPayload = {
      contribuyenteId: item.contribuyenteId,
      description: payload.description?.trim() || null,
    };

    console.log({
      action: "vista-previa-padron.markReprocessing",
      cuitMostrado: item.cuit,
      contribuyenteIdEnviado: reprocessingPayload.contribuyenteId,
    });

    const result = await markReprocessingAction(reprocessingPayload);

    if (!result.success) {
      const errorMessage =
        result.error ?? "No fue posible marcar el CUIT en reproceso.";

      setReprocessingActionError(errorMessage);
      throw new Error(errorMessage);
    }

    setIsReprocessingMarked(true);
    toast.show(TOAST_DASHBOARD_MESSAGES.SEND_REPROCESSING_ERROR);
  };

  const selectLotOption = (lot: IUnifiedRegisterBatchOption) => {
    setSelectedLotOption(lot);
    setActiveHeaderModal(null);
    setBatchSearch("");
  };

  const closeLotConfirmModal = () => {
    if (isAddToBatchPending) {
      return;
    }

    setSelectedLotOption(null);
    setAddToBatchError(null);
  };

  const confirmLotSelection = () => {
    if (!selectedLotOption || isAddToBatchPending) {
      return;
    }

    const lotOption = selectedLotOption;

    setAddToBatchError(null);

    startAddToBatchTransition(() => {
      void (async () => {
        const result = await addContributorToBatchAction({
          batchId: lotOption.id,
          contributor: {
            cuit: item.cuit,
            businessName: item.businessName,
            regime: item.regime,
          },
        });

        if (!result.success) {
          setAddToBatchError(
            result.error ?? "No fue posible agregar el CUIT al lote."
          );
          return;
        }

        setLotOptions((current) =>
          current.map((option) =>
            option.id === lotOption.id
              ? { ...option, cuitCount: option.cuitCount + 1 }
              : option
          )
        );
        toast.show(TOAST_DASHBOARD_MESSAGES.ADD_TO_BATCH_SUCCESS, {
          name: lotOption.label,
        });
        setSelectedLotOption(null);
      })();
    });
  };

  const openCreateModal = (kind: Exclude<EditKind, null>) => {
    setIsEditModalOpen(true);
    setEditKind(kind);
    setEditingItemId(null);
    setFormValue(null);
    setAddressActionError(null);
    setContactActionError(null);
    setNoteActionError(null);
    setContactForm(
      kind === "contact" ? EMPTY_CONTACT_FORM : EMPTY_CONTACT_FORM
    );
  };

  const openEditModal = (
    kind: Exclude<EditKind, null>,
    itemToEdit: EditableItem
  ) => {
    setIsEditModalOpen(true);
    setEditKind(kind);
    setEditingItemId(
      kind === "contact"
        ? (itemToEdit as IUnifiedRegisterContact).recordId ?? itemToEdit.id
        : itemToEdit.id
    );
    setAddressActionError(null);
    setContactActionError(null);
    setNoteActionError(null);
    if (kind === "contact") {
      setContactForm({
        phone: contacts.find((entry) => entry.id === "phone")?.value ?? "",
        mail: contacts.find((entry) => entry.id === "mail")?.value ?? "",
        legal: contacts.find((entry) => entry.id === "legal")?.value ?? "",
        accountant:
          contacts.find((entry) => entry.id === "accountant")?.value ?? "",
      });
      return;
    }
    if ("text" in itemToEdit) {
      setFormValue(itemToEdit.text);
      return;
    }
    setFormValue(
      "address" in itemToEdit ? itemToEdit.address : itemToEdit.value
    );
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const resetEditModal = () => {
    setIsEditModalOpen(false);
    setEditKind(null);
    setEditingItemId(null);
    setFormValue(null);
    setAddressActionError(null);
    setContactActionError(null);
    setNoteActionError(null);
    setContactForm(EMPTY_CONTACT_FORM);
  };

  const submitEditModal = () => {
    if (!editKind) {
      return;
    }

    if (editKind !== "contact" && !formValue?.trim()) {
      return;
    }

    if (editKind === "address") {
      const normalizedDireccion = formValue?.trim() ?? "";
      setAddressActionError(null);

      startAddressSaveTransition(async () => {
        const result = editingItemId
          ? await updateAlternateAddressAction(
              item.contribuyenteId,
              editingItemId,
              {
                direccion: normalizedDireccion,
              }
            )
          : await createAlternateAddressAction(item.contribuyenteId, {
              direccion: normalizedDireccion,
            });

        if (!result.success || !result.data) {
          setAddressActionError(
            result.error ?? "No fue posible guardar el domicilio alternativo."
          );
          return;
        }

        const nextAddress = mapAlternateAddressRecordToViewModel(result.data);

        setAddresses((current) =>
          editingItemId
            ? current.map((entry) =>
                entry.id === editingItemId ? nextAddress : entry
              )
            : [...current, nextAddress]
        );

        if (editingItemId) {
          toast.show(TOAST_DASHBOARD_MESSAGES.UPDATE_ADDRESS_SUCCESS);
        } else {
          toast.show(TOAST_DASHBOARD_MESSAGES.ADD_ADDRESS_SUCCESS);
        }

        resetEditModal();
      });

      return;
    }

    if (editKind === "contact") {
      setContactActionError(null);

      startContactSaveTransition(async () => {
        const payload = {
          telefono: contactForm.phone,
          correo: contactForm.mail,
          nombreRepresentanteLegal: contactForm.legal,
          nombreContador: contactForm.accountant,
        };

        const result = editingItemId
          ? await updateContactAction(
              item.contribuyenteId,
              editingItemId,
              payload
            )
          : await createContactAction(item.contribuyenteId, payload);

        if (!result.success) {
          setContactActionError(
            result.error ?? "No fue posible guardar el contacto."
          );
          return;
        }

        const refreshed = await refreshContacts(
          editingItemId ? contactsCurrentPage : 1
        );

        if (editingItemId) {
          toast.show(TOAST_DASHBOARD_MESSAGES.UPDATE_CONTACT_SUCCESS);
        } else {
          toast.show(TOAST_DASHBOARD_MESSAGES.ADD_CONTACT_SUCCESS);
        }
        if (refreshed) {
          resetEditModal();
        }
      });

      return;
    }

    if (editKind === "note") {
      const nextNoteText = formValue?.trim() ?? "";
      setNoteActionError(null);

      startNoteSaveTransition(async () => {
        const result = editingItemId
          ? await updateNoteAction(item.contribuyenteId, editingItemId, {
              descripcion: nextNoteText,
            })
          : await createNoteAction(item.contribuyenteId, {
              descripcion: nextNoteText,
            });

        if (!result.success) {
          setNoteActionError(result.error ?? "No fue posible guardar la nota.");
          return;
        }

        const refreshed = await refreshNotes(
          editingItemId ? notesCurrentPage : 1
        );

        if (editingItemId) {
          toast.show(TOAST_DASHBOARD_MESSAGES.UPDATE_NOTE_SUCCESS);
        } else {
          toast.show(TOAST_DASHBOARD_MESSAGES.ADD_NOTE_SUCCESS);
        }
        if (refreshed) {
          resetEditModal();
        }
      });

      return;
    }

    closeEditModal();
  };

  const openDeleteModal = (kind: Exclude<DeleteKind, null>, itemId: string) => {
    setIsDeleteModalOpen(true);
    setDeleteKind(kind);
    setDeletingItemId(itemId);
    setAddressActionError(null);
    setContactActionError(null);
    setNoteActionError(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const setContactField = (field: keyof ContactForm, value: string) => {
    setContactForm((current) => ({ ...current, [field]: value }));
  };

  const resetDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteKind(null);
    setDeletingItemId(null);
    setAddressActionError(null);
    setContactActionError(null);
    setNoteActionError(null);
  };

  const removeNote = (noteId: string) => {
    setNotes((current) => {
      const next = current.filter((entry) => entry.id !== noteId);
      setActiveNoteIndex((index) =>
        Math.max(0, Math.min(index, next.length - 1))
      );
      return next;
    });
  };

  const goToPreviousNote = () => {
    if (notesCurrentPage <= 1) {
      return;
    }

    startNotesPageTransition(async () => {
      await refreshNotes(notesCurrentPage - 1);
    });
  };

  const goToNextNote = () => {
    if (notesCurrentPage >= notesTotalPages) {
      return;
    }

    startNotesPageTransition(async () => {
      await refreshNotes(notesCurrentPage + 1);
    });
  };

  const goToPreviousContactPage = () => {
    if (contactsCurrentPage <= 1) {
      return;
    }

    startContactsPageTransition(async () => {
      await refreshContacts(contactsCurrentPage - 1);
    });
  };

  const goToNextContactPage = () => {
    if (contactsCurrentPage >= contactsTotalPages) {
      return;
    }

    startContactsPageTransition(async () => {
      await refreshContacts(contactsCurrentPage + 1);
    });
  };

  const confirmDeleteModal = () => {
    if (!deleteKind || !deletingItemId) {
      return;
    }

    if (deleteKind === "address") {
      setAddressActionError(null);

      startAddressDeleteTransition(async () => {
        const result = await deleteAlternateAddressAction(
          item.contribuyenteId,
          deletingItemId
        );

        if (!result.success) {
          setAddressActionError(
            result.error ?? "No fue posible eliminar el domicilio alternativo."
          );
          return;
        }

        setAddresses((current) =>
          current.filter((entry) => entry.id !== deletingItemId)
        );
        toast.show(TOAST_DASHBOARD_MESSAGES.DELETE_ADDRESS_ERROR);
        resetDeleteModal();
      });

      return;
    }

    if (deleteKind === "contact") {
      setContactActionError(null);

      startContactDeleteTransition(async () => {
        const targetPage =
          contactsCurrentPage > 1 && contacts.length > 0
            ? contactsCurrentPage - 1
            : contactsCurrentPage;

        const result = await deleteContactAction(
          item.contribuyenteId,
          deletingItemId
        );

        if (!result.success) {
          setContactActionError(
            result.error ?? "No fue posible eliminar el contacto."
          );
          return;
        }

        const refreshed = await refreshContacts(targetPage);

        toast.show(TOAST_DASHBOARD_MESSAGES.DELETE_CONTACT_ERROR);
        if (refreshed) {
          resetDeleteModal();
        }
      });

      return;
    }

    if (deleteKind === "note") {
      setNoteActionError(null);

      startNoteDeleteTransition(async () => {
        const targetPage =
          notesCurrentPage > 1 && notes.length === 1
            ? notesCurrentPage - 1
            : notesCurrentPage;

        const result = await deleteNoteAction(
          item.contribuyenteId,
          deletingItemId
        );

        if (!result.success) {
          setNoteActionError(result.error ?? "No fue posible borrar la nota.");
          return;
        }

        const refreshed = await refreshNotes(targetPage);
        toast.show(TOAST_DASHBOARD_MESSAGES.DELETE_NOTE_ERROR);
        if (refreshed) {
          resetDeleteModal();
        }
      });

      return;
    }

    closeDeleteModal();
  };

  return {
    activeHeaderModal,
    addresses,
    addressActionError,
    isAddressesHydrating,
    contacts,
    contactActionError,
    contactsCurrentPage,
    contactsTotalPages,
    isContactsHydrating,
    notes,
    noteActionError,
    notesCurrentPage,
    notesTotalPages,
    isNotesHydrating,
    fines: mercurio.fines,
    finesCurrentPage: mercurio.currentPage,
    finesTotalPages: mercurio.totalPages,
    finesTotalItems: mercurio.totalItems,
    fineActionError: mercurio.error,
    interventionOrders: interventionOrdersList.interventionOrders,
    interventionOrdersCurrentPage: interventionOrdersList.currentPage,
    interventionOrdersTotalPages: interventionOrdersList.totalPages,
    interventionOrdersTotalItems: interventionOrdersList.totalItems,
    interventionOrdersError: interventionOrdersList.error,
    reprocessingActionError,
    availableCrosses,
    isAvailableCrossesHydrating,
    crossFilters: currentCrossFilters,
    crossValidationMessage,
    crossExecutionError,
    batchOptionsError,
    addToBatchError,
    isReprocessingMarked,
    isReprocessingHydrating,
    batchSearch,
    filteredLotOptions,
    activeSourceTableId,
    activeSourceTable,
    selectedLotOption,
    activeNote,
    activeNoteIndex,
    isEditModalOpen,
    isDeleteModalOpen,
    editKind,
    deleteKind,
    isAddressSavePending,
    isAddressDeletePending,
    isContactsPagePending,
    isContactSavePending,
    isContactDeletePending,
    isNotesPagePending,
    isFinesPagePending: mercurio.isPagePending,
    isInterventionOrdersPagePending: interventionOrdersList.isPagePending,
    isNoteSavePending,
    isNoteDeletePending,
    isReprocessingTogglePending,
    isCrossExecutionPending,
    isBatchOptionsPending,
    isAddToBatchPending,
    canConfirmCrosses,
    formValue,
    contactForm,
    editingItemId,
    setBatchSearch,
    setActiveSourceTableId,
    setFormValue,
    setContactField,
    openHeaderModal,
    closeHeaderModal,
    toggleReprocessing,
    toggleCrossSection,
    setCrossYear,
    setCrossMonth,
    toggleCrossType,
    confirmCrossExecution,
    confirmReprocessing,
    selectLotOption,
    closeLotConfirmModal,
    confirmLotSelection,
    openCreateModal,
    openEditModal,
    closeEditModal,
    resetEditModal,
    submitEditModal,
    openDeleteModal,
    closeDeleteModal,
    resetDeleteModal,
    confirmDeleteModal,
    removeNote,
    goToPreviousContactPage,
    goToNextContactPage,
    goToPreviousNote,
    goToNextNote,
    goToPreviousFinePage: mercurio.goToPreviousPage,
    goToNextFinePage: mercurio.goToNextPage,
    goToPreviousInterventionOrderPage: interventionOrdersList.goToPreviousPage,
    goToNextInterventionOrderPage: interventionOrdersList.goToNextPage,
    hydration: previewHydration,
  };
}
