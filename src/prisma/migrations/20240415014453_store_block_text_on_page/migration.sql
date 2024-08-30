BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

ALTER TABLE "Page" ADD COLUMN "blockText" TEXT[];

UPDATE "Page"
SET "blockText" = agg_blocks.all_blocks
FROM (
    SELECT id, array_agg(block_lines ORDER BY block_index) AS all_blocks
    FROM (
        SELECT "Page".id, block_index, string_agg(line, '' ORDER BY line_index) AS block_lines
        FROM "Page",
        LATERAL jsonb_array_elements(ocr->'blocks') WITH ORDINALITY AS block(block_content, block_index)
        CROSS JOIN LATERAL jsonb_array_elements_text(block_content->'lines') WITH ORDINALITY AS line(line, line_index)
        GROUP BY "Page".id, block_index
    ) AS blocks
    GROUP BY id
) AS agg_blocks
WHERE "Page".id = agg_blocks.id;

COMMIT;

DROP INDEX IF EXISTS pgroonga_blocks_index;
