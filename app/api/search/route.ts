import { auth } from 'auth/lucia';
import prisma from 'db';
import * as context from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SearchResult } from 'search';

export async function GET(request: NextRequest) {
  const session = await auth.handleRequest(request.method, context).validate();
  if (!session) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();

  if (q === '') {
    return NextResponse.json([]);
  }

  if (q != null) {
    const pages: SearchResult[] = await prisma.$queryRaw`
    SELECT 
      page.number,
      page."volumeId",
      "Volume".number AS "volumeNumber",
      "Series".id as "seriesId",
      "Series"."japaneseName" AS "japaneseName",
      "Series"."englishName" AS "englishName",
      text,
      score,
      CASE WHEN "Reading".id IS NULL THEN false ELSE true END AS is_reading
    FROM (
      SELECT
        number,
        "volumeId",
        score,
        string_agg(line, '') text
      FROM (
        SELECT 
          id,
          number,
          "volumeId",
          ocr ->> 'blocks' blocks,
          pgroonga_score(tableoid, ctid) AS score
        FROM "Page"
        WHERE ocr ->> 'blocks' &@ ${q}
      ),
      jsonb_array_elements(blocks::jsonb) as block,
      jsonb_array_elements_text(block -> 'lines') as line
      WHERE block &@ ${q}
      GROUP BY id, number, "volumeId", block, score
      LIMIT 20
    ) page
    JOIN "Volume" ON "Volume".id = "volumeId"
    JOIN "Series" ON "Series".id = "Volume"."seriesId"
    LEFT JOIN "Reading" ON "Reading"."volumeId" = "Volume"."id" AND "Reading"."userId" = ${session.user.userId}
    ORDER BY is_reading DESC, score, number ASC
`;

    if (pages == null) {
      return NextResponse.json({ error: 'No such lines' }, { status: 404 });
    }

    return NextResponse.json(pages);
  }
  return NextResponse.json({ error: 'Missing query' }, { status: 400 });
}
