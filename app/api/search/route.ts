import { auth } from 'auth/lucia';
import prisma from 'db';
import * as context from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SearchResult } from 'search';
import { shouldShowNsfw } from 'lib/userSetting';

export async function GET(request: NextRequest) {
  const session = await auth.handleRequest(request.method, context).validate();
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
      page.pageId,
      page.number,
      page."volumeId",
      "Volume".number AS "volumeNumber",
      "Series".id AS "seriesId",
      "Series"."japaneseName" AS "japaneseName",
      "Series"."englishName" AS "englishName",
      text,
      score,
      CAST(block_number - 1 AS SMALLINT) AS "blockNumber",
      isReading
    FROM (
      SELECT
        pageId,
        number,
        "volumeId",
        score,
        string_agg(line, '') text,
        block_number,
        isReading
      FROM (
        SELECT 
          "Page".id as pageId,
          "Page".number,
          "Page"."volumeId",
          ocr ->> 'blocks' blocks,
          pgroonga_score("Page".tableoid, "Page".ctid) AS score,
          CASE WHEN "Reading".id IS NULL THEN false ELSE true END AS isReading
        FROM "Page"
        INNER JOIN "Volume" ON "Volume".id = "Page"."volumeId"
        INNER JOIN "Series" ON "Series".id = "Volume"."seriesId"
        LEFT JOIN "Reading" ON "Reading"."volumeId" = "Page"."volumeId" AND "Reading"."userId" = $2
        WHERE fulltext &@ $1 ${nsfwFilter}
      ),
      jsonb_array_elements(blocks::jsonb) WITH ORDINALITY AS t(block, block_number),
      jsonb_array_elements_text(block -> 'lines') AS line
      WHERE block &@ $1
      GROUP BY pageId, number, "volumeId", block, score, block_number, isReading
      ORDER BY isReading DESC, score DESC, "volumeId", number ASC
      LIMIT 20
      OFFSET $3
    ) page
    JOIN "Volume" ON "Volume".id = "volumeId"
    JOIN "Series" ON "Series".id = "Volume"."seriesId"
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
