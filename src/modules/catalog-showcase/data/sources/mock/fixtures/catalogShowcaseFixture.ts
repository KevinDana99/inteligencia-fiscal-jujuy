import type { ICatalogShowcase } from '../../../models/CatalogShowcase';

export const catalogShowcaseFixture: ICatalogShowcase = {
  id: 'featured-catalog',
  headline: 'Colección curada para productos digitales con foco editorial',
  summary:
    'Un módulo de ejemplo pensado para demostrar arquitectura desacoplada, caché por tags y separación estricta entre datos y presentación.',
  updatedAt: '2026-04-06T00:00:00.000Z',
  highlights: [
    {
      id: 'starter-kit',
      title: 'Starter Kit',
      description:
        'Base visual y técnica para lanzar una experiencia consistente en pocas iteraciones.',
      tag: 'Foundation',
      priceLabel: 'Desde USD 49'
    },
    {
      id: 'conversion-flow',
      title: 'Conversion Flow',
      description:
        'Bloques orientados a captura, descubrimiento y activación con narrativa clara.',
      tag: 'Growth',
      priceLabel: 'Desde USD 79'
    },
    {
      id: 'ops-panel',
      title: 'Ops Panel',
      description:
        'Vista de operaciones para equipos internos con métricas, estados y trazabilidad.',
      tag: 'Operations',
      priceLabel: 'Desde USD 99'
    }
  ]
};
