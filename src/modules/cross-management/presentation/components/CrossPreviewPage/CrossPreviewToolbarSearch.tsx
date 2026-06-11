import { TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useCrossPreviewSearchInput } from '../../hooks/cross-preview/useCrossPreviewSearchInput'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewToolbarSearchProps {
  onSetSearchValue: (value: string) => void
  placeholder: string
  value: string
}

export function CrossPreviewToolbarSearch({
  onSetSearchValue,
  placeholder,
  value
}: CrossPreviewToolbarSearchProps) {
  const { handleSearchChange } = useCrossPreviewSearchInput(onSetSearchValue)

  return (
    <TextInput
      value={value}
      onChange={handleSearchChange}
      placeholder={placeholder}
      leftSection={<IconSearch size={14} />}
      className={classes.toolbarSearch}
      classNames={{
        input: classes.toolbarSearchInput,
        section: classes.toolbarSearchSection
      }}
    />
  )
}
