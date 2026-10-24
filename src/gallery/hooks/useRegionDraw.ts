import { useRef, useState } from 'preact/hooks';

import { type Region } from '@/gallery/lib/blur';

type Point = { x: number; y: number };

// Smaller drags, as fractions of the image, are taken for stray clicks.
const MIN_SIZE = 0.01;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function pointAt(e: PointerEvent): Point {
  const box = (e.currentTarget as HTMLElement).getBoundingClientRect();

  return {
    x: clamp((e.clientX - box.left) / box.width),
    y: clamp((e.clientY - box.top) / box.height),
  };
}

function between(a: Point, b: Point): Region {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };
}

/**
 * Rectangles drawn by dragging over the element `handlers` go on, as
 * fractions of its size, with `drawing` the one being dragged out.
 */
export function useRegionDraw() {
  const [regions, setRegions] = useState<Array<Region>>([]);
  const [drawing, setDrawing] = useState<Region>();
  const start = useRef<Point>();

  const stop = () => {
    start.current = undefined;
    setDrawing(undefined);
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) {
      return;
    }

    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    start.current = pointAt(e);
    setDrawing(between(start.current, start.current));
  };

  const onPointerMove = (e: PointerEvent) => {
    if (start.current) {
      setDrawing(between(start.current, pointAt(e)));
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!start.current) {
      return;
    }

    const region = between(start.current, pointAt(e));

    stop();

    if (region.width > MIN_SIZE && region.height > MIN_SIZE) {
      setRegions((drawn) => [...drawn, region]);
    }
  };

  const undo = () => setRegions((drawn) => drawn.slice(0, -1));

  return {
    regions,
    drawing,
    undo,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: stop,
    },
  };
}
