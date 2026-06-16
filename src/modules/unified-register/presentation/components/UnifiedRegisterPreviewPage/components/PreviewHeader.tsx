import { Card } from '@mantine/core';
import type { IUnifiedRegisterDetail } from '../../../../data/models/UnifiedRegister';
import type { PreviewController } from '../types';
import { PreviewHeaderActions } from './PreviewHeaderActions';
import { PreviewHeaderSummary } from './PreviewHeaderSummary';
import classes from '../UnifiedRegisterPreviewPage.module.css';

type PreviewHeaderProps = {
  item: IUnifiedRegisterDetail;
  preview: PreviewController;
};

export function PreviewHeader({ item, preview }: PreviewHeaderProps) {
  return (
    <Card className={classes.headerCard} padding={0} radius="xl">
      <PreviewHeaderSummary item={item} />
      <PreviewHeaderActions item={item} preview={preview} />
    </Card>
  );
}
