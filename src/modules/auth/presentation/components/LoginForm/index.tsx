'use client';

import { Alert, Button, Card, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useLoginForm } from './useLoginForm';

export default function LoginForm() {
  const {
    email,
    password,
    isPending,
    error,
    setEmail,
    setPassword,
    handleSubmit
  } = useLoginForm();

  return (
    <Card withBorder radius="lg" padding="xl">
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={2}>Sign in</Title>
          <Text c="dimmed" size="sm">
            Use your IAM credentials to access the private area.
          </Text>
        </Stack>

        {error ? <Alert color="red">{error}</Alert> : null}

        <TextInput
          label="Email"
          placeholder="admin@plantilla.local"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          disabled={isPending}
        />

        <PasswordInput
          label="Password"
          placeholder="ChangeMe123!"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          disabled={isPending}
        />

        <Button onClick={handleSubmit} loading={isPending}>
          Sign in
        </Button>
      </Stack>
    </Card>
  );
}
