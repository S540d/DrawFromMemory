import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import type { DrawingPath } from '../DrawingCanvas.shared';

// Fake-2D-Kontext, der Aufrufe zählt (jsdom implementiert Canvas nicht).
const ctxCalls = { getImageData: 0, putImageData: 0, drawImage: 0, stroke: 0 };
const fakeCtx = {
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
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
});
