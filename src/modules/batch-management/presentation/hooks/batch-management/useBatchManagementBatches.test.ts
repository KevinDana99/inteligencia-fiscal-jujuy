/**
 * @jest-environment jsdom
 */

import React, { useLayoutEffect } from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import {
  getBatchDetailAction,
  getBatchManagementAction
} from '../../../data/actions'
import type {
  IBatchCreatedSummary,
  IBatchListData,
  IBatchManagementItem
} from '../../../data/models/BatchManagement'
import { useBatchManagementBatches } from './useBatchManagementBatches'

jest.mock('../../../data/actions', () => ({
  getBatchDetailAction: jest.fn(),
  getBatchManagementAction: jest.fn()
}))

type HookValue = ReturnType<typeof useBatchManagementBatches>

const LIST_BATCH: IBatchManagementItem = {
  id: 'batch-1',
  batchNumber: '000001',
  name: 'Lote nuevo',
  description: '',
  regime: 'Convenio Multilateral',
  cuitCount: 1,
  createdAt: '2026-06-06T12:00:00.000Z',
  createdBy: {
    id: 'user-1',
    name: 'Ada Lovelace'
  },
  cuits: []
}

const DETAIL_BATCH: IBatchManagementItem = {
  ...LIST_BATCH,
  cuits: [
    {
      id: 'batch-1-1',
      cuit: '20304050607',
      businessName: 'ACME SA',
      regime: 'Convenio Multilateral',
      order: 1
    }
  ]
}

const CREATED_SUMMARY: IBatchCreatedSummary = {
  id: 'batch-1',
  number: 1,
  formattedNumber: '000001',
  name: 'Lote nuevo',
  description: '',
  regime: 'Convenio Multilateral',
  cuitCount: 1,
  createdAt: '2026-06-06T12:00:00.000Z'
}

function createListResponse(batch: IBatchManagementItem): IBatchListData {
  return {
    page: 1,
    itemsPerPage: 20,
    totalItems: 1,
    totalPages: 1,
    batches: [batch]
  }
}

function HookHarness({
  onChange
}: {
  onChange: (value: HookValue) => void
}) {
  const value = useBatchManagementBatches()

  useLayoutEffect(() => {
    onChange(value)
  }, [onChange, value])

  return null
}

describe('useBatchManagementBatches', () => {
  let container: HTMLDivElement
  let root: Root
  let latestValue: HookValue | null

  const mockGetBatchManagementAction =
    getBatchManagementAction as jest.MockedFunction<typeof getBatchManagementAction>
  const mockGetBatchDetailAction =
    getBatchDetailAction as jest.MockedFunction<typeof getBatchDetailAction>

  beforeEach(async () => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
    latestValue = null
    mockGetBatchManagementAction.mockReset()
    mockGetBatchDetailAction.mockReset()

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root.render(
        React.createElement(HookHarness, {
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
    delete globalThis.IS_REACT_ACT_ENVIRONMENT
  })

  it('hydrates the newly created batch detail after auto-expanding it', async () => {
    mockGetBatchManagementAction.mockResolvedValue({
      data: createListResponse(LIST_BATCH)
    })
    mockGetBatchDetailAction.mockResolvedValue({
      data: DETAIL_BATCH
    })

    expect(latestValue).not.toBeNull()

    await act(async () => {
      await latestValue?.handleBatchCreated(CREATED_SUMMARY, ['20304050607'])
    })

    expect(mockGetBatchManagementAction).toHaveBeenCalledTimes(1)
    expect(mockGetBatchDetailAction).toHaveBeenCalledWith(CREATED_SUMMARY.id)
    expect(latestValue?.expandedBatchId).toBe(CREATED_SUMMARY.id)
    expect(latestValue?.batches[0]?.cuits).toEqual(DETAIL_BATCH.cuits)
    expect(latestValue?.batches[0]?.cuits[0]?.businessName).toBe('ACME SA')
  })
})
