'use client'

import { ActionIcon, Button, Menu, Text } from '@mantine/core'
import { IconDotsVertical } from '@tabler/icons-react'
import { BatchManagementCrossSection } from '../BatchManagementCrossSection'
import { useBatchManagementCrossMenu } from './useBatchManagementCrossMenu'
import classes from './BatchManagementCrossMenu.module.css'

type BatchManagementCrossMenuProps = {
  controller: Parameters<typeof useBatchManagementCrossMenu>[0]
}

export function BatchManagementCrossMenu({
  controller
}: BatchManagementCrossMenuProps) {
  const menu = useBatchManagementCrossMenu(controller)

  return (
    <Menu
      shadow="md"
      width={420}
      withinPortal={false}
      position="bottom-end"
      offset={8}
    >
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="md"
          onClick={(event) => event.stopPropagation()}
          className={classes.rowActionButton}
        >
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown
        onClick={(event) => event.stopPropagation()}
        className={classes.crossMenuDropdown}
      >
        {menu.sections.map((section) => (
          <BatchManagementCrossSection
            key={`${controller.batchId}-${section.key}`}
            section={section}
            comboboxProps={menu.comboboxProps}
          />
        ))}

        {menu.feedbackMessage ? (
          <Text className={classes.crossValidationMessage}>
            {menu.feedbackMessage}
          </Text>
        ) : null}

        <div className={classes.menuFooter}>
          <Button
            size="sm"
            className={classes.menuButton}
            onClick={menu.confirmButton.onClick}
            disabled={menu.confirmButton.disabled}
            loading={menu.confirmButton.loading}
          >
            Confirmar
          </Button>
        </div>
      </Menu.Dropdown>
    </Menu>
  )
}
