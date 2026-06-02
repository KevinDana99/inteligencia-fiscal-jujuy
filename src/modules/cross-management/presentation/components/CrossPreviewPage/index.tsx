import Link from 'next/link'
import { Card, Stack, Text, Title } from '@mantine/core'
import { IconChevronLeft } from '@tabler/icons-react'
import { crossItemsMock } from '../../../data/sources/mock/fixtures/crossItems'
import classes from './CrossPreviewPage.module.css'

export function CrossPreviewPage({ crossId }: { crossId: string }) {
  const cross = crossItemsMock.find((item) => item.id === crossId)

  if (!cross) {
    return (
      <Card className={classes.card} radius="lg" padding="xl">
        <Stack gap="xs">
          <Title order={1} className={classes.title}>
            Cruce no encontrado
          </Title>
          <Text className={classes.description}>
            No se encontró información asociada al cruce solicitado.
          </Text>
        </Stack>
      </Card>
    )
  }

  return (
    <Stack gap="xl" className={classes.root}>
      <Link href="/gestion-de-cruces" className={classes.backLink}>
        <IconChevronLeft size={16} />
        Gestión de Cruces
      </Link>

      <Card className={classes.card} radius="lg" padding="xl">
        <Stack gap="xs">
          <Text className={classes.eyebrow}>Cruce en curso</Text>
          <Title order={1} className={classes.title}>
            {cross.name}
          </Title>
          <Text className={classes.description}>
            Vista previa inicial del cruce. La request real del detalle se conectará
            en una próxima iteración.
          </Text>
        </Stack>
      </Card>

      <div className={classes.metaGrid}>
        <Card className={classes.metaCard} radius="lg" padding="lg">
          <Stack gap={4}>
            <Text className={classes.metaLabel}>Origen</Text>
            <Text className={classes.metaValue}>{cross.source}</Text>
          </Stack>
        </Card>
        <Card className={classes.metaCard} radius="lg" padding="lg">
          <Stack gap={4}>
            <Text className={classes.metaLabel}>Lote / CUIT</Text>
            <Text className={classes.metaValue}>{cross.sourceRef}</Text>
          </Stack>
        </Card>
        <Card className={classes.metaCard} radius="lg" padding="lg">
          <Stack gap={4}>
            <Text className={classes.metaLabel}>Período</Text>
            <Text className={classes.metaValue}>{cross.period}</Text>
          </Stack>
        </Card>
        <Card className={classes.metaCard} radius="lg" padding="lg">
          <Stack gap={4}>
            <Text className={classes.metaLabel}>CUITs</Text>
            <Text className={classes.metaValue}>{cross.cuitCount}</Text>
          </Stack>
        </Card>
      </div>
    </Stack>
  )
}
