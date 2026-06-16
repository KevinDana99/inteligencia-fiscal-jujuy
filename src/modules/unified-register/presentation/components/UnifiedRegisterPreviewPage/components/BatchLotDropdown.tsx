import { Text, TextInput } from '@mantine/core';
import type { PreviewController } from '../types';
import classes from '../UnifiedRegisterPreviewPage.module.css';

type BatchLotDropdownProps = {
  preview: PreviewController;
};

export function BatchLotDropdown({ preview }: BatchLotDropdownProps) {
  if (preview.activeHeaderModal !== 'batch') {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar selector de lote"
        className={classes.batchDropdownBackdrop}
        onClick={preview.closeHeaderModal}
      />
      <div className={classes.batchDropdown}>
        <TextInput
          classNames={{ input: classes.batchDropdownInput }}
          value={preview.batchSearch}
          onChange={(event) => preview.setBatchSearch(event.currentTarget.value)}
          placeholder="Buscar lote..."
        />
        <div className={classes.batchDropdownList}>
          {preview.batchOptionsError ? (
            <Text className={`${classes.batchDropdownState} ${classes.batchDropdownError}`}>
              {preview.batchOptionsError}
            </Text>
          ) : null}
          {preview.filteredLotOptions.map((lot) => (
            <button
              key={lot.id}
              type="button"
              className={classes.batchDropdownOption}
              onClick={() => preview.selectLotOption(lot)}
            >
              <Text className={classes.batchDropdownOptionTitle}>{lot.label}</Text>
              <Text className={classes.batchDropdownOptionMeta}>
                {lot.cuitCount} CUITs
              </Text>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
