CREATE EXTENSION IF NOT EXISTS pgroonga;
CREATE INDEX pgroonga_blocks_index ON public."Page" USING pgroonga (((ocr ->> 'blocks'::text))) WITH (tokenizer='TokenMecab')

