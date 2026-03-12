/**
 * Public API entrypoint for DrawingCanvas.
 *
 * The bundler resolves the platform-specific component automatically:
 *   DrawingCanvas.web.tsx    → web (Webpack / Metro web)
 *   DrawingCanvas.native.tsx → iOS / Android (Metro)
 *
 * Both platform files re-export the named exports below so that any import
 * from '@components/DrawingCanvas' always receives the full public API
 * regardless of platform resolution.
 */

export type { DrawingPath } from './DrawingCanvas.shared';
export { useDrawingCanvas } from './DrawingCanvas.hooks';

// Default export for TypeScript – at runtime the bundler resolves the
// platform-specific file (DrawingCanvas.native.tsx / DrawingCanvas.web.tsx).
export { default } from './DrawingCanvas.native';
