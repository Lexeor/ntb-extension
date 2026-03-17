declare module 'vanta/dist/vanta.waves.min' {
  import type * as THREE from 'three';

  interface VantaWavesOptions {
    el: HTMLElement;
    THREE: typeof THREE;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    backgroundColor?: number;
    backgroundAlpha?: number;
    shininess?: number;
    waveHeight?: number;
    waveSpeed?: number;
    zoom?: number;
  }

  interface VantaEffect {
    destroy(): void;
    setOptions(options: Partial<VantaWavesOptions>): void;
  }

  function WAVES(options: VantaWavesOptions): VantaEffect;
  export default WAVES;
}
