/**
 * @jest-environment jsdom
 */

import React, { useLayoutEffect } from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { AUTH_SESSION_EXPIRED_NOTICE_COOKIE } from '@/lib/auth/session-expired-notice'
import { useLoginForm } from './useLoginForm'

jest.mock('../../../data/actions/commands/signInAction', () => ({
  signInAction: jest.fn()
}))

type HookValue = ReturnType<typeof useLoginForm>
type ReactActEnvironmentGlobal = typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean
}

const reactActEnvironmentGlobal = globalThis as ReactActEnvironmentGlobal

function HookHarness({ onChange }: { onChange: (value: HookValue) => void }) {
  const value = useLoginForm()

  useLayoutEffect(() => {
    onChange(value)
  }, [onChange, value])

  return null
}

async function flushAsyncWork() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 0)
  })
}

describe('useLoginForm notices', () => {
  let container: HTMLDivElement
  let root: Root
  let latestValue: HookValue | null

  beforeEach(() => {
    reactActEnvironmentGlobal.IS_REACT_ACT_ENVIRONMENT = true
    latestValue = null
    document.cookie = `${AUTH_SESSION_EXPIRED_NOTICE_COOKIE}=1; path=/`
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => {
      root.unmount()
    })

    document.cookie = `${AUTH_SESSION_EXPIRED_NOTICE_COOKIE}=; Max-Age=0; path=/`
    container.remove()
    reactActEnvironmentGlobal.IS_REACT_ACT_ENVIRONMENT = undefined
  })

  it('shows only the recovery notice after an expired-session notice', async () => {
    await act(async () => {
      root.render(
        React.createElement(HookHarness, {
          onChange: (value: HookValue) => {
            latestValue = value
          }
        })
      )
    })

    await act(async () => {
      await flushAsyncWork()
    })

    expect(latestValue?.sessionExpiredNoticeVisible).toBe(true)
    expect(latestValue?.recoveryNoticeVisible).toBe(false)

    await act(async () => {
      latestValue?.handleRecoveryNotice()
    })

    expect(latestValue?.sessionExpiredNoticeVisible).toBe(false)
    expect(latestValue?.recoveryNoticeVisible).toBe(true)
  })
})
