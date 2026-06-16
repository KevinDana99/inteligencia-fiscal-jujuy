import {
  createContactAction,
  deleteContactAction,
  getContactsAction,
  updateContactAction
} from '../../../data/actions';
import type { ContactForm } from './types';

export function getContactPayload(contactForm: ContactForm) {
  return {
    telefono: contactForm.phone,
    correo: contactForm.mail,
    nombreRepresentanteLegal: contactForm.legal,
    nombreContador: contactForm.accountant
  };
}

export async function loadContactsPage(contributorId: string, page: number) {
  return getContactsAction(contributorId, {
    pagina: page,
    itemsPagina: 1
  });
}

export async function saveContactRecord(
  contributorId: string,
  editingItemId: string | null,
  contactForm: ContactForm
) {
  const payload = getContactPayload(contactForm);

  return editingItemId
    ? updateContactAction(contributorId, editingItemId, payload)
    : createContactAction(contributorId, payload);
}

export async function deleteContactRecord(
  contributorId: string,
  contactId: string
) {
  return deleteContactAction(contributorId, contactId);
}
