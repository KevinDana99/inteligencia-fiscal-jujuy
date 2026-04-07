import { applyServerCache } from '@/lib/server-cache';
import { Container, Paper, Stack, Text, Title } from '@mantine/core';
import CatalogShowcaseModule from '@/modules/catalog-showcase';

export default async function HomePage() {
  'use cache';
  applyServerCache('hours', 'home-page');

  return (
    <Container size="lg" py={56} className="page-shell">
      <Paper
        className="hero"
        radius={32}
        p={{ base: 24, sm: 32 }}
        mb={32}
        withBorder
      >
        <Stack gap="md">
          <Text className="eyebrow">KamakIA Frontend Architecture</Text>
          <Title order={1} className="hero-title">
            Proyecto base con App Router, Server Components y modulo desacoplado.
          </Title>
          <Text className="hero-copy">
          Esta página consume un módulo creado con la estructura del skill: fuentes de
          datos, acciones de servidor, hooks, componentes y estrategia mock/rest.
          </Text>
        </Stack>
      </Paper>

      <CatalogShowcaseModule id="featured-catalog" />
    </Container>
  );
}
