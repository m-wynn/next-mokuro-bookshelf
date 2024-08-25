import type { OcrBlock } from 'page';
import React, { useRef, useState, useEffect } from 'react';

function TextLine({
  children,
  vertical,
  isEditable,
  fontSize,
}: {
  children: React.ReactNode;
  vertical: OcrBlock['vertical'];
  isEditable: boolean;
  fontSize: number;
}) {
  const minFontSize = 12;
  const maxFontSize = 64;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      contentEditable={isEditable}
      suppressContentEditableWarning
      tabIndex={0}
      role="textbox"
      aria-label="Editable content"
      aria-multiline="true"
      className={`${isEditable ? 'inline-block' : 'hidden'} mx-auto leading-none whitespace-nowrap outline-none select-text group-hover:inline-block selection:bg-base-content`}
      style={{
        color: 'black',
        fontSize: Math.min(Math.max(fontSize, minFontSize), maxFontSize),
        writingMode: vertical ? 'vertical-rl' : 'horizontal-tb',
      }}
    >
      {children}
    </div>
  );
}

function Textbox({
  box,
  fontSize,
  vertical,
  lines,
  highlight,
  setIsEditing,
}: {
  box: OcrBlock['box'];
  fontSize: number;
  vertical: OcrBlock['vertical'];
  lines: OcrBlock['lines'];
  highlight: boolean;
  setIsEditing: (value: boolean) => void;
}) {
  const [isEditable, setIsEditable] = useState(false);

  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsEditable(false);
        setIsEditing(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      setIsEditable(false);
      setIsEditing(false);
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [setIsEditing]);

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      ref={divRef}
      onClick={() => {
        setIsEditable(true);
        setIsEditing(true);
      }}
      className={`${isEditable ? 'bg-white' : 'hover:bg-white'} flex absolute justify-between group textBox`}
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
        // eslint-disable-next-line react/no-array-index-key
        <TextLine fontSize={fontSize} key={`${box[0]}-${box[1]}-${index}`} vertical={vertical} isEditable={isEditable}>{line}</TextLine>
      ))}
    </div>
  );
}

export default Textbox;
