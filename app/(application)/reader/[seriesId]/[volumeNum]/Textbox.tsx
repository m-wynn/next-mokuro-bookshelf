import type { OcrBlock } from 'page';
import React from 'react';

function Textbox({
  box,
  fontSize,
  vertical,
  lines,
  highlight,
}: {
  box: OcrBlock['box'];
  fontSize: number;
  vertical: OcrBlock['vertical'];
  lines: OcrBlock['lines'];
  highlight: boolean;
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
        outline: highlight ? '0.5em solid red' : '',
      }}
    >
      {lines.map((line: string, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={`${box[0]}-${box[1]}-${index}`}
          contentEditable
          suppressContentEditableWarning
          className="hidden mx-auto leading-none whitespace-nowrap outline-none select-text group-hover:inline-block selection:bg-base-content"
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
