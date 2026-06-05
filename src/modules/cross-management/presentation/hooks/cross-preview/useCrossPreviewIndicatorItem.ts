'use client'

import { useMemo } from 'react'
import type { ICrossPreviewIndicator } from '../../../data/models/CrossManagement'
import classes from '../../components/CrossPreviewPage/CrossPreviewPage.module.css'

const indicatorClassByTone: Record<ICrossPreviewIndicator['tone'], string> = {
  blue: classes.indicatorBlue,
  violet: classes.indicatorViolet,
  green: classes.indicatorGreen,
  orange: classes.indicatorOrange,
  red: classes.indicatorRed,
  darkBlue: classes.indicatorDarkBlue
}

export function useCrossPreviewIndicatorItem(tone: ICrossPreviewIndicator['tone']) {
  const swatchClassName = useMemo(
    () => `${classes.indicatorSwatch} ${indicatorClassByTone[tone]}`,
    [tone]
  )

  return { swatchClassName }
}
