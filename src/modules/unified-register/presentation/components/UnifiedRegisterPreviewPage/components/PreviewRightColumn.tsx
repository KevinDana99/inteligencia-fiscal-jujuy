import type { PreviewController } from '../types';
import { InterventionOrdersTable } from './InterventionOrdersTable';
import { MercurioTable } from './MercurioTable';
import { SourceTablesCard } from './SourceTablesCard';
import classes from '../UnifiedRegisterPreviewPage.module.css';

type PreviewRightColumnProps = {
  preview: PreviewController;
};

export function PreviewRightColumn({ preview }: PreviewRightColumnProps) {
  return (
    <div className={classes.rightColumn}>
      <MercurioTable preview={preview} />
      <InterventionOrdersTable preview={preview} />
      <SourceTablesCard preview={preview} />
    </div>
  );
}
