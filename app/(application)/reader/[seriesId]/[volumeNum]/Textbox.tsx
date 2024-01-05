import type { OcrBlock } from 'page';
import React from 'react';

function Textbox({
  box,
  fontSize,
  vertical,
  lines,
}: {
  box: OcrBlock['box'];
  fontSize: number;
  vertical: OcrBlock['vertical'];
  lines: OcrBlock['lines'];
}) {
  const minFontSize = 12;
  const maxFontSize = 64;
  return (
    <div
      className="flex absolute justify-between hover:bg-white group textBox"
      style={{
        left: box[0],
        top: box[1],
        width: box[2] - box[0],
        height: box[3] - box[1],
        // assign z-index ordering from largest to smallest boxes
        // so that the smaller boxes don't get hidden underneath larger ones
        zIndex: 10000 - ((box[2] - box[0]) * (box[3] - box[1])) / 1000,
        flexDirection: vertical ? 'row-reverse' : 'column',
      }}
    >
      {lines.map((line: string) => (
        <div
          key={line}
          className="hidden mx-auto leading-none whitespace-nowrap select-text group-hover:inline-block"
          style={{
            color: 'black',
            fontSize: Math.min(Math.max(fontSize, minFontSize), maxFontSize),
            writingMode: vertical ? 'vertical-rl' : 'horizontal-tb',
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

export default Textbox;
