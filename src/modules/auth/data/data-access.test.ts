import { createServerAuthSource } from './data-access';
import { MockAuthSource } from './sources/mock/MockAuthSource';
import { RestAuthSource } from './sources/rest/RestAuthSource';

const ORIGINAL_USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH;

describe('createServerAuthSource', () => {
  afterEach(() => {
    if (typeof ORIGINAL_USE_MOCK_AUTH === 'undefined') {
      delete process.env.NEXT_PUBLIC_USE_MOCK_AUTH;
      return;
    }

    process.env.NEXT_PUBLIC_USE_MOCK_AUTH = ORIGINAL_USE_MOCK_AUTH;
  });

  it('uses the REST source by default', async () => {
    delete process.env.NEXT_PUBLIC_USE_MOCK_AUTH;

    const source = await createServerAuthSource();

    expect(source).toBeInstanceOf(RestAuthSource);
  });

  it('uses the mock source only when explicitly enabled', async () => {
    process.env.NEXT_PUBLIC_USE_MOCK_AUTH = 'true';

    const source = await createServerAuthSource();

    expect(source).toBeInstanceOf(MockAuthSource);
  });
});
