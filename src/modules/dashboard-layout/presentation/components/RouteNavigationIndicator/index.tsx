'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { ModalLoader } from '@/components/core/ModalLoader'

const NAVIGATION_FEEDBACK_TIMEOUT_MS = 45000

function getInternalNavigationRouteKey(event: MouseEvent) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return null
  }

  const target = event.target

  if (!(target instanceof Element)) {
    return null
  }

  const anchor = target.closest('a[href]')

  if (!(anchor instanceof HTMLAnchorElement)) {
    return null
  }

  if (
    (anchor.target && anchor.target !== '_self') ||
    anchor.hasAttribute('download')
  ) {
    return null
  }

  const nextUrl = new URL(anchor.href, window.location.href)
  const currentUrl = new URL(window.location.href)

  if (nextUrl.origin !== currentUrl.origin) {
    return null
  }

  const nextRouteKey = `${nextUrl.pathname}?${nextUrl.searchParams.toString()}`
  const currentRouteKey = `${currentUrl.pathname}?${currentUrl.searchParams.toString()}`

  return nextRouteKey === currentRouteKey ? null : nextRouteKey
}

export function RouteNavigationIndicator() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const routeKey = useMemo(
    () => `${pathname}?${searchParams.toString()}`,
    [pathname, searchParams]
  )
  const timeoutRef = useRef<number | null>(null)
  const [pendingRouteKey, setPendingRouteKey] = useState<string | null>(null)
  const isNavigating = pendingRouteKey !== null && pendingRouteKey !== routeKey

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const nextRouteKey = getInternalNavigationRouteKey(event)

      if (!nextRouteKey) {
        return
      }

      setPendingRouteKey(nextRouteKey)

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = window.setTimeout(() => {
        setPendingRouteKey(null)
      }, NAVIGATION_FEEDBACK_TIMEOUT_MS)
    }

    document.addEventListener('click', handleDocumentClick, true)

    return () => {
      document.removeEventListener('click', handleDocumentClick, true)

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <ModalLoader opened={isNavigating} message='Cargando pantalla...' />
  )
}
