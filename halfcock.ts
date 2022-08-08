import * as sharp from "sharp";
import { promisify } from "util";
const nearestColor = require("nearest-color");
const getPixels = promisify(require("get-pixels"));
const rgbHex = require("rgb-hex");

export type Pal = 16 | 99 | "gray";

const FULL = "█";
const HALF = "▀";
const COLOR = "";

export async function halfcock(buffer: Buffer, pal: Pal = 99, w = 70, h = 1000, bgcolor = { r:255, g:255, b:255 }): Promise<string[]> {
  const image = await sharp(buffer)
    .flatten({ background: '#'+rgbHex(bgcolor.r, bgcolor.g, bgcolor.b) })
    .resize(w, h, {
      background: bgcolor,
      withoutEnlargement: true,
      fit: 'inside'
    })
    .toFormat("png")
    .toBuffer();
  let pixels = await getPixels(image, "image/png");
  if (pixels.shape.length === 4) {
    pixels = pixels.pick(0, null, null, null);
  }
  const [width, height] = pixels.shape;
  const nearest = Pal.nearest(pal);
  const lines: string[] = [];
  for (let y = 0; y < height; y += 2) {
    let line = "";
    for (let x = 0; x < width; x++) {
      const top = getColor(pixels, x, y, nearest);
      let lastTop = null;
      let bottom = "1";
      let lastBottom = "1";
      if (y < height - 1) {
        bottom = getColor(pixels, x, y + 1, nearest);
        if (x > 0) {
          lastBottom = getColor(pixels, x - 1, y + 1, nearest);
        }
      }
      if (x > 0) {
        lastTop = getColor(pixels, x - 1, y, nearest);
      }
      const repeatColor = top === lastTop && bottom === lastBottom;
      const solidColor = top === bottom;
      const colored = repeatColor
        ? (solidColor ? FULL : HALF)
        : (solidColor ? COLOR + top + FULL : COLOR + top + "," + bottom + HALF);
      line += colored;
    }
    lines.push(line);
  }
  return lines;
}

function getColor(pixels: any, x: number, y: number, nearest: any): string {
  const r = pixels.get(x, y, 0);
  const g = pixels.get(x, y, 1);
  const b = pixels.get(x, y, 2);
  return nearest("#" + rgbHex(r, g, b)).name;
}

module Pal {
  export function nearest(pal: Pal) {
    switch (pal) {
      case 16: return nearest16;
      case 99: return nearest99;
      case "gray": return nearestGray;
    }
  }
}

const nearest99 = nearestColor.from({
  "0": "#ffffff",
  "1": "#000000",
  "2": "#00007f",
  // "3": "#009300",
  "4": "#ff0000",
  // "5": "#7f0000",
  "6": "#9c009c",
  "7": "#fc7f00",
  "8": "#ffff00",
  // "9": "#00fc00",
  "10": "#009393",
  "11": "#00ffff",
  "12": "#0000fc",
  "13": "#ff00ff",
  "14": "#7f7f7f",
  "15": "#d2d2d2",
  "16": "#470000",
  "17": "#472100",
  "18": "#474700",
  "19": "#324700",
  "20": "#004700",
  "21": "#00472c",
  "22": "#004747",
  "23": "#002747",
  "24": "#000047",
  "25": "#2e0047",
  "26": "#470047",
  "27": "#47002a",
  "28": "#740000",
  "29": "#743a00",
  "30": "#747400",
  "31": "#517400",
  "32": "#007400",
  "33": "#007449",
  "34": "#007474",
  "35": "#004074",
  "36": "#000074",
  "37": "#4b0074",
  "38": "#740074",
  "39": "#740045",
  "40": "#b50000",
  "41": "#b56300",
  "42": "#b5b500",
  "43": "#7db500",
  "44": "#00b500",
  "45": "#00b571",
  "46": "#00b5b5",
  "47": "#0063b5",
  "48": "#0000b5",
  "49": "#7500b5",
  "50": "#b500b5",
  "51": "#b5006b",
  "52": "#ff0000",
  "53": "#ff8c00",
  // "54": "#ffff00",
  "55": "#b2ff00",
  "56": "#00ff00",
  "57": "#00ffa0",
  // "58": "#00ffff",
  "59": "#008cff",
  "60": "#0000ff",
  "61": "#a500ff",
  // "62": "#ff00ff",
  "63": "#ff0098",
  "64": "#ff5959",
  "65": "#ffb459",
  "66": "#ffff71",
  "67": "#cfff60",
  "68": "#6fff6f",
  "69": "#65ffc9",
  "70": "#6dffff",
  "71": "#59b4ff",
  "72": "#5959ff",
  "73": "#c459ff",
  "74": "#ff66ff",
  "75": "#ff59bc",
  "76": "#ff9c9c",
  "77": "#ffd39c",
  "78": "#ffff9c",
  "79": "#e2ff9c",
  "80": "#9cff9c",
  "81": "#9cffdb",
  "82": "#9cffff",
  "83": "#9cd3ff",
  "84": "#9c9cff",
  "85": "#dc9cff",
  "86": "#ff9cff",
  "87": "#ff94d3",
  "88": "#000000",
  "89": "#131313",
  "90": "#282828",
  "91": "#363636",
  "92": "#4d4d4d",
  "93": "#656565",
  "94": "#818181",
  "95": "#9f9f9f",
  "96": "#bcbcbc",
  "97": "#e2e2e2",
  //"98": "#ffffff",
});

const nearest16 = nearestColor.from({
  "0": "#ffffff",
  "1": "#000000",
  "2": "#00007f",
  "3": "#009300",
  "4": "#ff0000",
  "5": "#7f0000",
  "6": "#9c009c",
  "7": "#fc7f00",
  "8": "#ffff00",
  "9": "#00fc00",
  "10": "#009393",
  "11": "#00ffff",
  "12": "#0000fc",
  "13": "#ff00ff",
  "14": "#7f7f7f",
  "15": "#d2d2d2",
});

const nearestGray = nearestColor.from({
  "0": "#ffffff",
  "1": "#000000",
  "14": "#7f7f7f",
  "15": "#d2d2d2",
  "89": "#131313",
  "90": "#282828",
  "91": "#363636",
  "92": "#4d4d4d",
  "93": "#656565",
  "94": "#818181",
  "95": "#9f9f9f",
  "96": "#bcbcbc",
  "97": "#e2e2e2",
});
