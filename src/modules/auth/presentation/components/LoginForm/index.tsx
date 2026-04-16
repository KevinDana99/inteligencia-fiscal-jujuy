'use client';

import Link from 'next/link';
import localFont from 'next/font/local';
import {
  Alert,
  Anchor,
  Button,
  Loader,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { useLoginForm } from './useLoginForm';
import classes from './LoginForm.module.css';

const inter = localFont({
  src: [
    {
      path: '../../../../../../public/fonts/inter/Inter-Regular.otf',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../../../../../public/fonts/inter/Inter-Medium.otf',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../../../../../../public/fonts/inter/Inter-SemiBold.otf',
      weight: '600',
      style: 'normal'
    },
    {
      path: '../../../../../../public/fonts/inter/Inter-Bold.otf',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../../../../../../public/fonts/inter/Inter-Black.otf',
      weight: '900',
      style: 'normal'
    }
  ],
  display: 'swap'
});

export default function LoginForm() {
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
    <section className={`${classes.shell} ${inter.className}`}>
      <div className={classes.brand} aria-label="Direccion Provincial de Rentas">
        <img
          src="/assets/branding/logo.svg"
          alt="Dirección Provincial de Rentas"
          className={classes.brandLogo}
        />
      </div>

      <div className={classes.card}>
        <Stack className={classes.header}>
          <Title order={1} className={classes.title}>
            Sistema de Inteligencia
            <br />
            Fiscal de Rentas
          </Title>
          <Text className={classes.subtitle}>Iniciá el análisis de contribuyentes</Text>
        </Stack>

        <Stack className={classes.form} component="form" onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}>
          <Stack className={classes.fieldGroup}>
            <Text component="label" htmlFor="login-email" className={classes.fieldLabel} c="dimmed">
              Email<span className={classes.fieldLabelRequired}>*</span>
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

          <Stack className={classes.fieldGroup}>
            <Text component="label" htmlFor="login-password" className={classes.fieldLabel} c="dimmed">
              Contraseña<span className={classes.fieldLabelRequired}>*</span>
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
              color="gray"
              variant="light"
              className={classes.errorAlert}
              title=""
            >
              {error}
            </Alert>
          ) : null}

          <div className={classes.footer}>
            <Text className={classes.footerHint}>¿Olvidaste tu contraseña?</Text>
            <Anchor
              component={Link}
              href={recoveryHref as never}
              className={classes.link}
            >
              Recuperar contraseña
            </Anchor>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className={classes.button}
            loaderProps={{
              children: <Loader size={18} color="white" />
            }}
            loading={isPending}
          >
            Ingresar
          </Button>
        </Stack>
      </div>
    </section>
  );
}
