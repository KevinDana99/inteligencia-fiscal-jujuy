/**
 * @jest-environment jsdom
 */

import React from 'react';
import { act } from 'react';
import { MantineProvider } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { createRoot, type Root } from 'react-dom/client';
import type {
  IUnifiedRegisterBatchOption,
  IUnifiedRegisterItem
} from '../../../data/models/UnifiedRegister';
import { UnifiedRegisterCard } from './index';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock(
  '@/modules/batch-management/presentation/components/BatchManagementAvailableLotsDropdown',
  () => ({
    BatchManagementAvailableLotsDropdown: () => null
  })
);

jest.mock(
  './UnifiedRegisterCard.module.css',
  () =>
    new Proxy(
      {},
      {
        get: (_target, prop) => String(prop)
      }
    )
);

type ReactActEnvironmentGlobal = typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

const reactActEnvironmentGlobal = globalThis as ReactActEnvironmentGlobal;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const pushMock = jest.fn();
const prefetchMock = jest.fn();

const CARD_ITEM: IUnifiedRegisterItem = {
  contribuyenteId: '33719001829-id',
  cuit: '33719001829',
  businessName: 'Contribuyente de prueba',
  activity: 'Servicios',
  regime: 'Régimen General',
  riskLevel: 'B',
  status: 'Activo'
};

const EXPECTED_DETAIL_ROUTE =
  '/vista-previa-padron/33719001829?id=33719001829-id';

function createRouterMock() {
  return {
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: prefetchMock,
    push: pushMock,
    refresh: jest.fn(),
    replace: jest.fn()
  };
}

async function renderCard() {
  const container = document.createElement('div');
  const root = createRoot(container);
  const noop = jest.fn();
  const emptyLotOptions: IUnifiedRegisterBatchOption[] = [];

  document.body.appendChild(container);

  await act(async () => {
    root.render(
      React.createElement(
        MantineProvider,
        null,
        React.createElement(UnifiedRegisterCard, {
          item: CARD_ITEM,
          isBatchDropdownOpen: false,
          batchSearch: '',
          filteredLotOptions: emptyLotOptions,
          batchOptionsError: null,
          isBatchOptionsPending: false,
          onCloseBatchDropdown: noop,
          onBatchSearchChange: noop,
          onSelectLotOption: noop,
          onAddToBatch: noop,
          onMarkReprocessing: noop
        })
      )
    );
  });

  const navigationTarget = Array.from(container.querySelectorAll('*')).find(
    (element) => element.textContent === CARD_ITEM.cuit
  ) as HTMLElement;

  return {
    container,
    navigationTarget,
    root
  };
}

describe('UnifiedRegisterCard', () => {
  let root: Root | null = null;
  let container: HTMLDivElement | null = null;

  beforeEach(() => {
    reactActEnvironmentGlobal.IS_REACT_ACT_ENVIRONMENT = true;
    pushMock.mockReset();
    prefetchMock.mockReset();
    mockUseRouter.mockReturnValue(createRouterMock());
  });

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root?.unmount();
      });
    }

    container?.remove();
    root = null;
    container = null;
    reactActEnvironmentGlobal.IS_REACT_ACT_ENVIRONMENT = undefined;
  });

  it('prefetches the preview route once on navigation intent and pushes it on click', async () => {
    const rendered = await renderCard();
    root = rendered.root;
    container = rendered.container;

    await act(async () => {
      rendered.navigationTarget.dispatchEvent(
        new Event('touchstart', {
          bubbles: true,
          cancelable: true
        })
      );
      rendered.navigationTarget.dispatchEvent(
        new FocusEvent('focusin', {
          bubbles: true
        })
      );
    });

    expect(prefetchMock).toHaveBeenCalledTimes(1);
    expect(prefetchMock).toHaveBeenCalledWith(EXPECTED_DETAIL_ROUTE);

    await act(async () => {
      rendered.navigationTarget.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true
        })
      );
    });

    expect(pushMock).toHaveBeenCalledWith(EXPECTED_DETAIL_ROUTE);
  });

  it('does not navigate when the internal action menu trigger is clicked', async () => {
    const rendered = await renderCard();
    root = rendered.root;
    container = rendered.container;

    const menuButton = rendered.container.querySelector('button');

    expect(menuButton).not.toBeNull();

    await act(async () => {
      menuButton?.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        })
      );
    });

    expect(pushMock).not.toHaveBeenCalled();
  });
});
