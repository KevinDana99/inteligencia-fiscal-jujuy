'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { getCrossResumenAction } from '../../../data/actions'
import { mapResumenSectionsToPreview } from '../../../data/mappers/mapCrossPreviewContractToView'
import type {
  ICrossColumnFilters,
  ICrossColumnFilterState,
  ICrossDynamicColumn,
  ICrossFilterColumnKey,
  ICrossPaginationData,
  ICrossPreviewData,
  ICrossPreviewResumenGridSection,
  ICrossPreviewResumenSection,
  ICrossPreviewSummaryBlock
} from '../../../data/models/CrossManagement'
import { mapCrossColumnFiltersToResumenRequest } from '../../../data/utils/crossPreviewFilters'

export type CrossFilterColumnConfig = {
  allowedOperators: ICrossDynamicColumn['allowedOperators']
  key: ICrossFilterColumnKey
  label: string
  sectionKey: string
  title: string
  type: ICrossDynamicColumn['type']
}

type CrossResumenGridState = {
  columnFilters: ICrossColumnFilters
  search: string
}

type CrossResumenGridStateBySection = Record<string, CrossResumenGridState>

interface UseCrossPreviewResumenQueryParams {
  cross: ICrossPreviewData
}

const EMPTY_PAGINATION: ICrossPaginationData = {
  page: 1,
  itemsPerPage: 20,
  totalItems: 0,
  totalPages: 0
}

function isGridSection(
  section: ICrossPreviewResumenSection
): section is ICrossPreviewResumenGridSection {
  return section.type === 'grilla'
}

function createEmptyGridState(): CrossResumenGridState {
  return {
    columnFilters: {},
    search: ''
  }
}

function buildGridStateBySection(
  sections: ICrossPreviewResumenSection[]
): CrossResumenGridStateBySection {
  return Object.fromEntries(
    sections.filter(isGridSection).map((section) => [
      section.id,
      createEmptyGridState()
    ])
  )
}

function ensureGridStates(
  current: CrossResumenGridStateBySection,
  sections: ICrossPreviewResumenSection[]
): CrossResumenGridStateBySection {
  return sections.filter(isGridSection).reduce<CrossResumenGridStateBySection>(
    (state, section) => ({
      ...state,
      [section.id]: state[section.id] ?? createEmptyGridState()
    }),
    current
  )
}

function getSectionGridState(
  stateBySection: CrossResumenGridStateBySection,
  sectionKey: string
) {
  return stateBySection[sectionKey] ?? createEmptyGridState()
}

export function useCrossPreviewResumenQuery({
  cross
}: UseCrossPreviewResumenQueryParams) {
  const latestRequestRef = useRef(0)
  const [sections, setSections] = useState<ICrossPreviewResumenSection[]>(
    cross.resumenSections
  )
  const [gridStateBySection, setGridStateBySection] =
    useState<CrossResumenGridStateBySection>(() =>
      buildGridStateBySection(cross.resumenSections)
    )
  const [activeFilterColumn, setActiveFilterColumn] =
    useState<CrossFilterColumnConfig | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingSectionKey, setLoadingSectionKey] = useState<string | null>(null)

  const gridSections = useMemo(() => sections.filter(isGridSection), [sections])
  const firstGridSection = gridSections[0] ?? null
  const firstGridState = firstGridSection
    ? getSectionGridState(gridStateBySection, firstGridSection.id)
    : createEmptyGridState()

  const analysisRows = useMemo(
    () => gridSections.flatMap((section) => section.rows),
    [gridSections]
  )
  const filterableColumns = useMemo(
    () =>
      firstGridSection?.columns
        .filter((column) => column.isFilterable)
        .map((column) => ({
          allowedOperators: column.allowedOperators,
          key: column.key,
          label: column.label,
          sectionKey: firstGridSection.id,
          title: column.label,
          type: column.type
        })) ?? [],
    [firstGridSection]
  )
  const summaryBlocks = useMemo<ICrossPreviewSummaryBlock[]>(
    () =>
      sections
        .filter((section) => section.type === 'resumen')
        .map((section) => ({
          id: section.id,
          title: section.title,
          columns: section.columns,
          rows: section.rows
        })),
    [sections]
  )

  const closeFilterModal = useCallback(() => {
    setActiveFilterColumn(null)
    setError(null)
  }, [])

  const openFilterModal = useCallback((column: CrossFilterColumnConfig) => {
    setActiveFilterColumn(column)
    setError(null)
  }, [])

  const loadResumen = useCallback(
    async ({
      nextFilters,
      nextPage,
      nextSearch,
      sectionKey
    }: {
      nextFilters: ICrossColumnFilters
      nextPage: number
      nextSearch: string
      sectionKey: string
    }) => {
      const section = gridSections.find((item) => item.id === sectionKey)
      const itemsPerPage =
        section?.pagination.itemsPerPage ??
        firstGridSection?.pagination.itemsPerPage ??
        EMPTY_PAGINATION.itemsPerPage
      const hasMultipleGridSections = gridSections.length > 1
      const columnFilters = mapCrossColumnFiltersToResumenRequest(nextFilters)
      const requestId = latestRequestRef.current + 1
      latestRequestRef.current = requestId
      setLoadingSectionKey(sectionKey)

      const response = await getCrossResumenAction(cross.executionId, {
        page: hasMultipleGridSections ? 1 : nextPage,
        itemsPerPage,
        search: hasMultipleGridSections ? '' : nextSearch,
        columnFilters: hasMultipleGridSections ? [] : columnFilters,
        sections: {
          [sectionKey]: {
            page: nextPage,
            itemsPerPage,
            search: nextSearch,
            columnFilters
          }
        }
      })

      if (requestId !== latestRequestRef.current) {
        return
      }

      if (!response.data) {
        setError(response.error ?? 'No fue posible cargar el resumen.')
        setLoadingSectionKey(null)
        return
      }

      const nextSections = mapResumenSectionsToPreview(response.data.sections)
      setSections(nextSections)
      setGridStateBySection((current) => ensureGridStates(current, nextSections))
      setError(null)
      setLoadingSectionKey(null)
    },
    [cross.executionId, firstGridSection, gridSections]
  )

  const setSectionSearch = useCallback(
    (sectionKey: string, value: string) => {
      const nextFilters = getSectionGridState(
        gridStateBySection,
        sectionKey
      ).columnFilters

      setGridStateBySection((current) => ({
        ...current,
        [sectionKey]: {
          ...getSectionGridState(current, sectionKey),
          search: value
        }
      }))
      void loadResumen({
        nextFilters,
        nextPage: 1,
        nextSearch: value,
        sectionKey
      })
    },
    [gridStateBySection, loadResumen]
  )

  const setSectionPage = useCallback(
    (sectionKey: string, page: number) => {
      const sectionState = getSectionGridState(gridStateBySection, sectionKey)

      void loadResumen({
        nextFilters: sectionState.columnFilters,
        nextPage: page,
        nextSearch: sectionState.search,
        sectionKey
      })
    },
    [gridStateBySection, loadResumen]
  )

  const applyFilter = useCallback(
    (columnKey: ICrossFilterColumnKey, value: ICrossColumnFilterState) => {
      const sectionKey = activeFilterColumn?.sectionKey

      if (!sectionKey) {
        return
      }

      const currentState = getSectionGridState(gridStateBySection, sectionKey)
      const nextFilters = {
        ...currentState.columnFilters,
        [columnKey]: value
      }

      setGridStateBySection((current) => ({
        ...current,
        [sectionKey]: {
          ...getSectionGridState(current, sectionKey),
          columnFilters: nextFilters
        }
      }))
      void loadResumen({
        nextFilters,
        nextPage: 1,
        nextSearch: currentState.search,
        sectionKey
      })
      setActiveFilterColumn(null)
    },
    [activeFilterColumn, gridStateBySection, loadResumen]
  )

  const clearFilter = useCallback(
    (columnKey: ICrossFilterColumnKey) => {
      const sectionKey = activeFilterColumn?.sectionKey

      if (!sectionKey) {
        return
      }

      const currentState = getSectionGridState(gridStateBySection, sectionKey)
      const nextFilters = { ...currentState.columnFilters }
      delete nextFilters[columnKey]

      setGridStateBySection((current) => ({
        ...current,
        [sectionKey]: {
          ...getSectionGridState(current, sectionKey),
          columnFilters: nextFilters
        }
      }))
      void loadResumen({
        nextFilters,
        nextPage: 1,
        nextSearch: currentState.search,
        sectionKey
      })
    },
    [activeFilterColumn, gridStateBySection, loadResumen]
  )

  return {
    activeFilterColumn,
    analysisColumns: firstGridSection?.columns ?? [],
    analysisRows,
    applyFilter,
    clearFilter,
    closeFilterModal,
    columnFilters: firstGridState.columnFilters,
    error,
    filterableColumns,
    gridStateBySection,
    isLoading: Boolean(loadingSectionKey),
    loadingSectionKey,
    openFilterModal,
    pagination: firstGridSection?.pagination ?? EMPTY_PAGINATION,
    resumenSections: sections,
    search: firstGridState.search,
    setPage: (page: number) => {
      if (firstGridSection) {
        setSectionPage(firstGridSection.id, page)
      }
    },
    setSearch: (value: string) => {
      if (firstGridSection) {
        setSectionSearch(firstGridSection.id, value)
      }
    },
    setSectionPage,
    setSectionSearch,
    summaryBlocks
  }
}
