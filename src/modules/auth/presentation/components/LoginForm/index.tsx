'use client';

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
} from '@mantine/core';
import Link from 'next/link';
import { AUTH_MODE } from '@/lib/auth/constants';
import { useLoginForm } from './useLoginForm';
import classes from './LoginForm.module.css';

export default function LoginForm({
  mode
}: {
  mode: (typeof AUTH_MODE)[keyof typeof AUTH_MODE];
}) {
  return <LoginFormContent key={mode} />;
}

function LoginFormContent() {
  const {
    email,
    password,
    isPending,
    error,
    recoveryHref,
    setEmail,
    setPassword,
    handleSubmit
  } = useLoginForm();

  const hasError = Boolean(error);

  return (
    <section className={classes.shell}>
      <div className={classes.brand} aria-label="Direccion Provincial de Rentas">
        <img
          src="/assets/branding/logo.svg"
          alt="Dirección Provincial de Rentas"
          className={classes.brandLogo}
        />
      </div>

      <Paper
        shadow="xl"
        radius="lg"
        p="xl"
        className={classes.card}
        component="section"
      >
        <Stack gap="xs" mb="lg" className={classes.header}>
          <Title order={2} className={classes.title}>
            Sistema de Inteligencia
            <br />
            Fiscal de Rentas
          </Title>
          <Text c="dimmed" fz="sm" className={classes.subtitle}>
            Panel de Administración — Acceso restringido
          </Text>
        </Stack>

        <Stack
          component="form"
          className={classes.form}
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <Stack gap={6}>
            <Text component="label" htmlFor="login-email" className={classes.fieldLabel}>
              EMAIL
            </Text>
            <TextInput
              id="login-email"
              aria-label="Email"
              placeholder="Ejemplo@gmail.com"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              disabled={isPending}
              className={`${classes.textInput} ${hasError ? classes.inputError : ''}`}
            />
          </Stack>

          <Stack gap={6} mt={8}>
            <Text component="label" htmlFor="login-password" className={classes.fieldLabel}>
              PASSWORD
            </Text>
            <PasswordInput
              id="login-password"
              aria-label="Contraseña"
              placeholder="**********"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              disabled={isPending}
              className={`${classes.passwordInput} ${hasError ? classes.inputError : ''}`}
            />
          </Stack>

          {error ? (
            <Alert
              variant="light"
              color="red"
              className={classes.errorAlert}
            >
              {error}
            </Alert>
          ) : null}

          <Group justify="space-between" mt="sm" className={classes.supportRow}>
            <Text c="dimmed" className={classes.supportHint}>
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
            type="submit"
            variant="filled"
            color="blue"
            size="lg"
            radius="xl"
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
            Credenciales de prueba:
            {' '}
            <strong>admin@rentas.gob.ar / admin123</strong>
          </Text>
        </Stack>
      </Paper>

      <img
        src="/assets/branding/login-wave.svg"
        alt=""
        aria-hidden="true"
        className={classes.wave}
      />
    </section>
  );
}
