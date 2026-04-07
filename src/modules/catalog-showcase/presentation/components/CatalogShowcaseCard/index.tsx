'use client';

import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Paper,
  Stack,
  Textarea,
  Text,
  Title
} from '@mantine/core';
import type { CatalogShowcaseCardProps } from '../../../types';
import { CatalogShowcaseProvider } from '../../contexts/CatalogShowcaseContext';
import { useCatalogShowcaseCard } from '../../hooks';
import { useCatalogShowcaseEditor } from './useCatalogShowcaseEditor';

export default function CatalogShowcaseCard(props: CatalogShowcaseCardProps) {
  const { state } = useCatalogShowcaseCard(props);
  const editor = useCatalogShowcaseEditor(props.id, props.catalog.headline);

  return (
    <CatalogShowcaseProvider value={props.catalog}>
      <Paper
        radius={32}
        p={{ base: 22, sm: 28 }}
        withBorder
        bg="rgba(255, 252, 245, 0.84)"
        style={{
          backdropFilter: 'blur(18px)',
          boxShadow: '0 24px 70px rgba(122, 54, 24, 0.12)',
          borderColor: 'rgba(31, 26, 23, 0.12)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.6fr) minmax(280px, 0.9fr)',
            gap: 24,
            alignItems: 'start',
            marginBottom: 28
          }}
        >
          <Stack gap="sm">
            <Text
              c="terra.8"
              fz="0.85rem"
              fw={700}
              tt="uppercase"
              style={{ letterSpacing: '0.08em' }}
            >
              Actualizado el {state.formattedUpdatedAt}
            </Text>
            <Title
              order={2}
              maw="16ch"
              fz={{ base: '2rem', sm: '3.6rem' }}
              lh={1}
            >
              {editor.state.deferredHeadline}
            </Title>
            <Text c="dimmed" maw="58ch" lh={1.7}>
              {state.summary}
            </Text>
          </Stack>

          <Card
            padding="lg"
            radius={24}
            withBorder
            bg="rgba(255, 250, 242, 0.92)"
            style={{ borderColor: 'rgba(31, 26, 23, 0.08)' }}
          >
            <Stack gap="sm">
              <Text size="sm" fw={700} c="dimmed">
                Editar titular del catalogo
              </Text>
              <Textarea
              id="catalog-headline"
              label="Titular"
              labelProps={{ className: 'sr-only' }}
              value={editor.state.headline}
              onChange={(event) => editor.handlers.setHeadline(event.target.value)}
              radius="md"
              autosize
              minRows={3}
            />
            <Button
              radius="md"
              variant="gradient"
              gradient={{ from: 'terra.5', to: 'terra.8', deg: 135 }}
              onClick={editor.handlers.saveHeadline}
              loading={editor.state.isPending}
              fullWidth
            >
              Guardar
            </Button>
            {editor.state.error ? (
              <Text c="red.8" fz="0.9rem">
                {editor.state.error}
              </Text>
            ) : null}
            </Stack>
          </Card>
        </div>

        <Grid gap="md">
          {state.highlights.map((highlight) => (
            <Grid.Col key={highlight.id} span={{ base: 12, md: 4 }}>
              <Card
                padding="xl"
                radius={24}
                withBorder
                h="100%"
                bg="#fffaf2"
                style={{ borderColor: 'rgba(122, 54, 24, 0.08)' }}
              >
                <Stack gap="md">
                  <Group justify="space-between" align="center">
                    <Badge
                      radius="xl"
                      variant="light"
                      color="terra"
                      styles={{
                        root: {
                          background: 'rgba(180, 90, 45, 0.12)',
                          color: '#7a3618',
                          fontSize: '0.8rem',
                          fontWeight: 700
                        }
                      }}
                    >
                      {highlight.tag}
                    </Badge>
                  </Group>
                  <Title order={3} fz="1.2rem">
                    {highlight.title}
                  </Title>
                  <Text c="dimmed" lh={1.6}>
                    {highlight.description}
                  </Text>
                  <Text c="moss.8" fw={700}>
                    {highlight.priceLabel}
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Paper>
    </CatalogShowcaseProvider>
  );
}
