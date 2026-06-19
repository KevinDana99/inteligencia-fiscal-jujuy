import type { DeleteKind, EditKind } from '../hooks/unified-register-preview/types';

export const EDIT_MODAL_TITLE: Record<Exclude<EditKind, null>, string> = {
  address: 'Agregar domicilio alternativo',
  contact: 'Agregar contacto',
  note: 'Agregar nota'
};

export const EDIT_MODAL_UPDATE_TITLE: Record<Exclude<EditKind, null>, string> = {
  address: 'Editar domicilio alternativo',
  contact: 'Editar contacto',
  note: 'Editar nota'
};

export const EDIT_MODAL_LABEL: Record<Exclude<EditKind, null>, string> = {
  address: 'Dirección',
  contact: 'Contacto',
  note: 'Nota'
};

export const EDIT_MODAL_PLACEHOLDER: Record<Exclude<EditKind, null>, string> = {
  address: 'Ej: Av. Independencia 500, S.S. de Jujuy',
  contact: 'Ingresá un contacto',
  note: 'Ingresá una nota'
};

export const DELETE_MODAL_TITLE: Record<Exclude<DeleteKind, null>, string> = {
  address: 'Eliminar domicilio',
  contact: 'Eliminar contacto',
  note: 'Eliminar nota'
};

export const DELETE_MODAL_DESCRIPTION: Record<Exclude<DeleteKind, null>, string> = {
  address: '¿Estás seguro que querés eliminar este domicilio alternativo?',
  contact: '¿Estás seguro que querés eliminar este contacto?',
  note: '¿Estás seguro que querés eliminar esta nota?'
};
