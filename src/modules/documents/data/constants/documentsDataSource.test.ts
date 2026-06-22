import { resolveDocumentsApiBaseUrl } from './documentsDataSource';

const ORIGINAL_DOCUMENTS_API_BASE_URL = process.env.DOCUMENTS_API_BASE_URL;
const ORIGINAL_NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

describe('resolveDocumentsApiBaseUrl', () => {
  afterEach(() => {
    if (typeof ORIGINAL_DOCUMENTS_API_BASE_URL === 'undefined') {
      delete process.env.DOCUMENTS_API_BASE_URL;
    } else {
      process.env.DOCUMENTS_API_BASE_URL = ORIGINAL_DOCUMENTS_API_BASE_URL;
    }

    if (typeof ORIGINAL_NEXT_PUBLIC_API_BASE_URL === 'undefined') {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_API_BASE_URL = ORIGINAL_NEXT_PUBLIC_API_BASE_URL;
    }
  });

  it('prefers the documents server-side API base URL', () => {
    process.env.DOCUMENTS_API_BASE_URL =
      ' http://rentas-if-backend.rentas-if.svc.cluster.local ';
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://rentasif.jujuy.gob.ar';

    expect(resolveDocumentsApiBaseUrl()).toBe(
      'http://rentas-if-backend.rentas-if.svc.cluster.local'
    );
  });

  it('falls back to the public API base URL when the documents URL is absent', () => {
    delete process.env.DOCUMENTS_API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:5001';

    expect(resolveDocumentsApiBaseUrl()).toBe('http://localhost:5001');
  });
});
