import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const portrait = await readFile(join(process.cwd(), "public/images/fayaz.png"));
  return new ImageResponse(
    <div style={{ display: "flex", width: 64, height: 64, position: "relative", overflow: "hidden", borderRadius: 12, background: "#080c0b" }}>
      {/* Frame the original portrait tightly so the face reads at tab size. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/png;base64,${portrait.toString("base64")}`} alt="" width={101} height={135} style={{ position: "absolute", left: -17, top: -12 }} />
    </div>,
    size,
  );
}
