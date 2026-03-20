import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useScrollSmoother = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,          // smoothness duration (same as ScrollSmoother's smooth: 1)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth ease
      orientation: 'vertical',
      smoothWheel: true,    // smooth mouse wheel
      touchMultiplier: 0.1, // light smoothing on touch (same as smoothTouch: 0.1)
    });

    // Sync Lenis with GSAP's ticker so ScrollTrigger stays in sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);
};

export default useScrollSmoother;
