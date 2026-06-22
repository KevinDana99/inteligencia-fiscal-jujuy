/**
 * @jest-environment jsdom
 */

import React, { useLayoutEffect } from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { getBatchManagementAction } from '../../../data/actions'
import type { IBatchListData } from '../../../data/models/BatchManagement'
import { useBatchManagementSearch } from './useBatchManagementSearch'

jest.mock('../../../data/actions', () => ({
  getBatchManagementAction: jest.fn()
}))

type HookValue = ReturnType<typeof useBatchManagementSearch>
type ReactActEnvironmentGlobal = typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean
}

const reactActEnvironmentGlobal = globalThis as ReactActEnvironmentGlobal

const EMPTY_BATCH_LIST: IBatchListData = {
  page: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,
  batches: []
}

function HookHarness({
  onBatchListDataChange,
  onChange
}: {
  onBatchListDataChange: (batchListData: IBatchListData) => void
  onChange: (value: HookValue) => void
}) {
  const value = useBatchManagementSearch({
    itemsPerPage: 10,
    onBatchListDataChange
  })

  useLayoutEffect(() => {
    onChange(value)
  }, [onChange, value])

  return null
}

async function flushAsyncWork() {
  await new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

describe('useBatchManagementSearch', () => {
  let container: HTMLDivElement
  let root: Root
  let latestValue: HookValue | null
  const mockGetBatchManagementAction =
    getBatchManagementAction as jest.MockedFunction<typeof getBatchManagementAction>
  const onBatchListDataChange = jest.fn()

  beforeEach(async () => {
    reactActEnvironmentGlobal.IS_REACT_ACT_ENVIRONMENT = true
    latestValue = null
    onBatchListDataChange.mockReset()
    mockGetBatchManagementAction.mockReset()
    mockGetBatchManagementAction.mockResolvedValue({ data: EMPTY_BATCH_LIST })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root.render(
        React.createElement(HookHarness, {
          onBatchListDataChange,
          onChange: (value: HookValue) => {
            latestValue = value
          }
        })
      )
    })
  })

  afterEach(async () => {
    await act(async () => {
      root.unmount()
    })

    container.remove()
    reactActEnvironmentGlobal.IS_REACT_ACT_ENVIRONMENT = undefined
  })

  it('only requests batches when the search is submitted', async () => {
    await act(async () => {
      latestValue?.updateSearchValue('  ANOVA  ')
    })

    expect(mockGetBatchManagementAction).not.toHaveBeenCalled()

    await act(async () => {
      latestValue?.submitSearchValue()
      await flushAsyncWork()
    })

    expect(mockGetBatchManagementAction).toHaveBeenCalledTimes(1)
    expect(mockGetBatchManagementAction).toHaveBeenLastCalledWith({
      page: 1,
      itemsPerPage: 10,
      search: 'ANOVA'
    })
    expect(onBatchListDataChange).toHaveBeenCalledWith(EMPTY_BATCH_LIST)
  })

  it('keeps pagination tied to the last submitted search term', async () => {
    await act(async () => {
      latestValue?.updateSearchValue('ANOVA')
    })
    await act(async () => {
      latestValue?.submitSearchValue()
      await flushAsyncWork()
    })
    await act(async () => {
      latestValue?.updateSearchValue('sin enviar')
    })
    await act(async () => {
      latestValue?.changePage(3)
      await flushAsyncWork()
    })

    expect(mockGetBatchManagementAction).toHaveBeenLastCalledWith({
      page: 3,
      itemsPerPage: 10,
      search: 'ANOVA'
    })
  })
})
