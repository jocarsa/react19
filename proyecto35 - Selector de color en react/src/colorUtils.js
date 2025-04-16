import tinycolor from "tinycolor2";

export function generateColorFamily(base) {
  const baseColor = tinycolor(base);

  return {
    base,
    complement: baseColor.complement().toHexString(),
    triad: baseColor.triad().map((c) => c.toHexString()).slice(0, 3),
    analogous: baseColor.analogous(4, 30).map((c) => c.toHexString()).slice(1), // remove duplicate base
    monochromatic: baseColor.monochromatic(5).map((c) => c.toHexString())
  };
}
