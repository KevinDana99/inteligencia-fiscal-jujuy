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
import {
  IconAlertCircle,
  IconEye,
  IconEyeOff,
  IconInfoCircle
} from '@tabler/icons-react'
import { useLoginForm } from './useLoginForm'
import classes from './LoginForm.module.css'
import Image from 'next/image'

export default function LoginForm() {
  return <LoginFormContent />
}

function LoginFormContent() {
  const {
    email,
    password,
    isPending,
    error,
    recoveryNoticeVisible,
    hasError,
    setEmail,
    setPassword,
    showRecoveryNotice,
    handleSubmit
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
              visibilityToggleIcon={({ reveal }) =>
                reveal ? <IconEye /> : <IconEyeOff />
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
              onClick={showRecoveryNotice}
              className={classes.supportButton}
            >
              Recuperar contraseña
            </Text>
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
