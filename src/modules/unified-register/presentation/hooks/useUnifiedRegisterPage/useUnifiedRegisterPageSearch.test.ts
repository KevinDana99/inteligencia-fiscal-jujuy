/**
 * @jest-environment jsdom
 */

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { getUnifiedRegisterListAction } from '../../../data/actions';
import type {
  IUnifiedRegisterItem,
  IUnifiedRegisterItems,
  IUnifiedRegisterListData
} from '../../../data/models/UnifiedRegister';
import { useUnifiedRegisterPageSearch } from './useUnifiedRegisterPageSearch';

jest.mock('../../../data/actions', () => ({
  getUnifiedRegisterListAction: jest.fn()
}));

type ReactActEnvironmentGlobal = typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

const reactActEnvironmentGlobal = globalThis as ReactActEnvironmentGlobal;
const mockGetUnifiedRegisterListAction =
  getUnifiedRegisterListAction as jest.MockedFunction<
    typeof getUnifiedRegisterListAction
  >;

const INITIAL_ITEM: IUnifiedRegisterItem = {
  contribuyenteId: '20100000001-id',
  cuit: '20100000001',
  businessName: 'Alpha SA',
  activity: 'Servicios',
  regime: 'Régimen General',
  riskLevel: 'A',
  status: 'Activo'
};

const SEARCH_RESULT_ITEM: IUnifiedRegisterItem = {
  contribuyenteId: '30700000002-id',
  cuit: '30700000002',
  businessName: 'Beta SRL',
  activity: 'Comercio',
  regime: 'Convenio Multilateral',
  riskLevel: 'B',
  status: 'Activo'
};

const noop = () => undefined;

function createListData(items: IUnifiedRegisterItems): IUnifiedRegisterListData {
  return {
    pagina: 1,
    itemsPagina: 10,
    totalPaginas: 1,
    contribuyentes: items
  };
}

function setInputValue(input: HTMLInputElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  );

  descriptor?.set?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

async function flushPromises() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

function SearchHarness() {
  const [items, setItems] = React.useState<IUnifiedRegisterItems>([INITIAL_ITEM]);
  const { search, filteredItems, handleSearchChange, handleSearchKeyDown, handleSearchReset } =
    useUnifiedRegisterPageSearch({
      items,
      onSearchChange: noop,
      onSearchError: noop,
      onSearchResult: (data) => {
        setItems(data.contribuyentes);
      }
    });

  return React.createElement(
    React.Fragment,
    null,
    React.createElement('input', {
      value: search,
      onChange: handleSearchChange,
      onKeyDown: handleSearchKeyDown
    }),
    React.createElement(
      'button',
      {
        type: 'button',
        onClick: handleSearchReset
      },
      'reset'
    ),
    React.createElement(
      'div',
      {
        'data-testid': 'first-cuit'
      },
      filteredItems[0]?.cuit ?? 'none'
    )
  );
}

describe('useUnifiedRegisterPageSearch', () => {
  let root: Root | null = null;
  let container: HTMLDivElement | null = null;

  beforeEach(() => {
    reactActEnvironmentGlobal.IS_REACT_ACT_ENVIRONMENT = true;
    mockGetUnifiedRegisterListAction.mockReset();
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

  it('clears the input and restores the full list when reset is clicked', async () => {
    mockGetUnifiedRegisterListAction
      .mockResolvedValueOnce({
        data: createListData([SEARCH_RESULT_ITEM])
      })
      .mockResolvedValueOnce({
        data: createListData([INITIAL_ITEM])
      });

    container = document.createElement('div');
    root = createRoot(container);
    document.body.appendChild(container);

    await act(async () => {
      root?.render(React.createElement(SearchHarness));
    });

    const input = container.querySelector('input');
    const resetButton = container.querySelector('button');
    const firstCuit = container.querySelector(
      '[data-testid="first-cuit"]'
    ) as HTMLDivElement | null;

    expect(input).not.toBeNull();
    expect(resetButton).not.toBeNull();
    expect(firstCuit?.textContent).toBe(INITIAL_ITEM.cuit);

    await act(async () => {
      setInputValue(input as HTMLInputElement, '307');
      (input as HTMLInputElement).dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true
        })
      );
      await flushPromises();
    });

    expect(mockGetUnifiedRegisterListAction).toHaveBeenNthCalledWith(
      1,
      1,
      10,
      '307'
    );
    expect((input as HTMLInputElement).value).toBe('307');
    expect(firstCuit?.textContent).toBe(SEARCH_RESULT_ITEM.cuit);

    await act(async () => {
      resetButton?.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        })
      );
      await flushPromises();
    });

    expect(mockGetUnifiedRegisterListAction).toHaveBeenNthCalledWith(
      2,
      1,
      10,
      ''
    );
    expect((input as HTMLInputElement).value).toBe('');
    expect(firstCuit?.textContent).toBe(INITIAL_ITEM.cuit);
  });
});
