import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import type { DrawingPath } from '../DrawingCanvas.shared';

// Fake-2D-Kontext, der Aufrufe zählt (jsdom implementiert Canvas nicht).
const ctxCalls = { getImageData: 0, putImageData: 0, drawImage: 0, stroke: 0 };
const moveToCalls: number[][] = [];
const fakeCtx = {
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn((x: number, y: number) => {
    moveToCalls.push([x, y]);
  }),
  lineTo: jest.fn(),
  stroke: jest.fn(() => {
    ctxCalls.stroke++;
  }),
  drawImage: jest.fn(() => {
    ctxCalls.drawImage++;
  }),
  getImageData: jest.fn((_x: number, _y: number, w: number, h: number) => {
    ctxCalls.getImageData++;
    return { data: new Uint8ClampedArray(w * h * 4).fill(255), width: w, height: h };
  }),
  putImageData: jest.fn(() => {
    ctxCalls.putImageData++;
  }),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  lineCap: '',
  lineJoin: '',
};

import DrawingCanvas from '../DrawingCanvas.web';

describe('DrawingCanvas.web — Live-Strich nutzt Snapshot statt Komplett-Redraw (#358)', () => {
  let getContextSpy: jest.SpyInstance;

  beforeEach(() => {
    moveToCalls.length = 0;
    Object.keys(ctxCalls).forEach(k => ((ctxCalls as Record<string, number>)[k] = 0));
    getContextSpy = jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(
        (() => fakeCtx) as unknown as typeof HTMLCanvasElement.prototype.getContext,
      );
  });

  afterEach(() => getContextSpy.mockRestore());

  const fillPath: DrawingPath = {
    points: [{ x: 5, y: 5 }],
    color: '#FF0000',
    strokeWidth: 0,
    type: 'fill',
  };

  it('führt bei Touch-Moves keine Flood-Fills erneut aus', () => {
    const paths = [fillPath, fillPath];
    const { container } = render(
      <DrawingCanvas width={100} height={100} paths={paths} onDrawingChange={jest.fn()} />,
    );
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas).not.toBeNull();

    // Basis-Render: jeder gespeicherte Fill liest die Fläche einmal
    expect(ctxCalls.getImageData).toBe(2);
    const fillsAfterMount = ctxCalls.getImageData;

    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    for (let i = 1; i <= 20; i++) {
      fireEvent.mouseMove(canvas, { clientX: 10 + i, clientY: 10 + i });
    }

    // Kein weiterer getImageData/putImageData-Durchlauf während des Zeichnens
    expect(ctxCalls.getImageData).toBe(fillsAfterMount);
    // Stattdessen wird der Snapshot zurückkopiert und der Live-Strich gezeichnet
    expect(ctxCalls.drawImage).toBeGreaterThan(20);
    expect(ctxCalls.stroke).toBeGreaterThan(0);
  });

  it('rendert die Basis neu, wenn sich paths ändern', () => {
    const onDrawingChange = jest.fn();
    const { rerender } = render(
      <DrawingCanvas
        width={100}
        height={100}
        paths={[fillPath]}
        onDrawingChange={onDrawingChange}
      />,
    );
    expect(ctxCalls.getImageData).toBe(1);

    rerender(
      <DrawingCanvas
        width={100}
        height={100}
        paths={[fillPath, fillPath]}
        onDrawingChange={onDrawingChange}
      />,
    );
    // Neuer Basis-Render: beide Fills werden neu angewendet (1 + 2)
    expect(ctxCalls.getImageData).toBe(3);
  });

  it('übergibt den fertigen Strich beim Loslassen an onDrawingChange', () => {
    const onDrawingChange = jest.fn();
    const { container } = render(
      <DrawingCanvas width={100} height={100} paths={[]} onDrawingChange={onDrawingChange} />,
    );
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;

    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });
    fireEvent.mouseUp(canvas);

    expect(onDrawingChange).toHaveBeenCalledTimes(1);
    const [newPaths] = onDrawingChange.mock.calls[0];
    expect(newPaths).toHaveLength(1);
    expect(newPaths[0].points.length).toBeGreaterThan(1);
  });

  describe('Replay (#366)', () => {
    const fills = (n: number): DrawingPath[] =>
      Array.from({ length: n }, (_, i) => ({
        points: [{ x: 5 + i, y: 5 }],
        color: '#FF0000',
        strokeWidth: 0,
        type: 'fill' as const,
      }));

    it('berechnet bei wachsenden Pfaden pro Frame höchstens 2 Flood-Fills statt alle neu', () => {
      const all = fills(10);
      const { rerender } = render(
        <DrawingCanvas
          width={100}
          height={100}
          paths={all.slice(0, 1)}
          scaleReferencePaths={all}
        />,
      );
      for (let k = 2; k <= all.length; k++) {
        rerender(
          <DrawingCanvas
            width={100}
            height={100}
            paths={all.slice(0, k)}
            scaleReferencePaths={all}
          />,
        );
      }
      // Ohne Cache: 1+2+…+10 = 55 Flood-Fills. Mit Cache: 1 + 2·9 = 19.
      expect(ctxCalls.getImageData).toBeLessThanOrEqual(19);
    });

    it('hält die Skalierung über alle Frames stabil (scaleReferencePaths)', () => {
      const a: DrawingPath = {
        points: [
          { x: 0, y: 0 },
          { x: 50, y: 50 },
        ],
        color: '#000',
        strokeWidth: 3,
        type: 'stroke',
      };
      const b: DrawingPath = {
        points: [
          { x: 0, y: 0 },
          { x: 400, y: 400 },
        ],
        color: '#000',
        strokeWidth: 3,
        type: 'stroke',
      };

      // Frame 1: nur a sichtbar, Skalierung aus der Gesamtzeichnung [a, b]
      render(<DrawingCanvas width={100} height={100} paths={[a]} scaleReferencePaths={[a, b]} />);
      const firstFrameStart = moveToCalls[0];

      moveToCalls.length = 0;
      // Endzustand: beide sichtbar, derselbe Pfad a muss an derselben Stelle starten
      render(<DrawingCanvas width={100} height={100} paths={[a, b]} />);
      expect(moveToCalls[0]).toEqual(firstFrameStart);
    });

    it('zeichnet bereits gerenderte Striche im Replay nicht jedes Mal erneut', () => {
      const stroke = (x: number): DrawingPath => ({
        points: [
          { x, y: 0 },
          { x, y: 90 },
        ],
        color: '#000',
        strokeWidth: 3,
        type: 'stroke',
      });
      const all: DrawingPath[] = [stroke(10), stroke(30), stroke(50), stroke(70)];

      // Inkrementell
      const { rerender } = render(
        <DrawingCanvas
          width={100}
          height={100}
          paths={all.slice(0, 1)}
          scaleReferencePaths={all}
        />,
      );
      for (let k = 2; k <= all.length; k++) {
        rerender(
          <DrawingCanvas
            width={100}
            height={100}
            paths={all.slice(0, k)}
            scaleReferencePaths={all}
          />,
        );
      }
      // Pro Frame wird höchstens der neue Pfad (committed) + der letzte neu gezeichnet:
      // insgesamt sehr viel weniger als bei vollständigem Neuzeichnen (1+2+3+4 = 10 Striche).
      expect(ctxCalls.stroke).toBeLessThanOrEqual(1 + 2 * 3);
    });
  });
});
