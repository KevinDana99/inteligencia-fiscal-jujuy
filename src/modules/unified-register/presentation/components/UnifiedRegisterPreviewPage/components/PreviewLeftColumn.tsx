import type { IUnifiedRegisterDetail } from '../../../../data/models/UnifiedRegister';
import type { PreviewController } from '../types';
import { ActivitiesCard } from './ActivitiesCard';
import { AddressesCard } from './AddressesCard';
import { ContactsCard } from './ContactsCard';
import { NotesCard } from './NotesCard';
import classes from '../UnifiedRegisterPreviewPage.module.css';

type PreviewLeftColumnProps = {
  item: IUnifiedRegisterDetail;
  preview: PreviewController;
};

export function PreviewLeftColumn({ item, preview }: PreviewLeftColumnProps) {
  return (
    <div className={classes.leftColumn}>
      <ActivitiesCard item={item} />
      <AddressesCard item={item} preview={preview} />
      <ContactsCard preview={preview} />
      <NotesCard preview={preview} />
    </div>
  );
}
