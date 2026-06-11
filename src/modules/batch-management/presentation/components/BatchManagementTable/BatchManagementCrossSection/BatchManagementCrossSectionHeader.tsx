'use client'

import { IconChevronDown } from '@tabler/icons-react'
import classes from './BatchManagementCrossSection.module.css'

type BatchManagementCrossSectionHeaderProps = {
  title: string
  pillLabel: string
  isOpen: boolean
  isMonthly: boolean
  onToggle: () => void
}

export function BatchManagementCrossSectionHeader({
  title,
  pillLabel,
  isOpen,
  isMonthly,
  onToggle
}: BatchManagementCrossSectionHeaderProps) {
  return (
    <button
      type="button"
      className={`${classes.crossSectionToggle} ${isMonthly ? classes.monthlySectionToggle : classes.annualSectionToggle}`}
      onClick={onToggle}
    >
      <span className={classes.crossSectionLeft}>
        <span className={isMonthly ? classes.monthlyPill : classes.annualPill}>
          {pillLabel}
        </span>
        <span className={classes.crossSectionTitle}>{title}</span>
      </span>
      <IconChevronDown
        size={13}
        className={`${classes.crossSectionChevron} ${isOpen ? classes.crossSectionChevronOpen : ''}`}
      />
    </button>
  )
}
