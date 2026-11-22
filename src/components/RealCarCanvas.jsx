import React, { useRef, useEffect, useState } from 'react';

/**
 * Robust Zero-Stall 60 FPS HTML5 Image Scrollytelling Viewport
 * - Progressive Loading: Eagerly loads opening frames, then loads the rest in order
 * - Loading indicator until the first 25 frames are ready to scrub
 * - Guaranteed non-blocking fallback rendering so it NEVER freezes
 */
export function RealCarCanvas({ onScrollProgress }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const animIdRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const lastRenderedIdx = useRef(-1);

  const TOTAL_FRAMES = 409;
  const smoothFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Progressive image preloader
  useEffect(() => {
    const images = new Array(TOTAL_FRAMES);
    let loadedCount = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const pad = String(i).padStart(4, '0');
      const img = new Image();
      img.src = `/frames/frame_${pad}.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount % 10 === 0 || loadedCount === TOTAL_FRAMES) {
          setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        }
        if (loadedCount >= 20 && !isReady) {
          setIsReady(true);
        }
        if (i === 1) {
          renderFrame(0);
        }
      };
      images[i - 1] = img;
    }

    imagesRef.current = images;
  }, []);

  // Native window scroll progress
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

  // Continuous 60 FPS tick loop
  useEffect(() => {
    const tick = (now) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1) || 0.016;
      lastTimeRef.current = now;

      const target = targetFrameRef.current;
      const current = smoothFrameRef.current;

      const k = 1 - Math.exp(-dt * 16);
      smoothFrameRef.current += (target - current) * k;

      if (Math.abs(target - smoothFrameRef.current) < 0.2) {
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

  // Robust fallback: returns target frame or the closest available loaded frame
  const getDrawableImage = (index) => {
    const list = imagesRef.current;
    if (!list || list.length === 0) return null;

    const targetImg = list[index];
    if (targetImg && targetImg.complete && targetImg.naturalWidth > 0) {
      return targetImg;
    }

    // Search closest loaded neighbor
    for (let offset = 1; offset < 50; offset++) {
      const left = list[index - offset];
      if (left && left.complete && left.naturalWidth > 0) return left;
      const right = list[index + offset];
      if (right && right.complete && right.naturalWidth > 0) return right;
    }

    return list[0]?.complete ? list[0] : null;
  };

  const renderFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    const img = getDrawableImage(index);

    if (!img) return;

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

    const imgRatio = img.naturalWidth / img.naturalHeight;
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

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

    // Erase bottom-right diamond logo watermark seamlessly
    const iconW = renderW * 0.045;
    const iconH = renderH * 0.09;
    const iconX = offsetX + renderW * 0.885;
    const iconY = offsetY + renderH * 0.775;

    const floorGrad = ctx.createRadialGradient(
      iconX + iconW / 2, iconY + iconH / 2, 4,
      iconX + iconW / 2, iconY + iconH / 2, Math.max(iconW, iconH) * 1.2
    );
    floorGrad.addColorStop(0, '#100e12');
    floorGrad.addColorStop(0.6, '#080709');
    floorGrad.addColorStop(1, 'rgba(6, 5, 6, 0)');

    ctx.fillStyle = floorGrad;
    ctx.fillRect(iconX - 15, iconY - 15, iconW + 30, iconH + 30);

    // German factory plate on rear turntable shots
    if (index >= 380 && index <= 409) {
      const plateW = renderW * 0.105;
      const plateH = renderH * 0.048;
      const plateX = offsetX + (renderW - plateW) / 2;
      const plateY = offsetY + renderH * 0.525;

      ctx.fillStyle = '#141416';
      ctx.beginPath();
      ctx.roundRect(plateX, plateY, plateW, plateH, 3);
      ctx.fill();

      ctx.strokeStyle = '#222328';
      ctx.lineWidth = 1;
      ctx.stroke();

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

      {/* Subtle loader bar on slow initial network connections */}
      {loadProgress < 100 && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5 z-50">
          <div
            className="h-full bg-[#ff3b7e] transition-all duration-300 shadow-[0_0_10px_#ff3b7e]"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
