import { Container, Paper, Stack, Text, Title } from '@mantine/core';
import { redirect } from 'next/navigation';
import { AUTH_MODE, AUTH_ROUTES } from '@/lib/auth/constants';
import { getServerAuthSession } from '@/lib/auth/get-server-session';

export default async function AdminPage() {
  const session = await getServerAuthSession();

  if (session?.user.role !== 'admin') {
    redirect(`${AUTH_ROUTES.login}?mode=${AUTH_MODE.admin}` as never);
  }

  return (
    <Container size="md" py={56}>
      <Paper withBorder radius="lg" p="xl">
        <Stack gap="sm">
          <Title order={1}>Admin Panel</Title>
          <Text c="dimmed">
            This route is reserved for the future user management panel. The panel
            itself is intentionally not implemented yet.
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}
