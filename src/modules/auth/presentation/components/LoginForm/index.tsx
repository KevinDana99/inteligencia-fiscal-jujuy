'use client'

import {
  Alert,
  Anchor,
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import Link from 'next/link'
import { AUTH_MODE } from '@/lib/auth/constants'
import { useLoginForm } from './useLoginForm'
import classes from './LoginForm.module.css'

export default function LoginForm({
  mode
}: {
  mode: (typeof AUTH_MODE)[keyof typeof AUTH_MODE]
}) {
  return <LoginFormContent key={mode} mode={mode} />
}

function EyeIcon({ off }: { off: boolean }) {
  if (off) {
    return (
      <svg aria-hidden='true' viewBox='0 0 24 24' className={classes.eyeIcon}>
        <path
          d='M3 3L21 21M10.58 10.58A2 2 0 0 0 13.42 13.42M9.88 5.09A10.94 10.94 0 0 1 12 4.91c5.05 0 9.27 3.11 10.5 7.09a10.96 10.96 0 0 1-4.04 5.46M6.1 6.1A10.94 10.94 0 0 0 1.5 12c1.23 3.98 5.45 7.09 10.5 7.09 1.55 0 3.03-.29 4.38-.82'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.7'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    )
  }

  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className={classes.eyeIcon}>
      <path
        d='M1.5 12S5.5 4.91 12 4.91 22.5 12 22.5 12 18.5 19.09 12 19.09 1.5 12 1.5 12Z'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.7'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle
        cx='12'
        cy='12'
        r='3'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.7'
      />
    </svg>
  )
}

function LoginFormContent({
  mode
}: {
  mode: (typeof AUTH_MODE)[keyof typeof AUTH_MODE]
}) {
  const {
    email,
    password,
    isPending,
    error,
    recoveryHref,
    setEmail,
    setPassword,
    handleSubmit
  } = useLoginForm(mode)

  const hasError = Boolean(error)

  return (
    <section className={classes.shell}>
      <div
        className={classes.brand}
        aria-label='Direccion Provincial de Rentas'
      >
        <img
          src='/assets/branding/logo.svg'
          alt='Dirección Provincial de Rentas'
          className={classes.brandLogo}
        />
      </div>

      <Paper
        shadow='xl'
        radius='lg'
        p='xl'
        className={classes.card}
        component='section'
      >
        <Stack gap='xs' mb='lg' className={classes.header}>
          <Title order={1} className={classes.title}>
            Sistema de Inteligencia
            <br />
            Fiscal de Rentas
          </Title>
          <Text c='dimmed' fz='sm'>
            Panel de Administración — Acceso restringido
          </Text>
        </Stack>

        <Stack
          component='form'
          className={classes.form}
          onSubmit={(event) => {
            event.preventDefault()
            handleSubmit()
          }}
        >
          <Stack gap={6}>
            <Text
              component='label'
              htmlFor='login-email'
              className={classes.fieldLabel}
            >
              EMAIL <span className={classes.requiredMark}>*</span>
            </Text>
            <TextInput
              id='login-email'
              aria-label='Email'
              placeholder='admin@rentas.gob.ar'
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              disabled={isPending}
              className={`${classes.textInput} ${hasError ? classes.inputError : ''}`}
            />
          </Stack>

          <Stack gap={6} mt={8}>
            <Text
              component='label'
              htmlFor='login-password'
              className={classes.fieldLabel}
            >
              CONTRASEÑA <span className={classes.requiredMark}>*</span>
            </Text>
            <PasswordInput
              id='login-password'
              aria-label='Contraseña'
              placeholder='••••••••'
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              disabled={isPending}
              visibilityToggleIcon={({ reveal }) => <EyeIcon off={!reveal} />}
              className={`${classes.passwordInput} ${hasError ? classes.inputError : ''}`}
            />
          </Stack>

          {error ? (
            <Alert
              variant='light'
              color='red'
              icon={
                <IconAlertCircle className={classes.alertIcon} stroke={1.8} />
              }
              className={classes.errorAlert}
            >
              {error}
            </Alert>
          ) : null}

          <Group justify='space-between' mt='sm' className={classes.supportRow}>
            <Text c='dimmed' className={classes.supportHint}>
              ¿Olvidaste tu contraseña?
            </Text>
            <Anchor
              component={Link}
              href={recoveryHref as never}
              className={classes.supportButton}
            >
              Recuperar contraseña
            </Anchor>
          </Group>

          <Button
            type='submit'
            variant='filled'
            color='blue.5'
            size='lg'
            radius='xl'
            fullWidth
            disabled={isPending}
            className={classes.button}
            loaderProps={{
              children: <div className={classes.loader} />
            }}
            loading={isPending}
          >
            Ingresar
          </Button>

          <Text className={classes.credentialsHint}>
            Credenciales de prueba:{' '}
            <strong>user@plantilla.local / ChangeMe123!</strong>
          </Text>
        </Stack>
      </Paper>

      <svg
        className={classes.wave}
        height={200}
        viewBox='0 0 1440 200'
        preserveAspectRatio='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M0,120 C240,60 480,180 720,120 C960,60 1200,160 1440,100 L1440,200 L0,200 Z'
          fill='#dbeafe'
          opacity='0.5'
        />
        <path
          d='M0,140 C180,80 360,170 540,130 C720,90 900,160 1080,120 C1260,80 1380,150 1440,120 L1440,200 L0,200 Z'
          fill='#bfdbfe'
          opacity='0.8'
        />
      </svg>
    </section>
  )
}
