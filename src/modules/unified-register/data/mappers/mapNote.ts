import type {
  IUnifiedRegisterNote,
  IUnifiedRegisterNoteRecord
} from '../models/UnifiedRegister';

export function mapNoteRecordToViewModel(
  record: IUnifiedRegisterNoteRecord
): IUnifiedRegisterNote {
  return {
    id: record.id,
    text: record.descripcion,
    createdAt: record.fechaCreacion
  };
}
