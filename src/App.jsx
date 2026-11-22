import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';

import { Navigation } from './components/Navigation';
import { RealCarCanvas } from './components/RealCarCanvas';
import { OverlaySections } from './components/OverlaySections';
import { ConfiguratorModal } from './components/ConfiguratorModal';
import { OrderModal } from './components/OrderModal';
import { engineAudio } from './utils/engineAudio';

export default function App() {
  const [carColor, setCarColor] = useState('#d23b6f');
  const [carFinish, setCarFinish] = useState('gloss');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // High-performance Lenis smooth scrolling tuned directly to requestAnimationFrame
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenis.on('scroll', (e) => {
      const velocity = Math.min(Math.abs(e.velocity || 0) / 10, 1);
      engineAudio.setRPM(velocity);
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative bg-[#060506] select-none text-white">
      <Navigation
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenConfigurator={() => setIsConfiguratorOpen(true)}
        onOpenOrder={() => setIsOrderOpen(true)}
      />

      {/* Pure Hardware ImageBitmap 60 FPS Canvas Viewport */}
      <RealCarCanvas onScrollProgress={setScrollProgress} />

      {/* Chapters Overlay Synchronized to Film Head */}
      <OverlaySections
        scrollProgress={scrollProgress}
        onOpenOrder={() => setIsOrderOpen(true)}
      />

      {/* 800vh Smooth Scroll Track */}
      <div id="scroll-track" className="h-[800vh] w-full pointer-events-none" />

      {/* Configurator Modal */}
      <ConfiguratorModal
        isOpen={isConfiguratorOpen}
        onClose={() => setIsConfiguratorOpen(false)}
        currentColor={carColor}
        setCurrentColor={setCarColor}
        currentFinish={carFinish}
        setCurrentFinish={setCarFinish}
      />

      {/* Official Order / Build Slot Allocation Modal */}
      <OrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
      />
    </div>
  );
}
