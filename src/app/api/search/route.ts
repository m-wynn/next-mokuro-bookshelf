import { validateApiSession } from 'auth/context-adapter';
import prisma from 'db';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SearchResult } from 'search';
import { shouldShowNsfw } from 'lib/userSetting';

export async function GET(request: NextRequest) {
  const session = await validateApiSession(request.method);
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const offset = parseInt(searchParams.get('offset') ?? '0', 10);

  if (q === '') {
    return NextResponse.json([]);
  }

  if (q != null) {
    const showNsfw = await shouldShowNsfw(session.user.userId);
    let nsfwFilter = '';
    if (!showNsfw) {
      nsfwFilter = 'AND "Series"."isNsfw" = false';
    }

    const rawQuery = `
      SELECT
        "Page".id as "pageId",
        CAST((idx - 1) AS INT) AS "blockNumber",
        t.text_element AS text,
        "Page".number,
        "Page"."volumeId" as volumeid,
        "Volume".number AS "volumeNumber",
        "Series".id AS "seriesId",
        "Series"."japaneseName" AS "japaneseName",
        "Series"."englishName" AS "englishName",
        (CASE WHEN "Reading".id IS NOT NULL THEN true ELSE false END) AS "isReading"
      FROM "Page"
      LEFT JOIN "Reading" ON "Reading"."userId" = $2 AND "Reading"."volumeId" = "Page"."volumeId"
      INNER JOIN "Volume" ON "Volume".id = "Page"."volumeId"
      INNER JOIN "Series" ON "Series".id = "Volume"."seriesId"
      CROSS JOIN LATERAL unnest("blockText") WITH ORDINALITY AS t(text_element, idx)
      WHERE
        "Page"."blockText" &@ $1
        AND
        t.text_element &@ $1
        ${nsfwFilter}
      ORDER BY "isReading" DESC, "Page"."volumeId", number ASC
      LIMIT 20
      OFFSET $3
    `;

    const pages: SearchResult[] = await prisma.$queryRawUnsafe(
      rawQuery,
      q,
      session.user.userId,
      offset,
    );

    if (pages == null) {
      return NextResponse.json({ error: 'No such lines' }, { status: 404 });
    }

    return NextResponse.json(pages);
  }
  return NextResponse.json({ error: 'Missing query' }, { status: 400 });
}
