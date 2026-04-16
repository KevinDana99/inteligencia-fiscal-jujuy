import { Container, Paper, Stack, Text, Title } from '@mantine/core';
import AuthModule from '@/modules/auth';
import CatalogShowcaseModule from '@/modules/catalog-showcase';

export default async function HomePage() {
  return (
    <Container size="lg" py={56} className="page-shell">
      <Paper radius={32} p={{ base: 24, sm: 32 }} mb={32} withBorder>
        <Stack gap="md">
          <Text className="eyebrow">KamakIA Frontend Architecture</Text>
          <Title order={1} className="hero-title">
            Private workspace protected with proxy and server-side session checks.
          </Title>
          <Text className="hero-copy">
            This page now requires authentication and exposes the current session through
            the auth module.
          </Text>
          <AuthModule />
        </Stack>
      </Paper>

      <CatalogShowcaseModule id="featured-catalog" />
    </Container>
  );
}
