import React, { useRef, useEffect } from 'react';

/**
 * Native Pure-Hardware Scrollytelling Film Engine
 * - Zero artificial lag / scrub fighting
 * - Direct GPU ImageBitmap pipeline with native requestAnimationFrame interpolation
 * - Direct window scroll progress reading for 1:1 butter-smooth response
 * - Seamless license plate branding replacing distorted artifacts
 */
export function RealCarCanvas({ onScrollProgress }) {
  const canvasRef = useRef(null);
  const animIdRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const lastRenderedIdx = useRef(-1);

  const TOTAL_FRAMES = 409;
  const bitmapsRef = useRef(new Map());
  const blobsRef = useRef([]);
  const smoothFrameRef = useRef(0);
  const targetFrameRef = useRef(0);

  // Eagerly load & decode all frames into GPU ImageBitmaps
  useEffect(() => {
    let isCancelled = false;

    async function loadFrames() {
      const EAGER = 80;
      const eagerBatch = [];

      for (let i = 0; i < EAGER; i++) {
        const pad = String(i + 1).padStart(4, '0');
        const url = `/frames/frame_${pad}.png`;
        eagerBatch.push(
          fetch(url)
            .then((r) => r.blob())
            .then(async (blob) => {
              if (isCancelled) return;
              blobsRef.current[i] = blob;
              const bmp = await createImageBitmap(blob);
              bitmapsRef.current.set(i, bmp);
              if (i === 0) renderFrame(0);
            })
            .catch(() => {})
        );
      }

      await Promise.all(eagerBatch);

      for (let i = EAGER; i < TOTAL_FRAMES; i += 12) {
        if (isCancelled) break;
        const batch = [];
        for (let j = i; j < Math.min(i + 12, TOTAL_FRAMES); j++) {
          const pad = String(j + 1).padStart(4, '0');
          const url = `/frames/frame_${pad}.png`;
          batch.push(
            fetch(url)
              .then((r) => r.blob())
              .then(async (blob) => {
                if (isCancelled) return;
                blobsRef.current[j] = blob;
                const bmp = await createImageBitmap(blob);
                bitmapsRef.current.set(j, bmp);
              })
              .catch(() => {})
          );
        }
        await Promise.all(batch);
      }
    }

    loadFrames();

    return () => {
      isCancelled = true;
      for (const bmp of bitmapsRef.current.values()) {
        if (bmp.close) bmp.close();
      }
      bitmapsRef.current.clear();
    };
  }, []);

  // Native scroll progress calculation (zero GSAP lag)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const p = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
      targetFrameRef.current = p * (TOTAL_FRAMES - 1);
      if (onScrollProgress) onScrollProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [onScrollProgress]);

  // Pure 60/120/144 FPS Hardware Tick Loop
  useEffect(() => {
    const tick = (now) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1) || 0.016;
      lastTimeRef.current = now;

      const target = targetFrameRef.current;
      const current = smoothFrameRef.current;

      const k = 1 - Math.exp(-dt * 18);
      smoothFrameRef.current += (target - current) * k;

      if (Math.abs(target - smoothFrameRef.current) < 0.1) {
        smoothFrameRef.current = target;
      }

      const frameToDraw = Math.round(smoothFrameRef.current);
      if (frameToDraw !== lastRenderedIdx.current) {
        renderFrame(frameToDraw);
      }

      animIdRef.current = requestAnimationFrame(tick);
    };

    animIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, []);

  const getDecodedBitmap = (index) => {
    if (bitmapsRef.current.has(index)) {
      return bitmapsRef.current.get(index);
    }
    for (let offset = 1; offset < 30; offset++) {
      if (bitmapsRef.current.has(index - offset)) return bitmapsRef.current.get(index - offset);
      if (bitmapsRef.current.has(index + offset)) return bitmapsRef.current.get(index + offset);
    }
    return null;
  };

  const renderFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    const bmp = getDecodedBitmap(index);

    if (!bmp) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const targetWidth = Math.round(width * dpr);
    const targetHeight = Math.round(height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#060506';
    ctx.fillRect(0, 0, width, height);

    const imgRatio = bmp.width / bmp.height;
    const screenRatio = width / height;

    let renderW, renderH;

    if (screenRatio > imgRatio) {
      renderW = width;
      renderH = width / imgRatio;
    } else {
      renderH = height;
      renderW = height * imgRatio;
    }

    const offsetX = (width - renderW) / 2;
    const offsetY = (height - renderH) / 2;

    ctx.drawImage(bmp, offsetX, offsetY, renderW, renderH);

    // If frame is in the rear turntable shot (index 385 to 409), replace the smeared plate with a crisp authentic German euro plate
    if (index >= 380 && index <= 409) {
      const plateW = renderW * 0.105;
      const plateH = renderH * 0.048;
      const plateX = offsetX + (renderW - plateW) / 2;
      const plateY = offsetY + renderH * 0.525;

      // Authentic matte black euro plate housing
      ctx.fillStyle = '#141416';
      ctx.beginPath();
      ctx.roundRect(plateX, plateY, plateW, plateH, 3);
      ctx.fill();

      // Border outline
      ctx.strokeStyle = '#222328';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Inner plate text "S • GO 718" (Stuttgart Factory Plate)
      ctx.fillStyle = '#e5e7eb';
      ctx.font = `600 ${Math.max(9, Math.round(plateH * 0.45))}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('S • GO 718', plateX + plateW / 2, plateY + plateH / 2 + 1);
    }

    ctx.restore();
    lastRenderedIdx.current = index;
  };

  useEffect(() => {
    const handleResize = () => {
      renderFrame(Math.round(smoothFrameRef.current));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden bg-[#060506]">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
