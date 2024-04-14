BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "fulltext" TEXT NOT NULL DEFAULT '';

-- Populate new column with data
UPDATE "Page"
SET fulltext = agg_lines.all_lines
FROM (
    SELECT id, string_agg(line, '') AS all_lines
    FROM (
        SELECT "Page".id, jsonb_array_elements_text(block->'lines') AS line
        FROM "Page",
        LATERAL jsonb_array_elements(ocr->'blocks') AS block
    ) AS lines
    GROUP BY id
) AS agg_lines
WHERE "Page".id = agg_lines.id;

COMMIT;

-- Recreate fulltext index with new column
DROP INDEX pgroonga_blocks_index;
CREATE INDEX pgroonga_blocks_index ON public."Page" USING pgroonga (fulltext) WITH (tokenizer='TokenMecab');
