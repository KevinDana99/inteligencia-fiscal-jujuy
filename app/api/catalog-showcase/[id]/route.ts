import { applyServerCache } from '@/lib/server-cache';
import { NextResponse } from 'next/server';
import { CACHE_REVALIDATE, CACHE_TAGS } from '@/modules/catalog-showcase/data/sources/rest/cache/cacheConfig';
import { catalogShowcaseFixture } from '@/modules/catalog-showcase/data/sources/mock/fixtures/catalogShowcaseFixture';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  'use cache';
  const { id } = await context.params;

  applyServerCache(CACHE_REVALIDATE.CATALOG_SHOWCASE, CACHE_TAGS.CATALOG_SHOWCASE(id));

  return NextResponse.json({
    id,
    headline: catalogShowcaseFixture.headline,
    summary: catalogShowcaseFixture.summary,
    updated_at: catalogShowcaseFixture.updatedAt,
    highlights: catalogShowcaseFixture.highlights.map((highlight) => ({
      id: highlight.id,
      title: highlight.title,
      description: highlight.description,
      tag: highlight.tag,
      price_label: highlight.priceLabel
    }))
  });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as { headline?: string };

  if (!body.headline) {
    return NextResponse.json(
      { success: false, error: 'headline is required' },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
