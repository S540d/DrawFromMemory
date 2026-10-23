/**
 * Passt eine Zeichnung (DrawingPath[]) in eine Fläche ein.
 *
 * Gemeinsame Quelle für die Vorschau-Skalierung der Web-/Native-Zeichenfläche
 * und den PNG-Export (ShareService web/native) — vorher viermal kopiert (#359).
 * Rein funktional, ohne React-Native-Abhängigkeit.
 */

export interface FitPath {
  points: { x: number; y: number }[];
  type?: 'stroke' | 'fill';
}

export interface FitTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export const IDENTITY_TRANSFORM: FitTransform = { scale: 1, offsetX: 0, offsetY: 0 };

/**
 * Bounding Box der Striche (Fills zählen nicht — sie haben nur einen Klickpunkt) → Skalierung
 * (nie größer als 1) und Offset, sodass die Zeichnung mit `padding` zentriert in
 * `width × height` liegt. Ohne Striche oder bei Breite/Höhe 0 (Einzelpunkt, Linie): Identität.
 * Anwendung: `x * scale + offsetX`.
 */
export function computeFitTransform(
  paths: FitPath[],
  width: number,
  height: number,
  padding: number,
): FitTransform {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const path of paths) {
    if (path.type === 'fill') continue;
    for (const point of path.points) {
      if (point.x < minX) minX = point.x;
      if (point.y < minY) minY = point.y;
      if (point.x > maxX) maxX = point.x;
      if (point.y > maxY) maxY = point.y;
    }
  }

  const drawingWidth = maxX - minX;
  const drawingHeight = maxY - minY;
  // Auch bei komplett leerer Bounding Box (nur Fills): -Infinity > 0 ist false → Identität
  if (!(drawingWidth > 0) || !(drawingHeight > 0)) return IDENTITY_TRANSFORM;

  const scale = Math.min(
    (width - 2 * padding) / drawingWidth,
    (height - 2 * padding) / drawingHeight,
    1,
  );
  return {
    scale,
    offsetX: (width - drawingWidth * scale) / 2 - minX * scale,
    offsetY: (height - drawingHeight * scale) / 2 - minY * scale,
  };
}
