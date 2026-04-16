import { Container, Paper, Stack, Text, Title } from '@mantine/core';
import { requireAdminSession } from '@/lib/auth/require-admin-session';

export default async function AdminPage() {
  await requireAdminSession();

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
