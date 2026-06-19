'use client';

import { Button, Group, Modal, Stack, Text } from '@mantine/core';
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
            selectedBatchItemId={selectedBatchItem?.contribuyenteId ?? null}
            batchSearch={batchSearch}
            filteredLotOptions={filteredLotOptions}
            batchOptionsError={batchOptionsError}
            isBatchOptionsPending={isBatchOptionsPending}
            onCloseBatchDropdown={closeBatchModal}
            onBatchSearchChange={setBatchSearch}
            onSelectLotOption={selectLotOption}
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
