import React, { useEffect, useRef, useState } from 'react';

/**
 * Renders `children` only once the placeholder scrolls near the viewport.
 *
 * Used to keep heavy below-the-fold work (three.js, .glb models, HDRI
 * environment maps) out of the initial page load. Because the children are a
 * lazy() component, not mounting them also means their chunk is never
 * requested — so the cost is deferred at the network level, not just render.
 *
 * `minHeight` reserves space so deferring does not cause layout shift.
 */
const DeferUntilVisible = ({ children, minHeight = '60vh', rootMargin = '300px' }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // No IntersectionObserver (very old browsers) — render immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setShow(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={show ? undefined : { minHeight }}>
      {show ? children : null}
    </div>
  );
};

export default DeferUntilVisible;
