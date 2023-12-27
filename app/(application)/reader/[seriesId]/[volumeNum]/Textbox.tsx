import React from "react";

export const Textbox = ({ box, fontSize, vertical, lines }) => {
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
        flexDirection: vertical ? "row-reverse" : "column",
      }}
    >
      {lines.map((line: string, i: number) => (
        <div
          key={i}
          className="hidden mx-auto leading-none whitespace-nowrap select-text group-hover:inline-block"
          style={{
            color: "black",
            fontSize:
              fontSize < minFontSize
                ? minFontSize
                : fontSize > maxFontSize
                  ? maxFontSize
                  : fontSize,
            writingMode: vertical ? "vertical-rl" : "horizontal-tb",
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

export default Textbox;
