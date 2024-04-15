-- CreateIndex
CREATE INDEX pgroonga_blocks_index ON public."Page" USING pgroonga ("blockText");
