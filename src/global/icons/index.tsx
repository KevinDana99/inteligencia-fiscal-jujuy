import { IDashboardNavItem } from '@/modules/dashboard-layout/types'
import {
  IconActivity,
  IconAdjustmentsHorizontal,
  IconClockHour4,
  IconLayoutGrid,
  IconSearch
} from '@tabler/icons-react'

type IconSchemaType = IDashboardNavItem['icon']
const iconMapList: Record<IconSchemaType, typeof IconLayoutGrid> = {
  grid: IconLayoutGrid,
  activity: IconActivity,
  clock: IconClockHour4,
  search: IconSearch,
  sliders: IconAdjustmentsHorizontal
}

const CustomIcon = (props: {
  name: keyof typeof iconMapList
  size?: number
  color?: string
}) => {
  console.log({ props })
  const SelectedIcon = iconMapList[props.name]
  return <SelectedIcon {...props} />
}

export default CustomIcon
