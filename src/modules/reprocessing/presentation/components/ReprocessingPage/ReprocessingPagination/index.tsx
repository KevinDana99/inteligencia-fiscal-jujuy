'use client'

import { Pagination, Text } from '@mantine/core'
import classes from './ReprocessingPagination.module.css'

interface ReprocessingPaginationProps {
  activePage: number
  disabled?: boolean
  itemsPerPage: number
  onChange: (page: number) => void
  totalPages: number
}

export function ReprocessingPagination({
  activePage,
  disabled,
  itemsPerPage,
  onChange,
  totalPages
}: ReprocessingPaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={classes.root}>
      <Pagination
        total={totalPages}
        value={activePage}
        onChange={onChange}
        disabled={disabled}
        size="sm"
        radius="md"
        siblings={1}
        boundaries={1}
        classNames={{
          root: classes.pagination,
          control: classes.control
        }}
      />
      <Text className={classes.caption}>
        Mostrando los primeros {itemsPerPage} CUITs en reproceso · Usá la
        paginación para ver más
      </Text>
    </div>
  )
}
