'use client'
import {
  Alert,
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useFormStatus } from 'react-dom'
import {
  IconAlertCircle,
  IconEye,
  IconEyeOff,
  IconInfoCircle
} from '@tabler/icons-react'
import { AUTH_MOCK_USERS } from '@/lib/auth/constants'
import { MockCredentialsCard } from './MockCredentialsCard'
import { useLoginForm } from './useLoginForm'
import classes from './LoginForm.module.css'
import Image from 'next/image'

const isMockAuthEnabled = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true'

export default function LoginForm() {
  return <LoginFormContent />
}

function LoginFormContent() {
  const {
    isPending,
    formAction,
    error,
    formRef,
    recoveryNoticeVisible,
    sessionExpiredNoticeVisible,
    sessionExpiredNoticeMessage,
    hasError,
    handleSubmitAttempt,
    handleRecoveryNotice,
    hideRecoveryNotice
  } = useLoginForm()

  return (
    <section className={classes.shell}>
      <div
        className={classes.brand}
        aria-label='Direccion Provincial de Rentas'
      >
        <Image
          src='/assets/branding/logo.svg'
          alt='Dirección Provincial de Rentas'
          width={170}
          height={40.7}
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

        {isMockAuthEnabled ? <MockCredentialsCard /> : null}

        <form
          ref={formRef}
          className={classes.form}
          action={formAction}
          onSubmit={handleSubmitAttempt}
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
              name='correo'
              defaultValue={
                isMockAuthEnabled ? AUTH_MOCK_USERS.user.email : undefined
              }
              onChange={hideRecoveryNotice}
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
              name='contrasena'
              defaultValue={
                isMockAuthEnabled ? AUTH_MOCK_USERS.user.password : undefined
              }
              onChange={hideRecoveryNotice}
              disabled={isPending}
              visibilityToggleIcon={({ reveal }) =>
                reveal ? (
                  <IconEyeOff className={classes.eyeIcon} stroke={2} />
                ) : (
                  <IconEye className={classes.eyeIcon} stroke={2} />
                )
              }
              className={`${classes.passwordInput} ${hasError ? classes.inputError : ''}`}
            />
          </Stack>

          {hasError ? (
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

          {sessionExpiredNoticeVisible && !hasError ? (
            <Alert
              variant='light'
              color='blue'
              icon={
                <IconInfoCircle className={classes.infoIcon} stroke={1.8} />
              }
              className={classes.infoAlert}
            >
              {sessionExpiredNoticeMessage}
            </Alert>
          ) : null}

          {recoveryNoticeVisible ? (
            <Alert
              variant='light'
              color='blue'
              icon={
                <IconInfoCircle className={classes.infoIcon} stroke={1.8} />
              }
              className={classes.infoAlert}
            >
              Para recuperar o cambiar la contraseña,
              <br />
              deberá comunicarse con el equipo técnico.
            </Alert>
          ) : null}

          <Group justify='space-between' mt='sm' className={classes.supportRow}>
            <Text c='dimmed' className={classes.supportHint}>
              ¿Olvidaste tu contraseña?
            </Text>
            <Text
              component='button'
              type='button'
              onClick={handleRecoveryNotice}
              className={classes.supportButton}
            >
              Recuperar contraseña
            </Text>
          </Group>

          <LoginSubmitButton />

          {!isMockAuthEnabled ? (
            <Text className={classes.credentialsHint}>
              Usa tus credenciales institucionales para ingresar.
            </Text>
          ) : null}
        </form>
      </Paper>
      <Image
        width={100}
        height={200}
        src='/assets/branding/login-wave.svg'
        alt='wave-svg'
        className={classes.wave}
      />
    </section>
  )
}

function LoginSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type='submit'
      variant='filled'
      color='blue.5'
      size='lg'
      radius='xl'
      fullWidth
      disabled={pending}
      className={classes.button}
      loaderProps={{
        children: <div className={classes.loader} />
      }}
      loading={pending}
    >
      Ingresar
    </Button>
  )
}
