import { redirect } from 'next/navigation';
import prisma from 'db';

// If you go to an old link, it redirects to the new reader
export default async function Page({
  params: { seriesName, volumeNum },
}: {
  params: { seriesName: string; volumeNum: string };
}) {
  const vNum = decodeURIComponent(volumeNum);
  const series = await prisma.series.findUnique({
    where: {
      englishName: decodeURIComponent(seriesName),
    },
    select: {
      id: true,
    },
  });
  const bookSegment = series?.id;
  if (!bookSegment) {
    return <div>No such series</div>;
  }
  const volumeSegment = vNum.match(/^Volume (\d+).html$/);
  if (!volumeSegment) {
    return <div>Could not parse volume</div>;
  }
  const dest = `/reader/${bookSegment}/${volumeSegment[1]}`;
  redirect(dest);
}
