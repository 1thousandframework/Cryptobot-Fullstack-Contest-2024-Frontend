export type RGB = [number, number, number]

export function hex2rgb(hex: string): RGB {
  if (hex.length > 6) {
    hex = hex.substring(1)
  }
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
  ];
}

export function rgb2str(rgb: RGB): string {
  return 'rgb(' + rgb.join(', ') + ')';
}

export function rgb2rgbaString(rgb: RGB, opacity: number): string {
  return 'rgba(' + rgb.join(', ') + ', ' + opacity + ')';
}
