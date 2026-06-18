'use client';

import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import type { IUnifiedRegisterListData } from '../../../data/models/UnifiedRegister';
import { SendToReprocessingModal } from '@/modules/reprocessing/presentation/components';
import { UnifiedRegisterEmptyState } from '../UnifiedRegisterEmptyState';
import { UnifiedRegisterList } from '../UnifiedRegisterList';
import { UnifiedRegisterPagination } from '../UnifiedRegisterPagination';
import { UnifiedRegisterSearch } from '../UnifiedRegisterSearch';
import { useUnifiedRegisterPage } from '../../hooks/useUnifiedRegisterPage';
import classes from './UnifiedRegisterPage.module.css';

export function UnifiedRegisterPage({
  initialData
}: {
  initialData: IUnifiedRegisterListData | null;
}) {
  const {
    search,
    handleSearchChange,
    filteredItems,
    hasResults,
    activePage,
    setActivePage,
    totalPages,
    isPagePending,
    pageError,
    selectedReprocessingItem,
    selectedBatchItem,
    selectedLotOption,
    reprocessingActionError,
    batchOptionsError,
    addToBatchError,
    batchSearch,
    filteredLotOptions,
    isBatchOptionsPending,
    isAddToBatchPending,
    setBatchSearch,
    openReprocessingModal,
    closeReprocessingModal,
    openBatchModal,
    closeBatchModal,
    selectLotOption,
    closeLotConfirmModal,
    confirmReprocessing,
    confirmLotSelection
  } = useUnifiedRegisterPage(initialData);

  return (
    <div className={classes.page}>
      <UnifiedRegisterSearch value={search} onChange={handleSearchChange} />

      {hasResults ? (
        <>
          <UnifiedRegisterList
            items={filteredItems}
            onAddToBatch={openBatchModal}
            onMarkReprocessing={openReprocessingModal}
          />

          <UnifiedRegisterPagination
            totalPages={totalPages}
            activePage={activePage}
            onChange={setActivePage}
            disabled={isPagePending}
          />
        </>
      ) : (
        <UnifiedRegisterEmptyState />
      )}

      {pageError ? (
        <Text c="red" size="sm">
          {pageError}
        </Text>
      ) : null}

      <SendToReprocessingModal
        opened={Boolean(selectedReprocessingItem)}
        onClose={closeReprocessingModal}
        contribuyenteId={selectedReprocessingItem?.contribuyenteId ?? ''}
        cuit={selectedReprocessingItem?.cuit ?? ''}
        razonSocial={selectedReprocessingItem?.businessName ?? ''}
        error={reprocessingActionError}
        onConfirm={confirmReprocessing}
      />

      <Modal
        opened={Boolean(selectedBatchItem) && !selectedLotOption}
        onClose={closeBatchModal}
        title="Agregar a lote"
        centered
        size={360}
        zIndex={900}
        classNames={{
          overlay: classes.modalOverlay,
          content: `${classes.modalContent} ${classes.batchModalContent}`,
          header: classes.modalHeader,
          body: `${classes.modalBody} ${classes.batchModalBody}`,
          title: classes.modalTitle
        }}
      >
        <Stack gap="sm" className={classes.batchModalStack}>
          <TextInput
            classNames={{ input: classes.batchDropdownInput }}
            value={batchSearch}
            onChange={(event) => setBatchSearch(event.currentTarget.value)}
            placeholder="Buscar lote..."
          />

          <div className={classes.batchDropdownList}>
            {batchOptionsError ? (
              <Text className={`${classes.batchDropdownState} ${classes.batchDropdownError}`}>
                {batchOptionsError}
              </Text>
            ) : filteredLotOptions.length === 0 ? (
              <Text className={classes.batchDropdownState}>
                {isBatchOptionsPending ? 'Cargando lotes...' : 'No se encontraron lotes.'}
              </Text>
            ) : (
              filteredLotOptions.map((lot) => (
                <button
                  key={lot.id}
                  type="button"
                  className={classes.batchDropdownOption}
                  onClick={() => selectLotOption(lot)}
                >
                  <Text className={classes.batchDropdownOptionTitle}>
                    {lot.label}
                  </Text>
                  <Text className={classes.batchDropdownOptionMeta}>
                    {lot.cuitCount} CUITs
                  </Text>
                </button>
              ))
            )}
          </div>
        </Stack>
      </Modal>

      <Modal
        opened={Boolean(selectedLotOption)}
        onClose={closeLotConfirmModal}
        title="Agregar a lote"
        centered
        size={420}
        zIndex={900}
        classNames={{
          overlay: classes.modalOverlay,
          content: `${classes.modalContent} ${classes.lotConfirmModalContent}`,
          header: `${classes.modalHeader} ${classes.lotConfirmModalHeader}`,
          body: `${classes.modalBody} ${classes.lotConfirmModalBody}`,
          title: classes.modalTitle
        }}
      >
        {selectedLotOption ? (
          <Stack gap={0}>
            <Text
              className={`${classes.modalText} ${classes.lotConfirmModalText}`}
            >
              ¿Querés agregar este CUIT al lote {selectedLotOption.label} (
              {selectedLotOption.cuitCount} CUITs actualmente)
            </Text>
            {addToBatchError ? (
              <Text className={classes.modalErrorText}>{addToBatchError}</Text>
            ) : null}
            <Group justify="flex-end" gap="sm">
              <Button
                variant="default"
                radius="xl"
                onClick={closeLotConfirmModal}
                disabled={isAddToBatchPending}
              >
                Cancelar
              </Button>
              <Button
                radius="xl"
                loading={isAddToBatchPending}
                onClick={confirmLotSelection}
              >
                Confirmar
              </Button>
            </Group>
          </Stack>
        ) : null}
      </Modal>
    </div>
  );
}
