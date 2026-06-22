/**
 * @jest-environment jsdom
 */

import React, { useLayoutEffect } from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import type { IBatchManagementItem } from '../../../../data/models/BatchManagement'
import { useBatchManagementBatchDetail } from './useBatchManagementBatchDetail'

type DetailValue = ReturnType<typeof useBatchManagementBatchDetail>
type ReactActEnvironmentGlobal = typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean
}

const reactActEnvironmentGlobal = globalThis as ReactActEnvironmentGlobal

function buildBatch(overrides: Partial<IBatchManagementItem> = {}): IBatchManagementItem {
  return {
    id: 'batch-1',
    batchNumber: '000001',
    name: 'Lote grande',
    description: '',
    regime: 'Convenio Multilateral',
    cuitCount: 10000,
    cuitPage: 1,
    cuitItemsPerPage: 20,
    cuitTotalItems: 10000,
    cuitTotalPages: 500,
    createdAt: '2026-06-06T12:00:00.000Z',
    createdBy: null,
    cuits: Array.from({ length: 20 }, (_, index) => ({
      id: `batch-1-${index + 1}`,
      cuit: `2030405${String(index + 1).padStart(4, '0')}`,
      businessName: `Contribuyente ${index + 1}`,
      regime: 'Convenio Multilateral',
      order: index + 1
    })),
    ...overrides
  }
}

function HookHarness({
  batch,
  onCuitPageChange,
  onChange
}: {
  batch: IBatchManagementItem
  onCuitPageChange: (page: number, itemsPerPage: number) => void
  onChange: (value: DetailValue) => void
}) {
  const value = useBatchManagementBatchDetail({
    batch,
    onCuitPageChange
  })

  useLayoutEffect(() => {
    onChange(value)
  }, [onChange, value])

  return null
}

describe('useBatchManagementBatchDetail', () => {
  let container: HTMLDivElement
  let root: Root
  let latestValue: DetailValue | null

  beforeEach(() => {
    reactActEnvironmentGlobal.IS_REACT_ACT_ENVIRONMENT = true
    latestValue = null
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => {
      root.unmount()
    })

    container.remove()
    reactActEnvironmentGlobal.IS_REACT_ACT_ENVIRONMENT = undefined
  })

  async function renderDetail(
    batch: IBatchManagementItem,
    onCuitPageChange = jest.fn()
  ) {
    await act(async () => {
      root.render(
        React.createElement(HookHarness, {
          batch,
          onCuitPageChange,
          onChange: (value: DetailValue) => {
            latestValue = value
          }
        })
      )
    })

    return latestValue
  }

  it('uses backend pagination metadata for the range label', () => {
    return renderDetail(buildBatch()).then((detail) => {
      expect(detail?.rangeLabel).toBe('Mostrando 1-20 de 10000 CUITs')
      expect(detail?.totalItems).toBe(10000)
      expect(detail?.cuits).toHaveLength(20)
    })
  })

  it('resets the backend page to 1 when changing page size', async () => {
    const onCuitPageChange = jest.fn()
    const detail = await renderDetail(
      buildBatch({
        cuitPage: 2
      }),
      onCuitPageChange
    )

    detail?.onItemsPerPageChange(50)

    expect(onCuitPageChange).toHaveBeenCalledWith(1, 50)
  })
})
