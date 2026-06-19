import type { ContactForm } from './types';

export const EMPTY_CONTACT_FORM: ContactForm = {
  phone: '',
  mail: '',
  legal: '',
  accountant: ''
};

export const BATCH_OPTIONS_SEARCH_DEBOUNCE_MS = 250;
