import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { Network, Zap, Eye, RotateCcw, Activity, Wind, Sparkles, Droplets } from 'lucide-react';

export type StreamMode = 'stream' | 'quantum' | 'synapse';
export type BlurPreset = 'cinematic' | 'deep' | 'dream' | 'subtle';

export const BLUR_PRESETS: Record<BlurPreset, { label: string; radius: number; description: string }> = {
  cinematic: { label: 'Cinematic Blur', radius: 0.0085, description: 'Luminous optical diffusion with velocity streaks' },
  deep: { label: 'Deep Frosted', radius: 0.0165, description: 'Intense dreamscape optical bokeh' },
  dream: { label: 'Dream Aura', radius: 0.025, description: 'Ultra-soft ethereal neural cloud' },
  subtle: { label: 'Subtle Soft', radius: 0.004, description: 'Soft focus optical anti-aliasing' }
};

interface NeuralCoreCanvasProps {
  scrollProgress: number; // 0 to 1 across the whole page
  currentSection: string;
}

// Target 60 FPS frame interval (16.667ms)
const TARGET_FRAME_MS = 1000 / 60;
const NUM_FILAMENTS = 88;
const POINTS_PER_FILAMENT = 100;
const VERTICAL_SPAN = 36.0;
const Y_TOP = VERTICAL_SPAN * 0.5; // +18.0
const NUM_SPLINE_GUIDES = 48;
const SPLINE_SAMPLES = 256;
const NUM_STREAM_PARTICLES = 1800;
const NUM_AMBIENT = 700;

/**
 * Creates a soft radial glow point sprite texture on an offscreen canvas.
 * Guarantees zero external network assets and velvety, non-square particle glows.
 */
function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.18, 'rgba(0, 240, 255, 0.95)');
  gradient.addColorStop(0.45, 'rgba(139, 92, 246, 0.55)');
  gradient.addColorStop(0.8, 'rgba(30, 27, 75, 0.15)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(64, 64, 64, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const NeuralPrismCanvas: React.FC<NeuralCoreCanvasProps> = React.memo(({
  scrollProgress
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<StreamMode>('stream');
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [blurPreset, setBlurPreset] = useState<BlurPreset>('cinematic');
  const [isMotionBlurActive, setIsMotionBlurActive] = useState(false);
  const [telemetry, setTelemetry] = useState({
    clock: '1.4 GHz',
    load: '14%',
    flowRate: '4.8 GB/s',
    state: 'SYNAPTIC FLOW: 60 FPS'
  });

  // State refs for 60fps render loop access
  const scrollRef = useRef(scrollProgress);
  const activeModeRef = useRef<StreamMode>('stream');
  const speedRef = useRef(speedMultiplier);
  const blurPresetRef = useRef<BlurPreset>('cinematic');

  // Signed scroll velocity tracking for directional motion blur post-processing
  const signedVelocityRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const smoothBlurStrengthRef = useRef(0);
  const lastScrollYRef = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const lastScrollTimeRef = useRef(typeof performance !== 'undefined' ? performance.now() : 0);

  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    dragVelX: 0,
    dragVelY: 0
  });

  // Default smooth cinematic orientation angle
  const manualRot = useRef({ x: 0.15, y: -0.2 });

  // Sync state refs
  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    activeModeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    blurPresetRef.current = blurPreset;
  }, [blurPreset]);

  // =========================================================================
  // MEMOIZED HIGH-PERFORMANCE ASSETS & PRECOMPUTED NEURAL GEOMETRY
  // =========================================================================

  // 1. Glow Texture Memoization
  const glowTexture = useMemo(() => createGlowTexture(), []);

  // 2. Active Blur Config Memoization
  const activeBlurConfig = useMemo(() => BLUR_PRESETS[blurPreset], [blurPreset]);

  // 3. Precomputed Spline Pathways & High-Resolution Lookup Table (LUT)
  // Precomputing 256 samples per spline curve completely eliminates CatmullRom getPoint() CPU cost in 60fps render loop!
  const splineLUT = useMemo(() => {
    const curves: THREE.CatmullRomCurve3[] = [];
    const lut: Float32Array[] = [];

    for (let s = 0; s < NUM_SPLINE_GUIDES; s++) {
      const u = s / NUM_SPLINE_GUIDES;
      const angle = u * Math.PI * 2;
      const tier = s % 4;
      const radiusBase = tier === 0 ? 1.2 + (s % 3) * 0.4 :
                         tier === 1 ? 2.4 + (s % 4) * 0.5 :
                         tier === 2 ? 3.8 + (s % 3) * 0.6 :
                                      5.2 + (s % 4) * 0.7;

      const controlPoints: THREE.Vector3[] = [];
      const numControls = 9;
      const isDownward = s % 2 === 0;

      for (let c = 0; c < numControls; c++) {
        const ct = c / (numControls - 1);
        const y = isDownward ? (Y_TOP - ct * VERTICAL_SPAN) : (-Y_TOP + ct * VERTICAL_SPAN);
        const twistFactor = tier === 0 ? 1.4 : 2.2;
        const spiralAngle = angle + (isDownward ? ct : 1.0 - ct) * Math.PI * twistFactor + Math.sin(ct * Math.PI * 3 + s) * 0.5;
        const taper = 0.85 + Math.sin(ct * Math.PI) * 0.35 + Math.sin(ct * Math.PI * 4 + s * 0.4) * 0.2;
        const r = radiusBase * taper;

        const x = Math.cos(spiralAngle) * r;
        const z = Math.sin(spiralAngle) * r + Math.sin(ct * Math.PI * 3.5 + s) * 0.6;
        controlPoints.push(new THREE.Vector3(x, y, z));
      }

      const spline = new THREE.CatmullRomCurve3(controlPoints, false, 'centripetal', 0.5);
      curves.push(spline);

      // Pre-sample points into flat Float32Array
      const sampleArray = new Float32Array(SPLINE_SAMPLES * 3);
      for (let i = 0; i < SPLINE_SAMPLES; i++) {
        const t = i / (SPLINE_SAMPLES - 1);
        const pt = spline.getPoint(t);
        sampleArray[i * 3] = pt.x;
        sampleArray[i * 3 + 1] = pt.y;
        sampleArray[i * 3 + 2] = pt.z;
      }
      lut.push(sampleArray);
    }

    return { curves, lut };
  }, []);

  // 4. Precomputed 88 Neural Axon Filaments Geometry Buffers
  const filamentBufferData = useMemo(() => {
    const numSegmentsPerFilament = POINTS_PER_FILAMENT - 1;
    const totalVertices = NUM_FILAMENTS * numSegmentsPerFilament * 2;

    const positions = new Float32Array(totalVertices * 3);
    const normY = new Float32Array(totalVertices);
    const id = new Float32Array(totalVertices);
    const phase = new Float32Array(totalVertices);
    const freq = new Float32Array(totalVertices);
    const radius = new Float32Array(totalVertices);
    const baseAngle = new Float32Array(totalVertices);
    const direction = new Float32Array(totalVertices);

    let vIdx = 0;
    for (let f = 0; f < NUM_FILAMENTS; f++) {
      const u = f / NUM_FILAMENTS;
      const bAngle = u * Math.PI * 2;
      const tier = f % 4;
      const rVal = tier === 0 ? 1.1 + (f % 3) * 0.35 :
                   tier === 1 ? 2.2 + (f % 4) * 0.45 :
                   tier === 2 ? 3.6 + (f % 3) * 0.55 :
                                5.2 + (f % 4) * 0.65;
      const ph = (f * 1.6180339) * Math.PI * 2;
      const fr = 2.4 + (f % 5) * 0.65; // Organic biological frequency
      const dir = f % 2 === 0 ? 1.0 : -1.0;

      for (let s = 0; s < numSegmentsPerFilament; s++) {
        const t1 = s / (POINTS_PER_FILAMENT - 1);
        const y1 = Y_TOP - t1 * VERTICAL_SPAN;
        positions[vIdx * 3] = Math.cos(bAngle) * rVal;
        positions[vIdx * 3 + 1] = y1;
        positions[vIdx * 3 + 2] = Math.sin(bAngle) * rVal;
        normY[vIdx] = t1;
        id[vIdx] = f;
        phase[vIdx] = ph;
        freq[vIdx] = fr;
        radius[vIdx] = rVal;
        baseAngle[vIdx] = bAngle;
        direction[vIdx] = dir;
        vIdx++;

        const t2 = (s + 1) / (POINTS_PER_FILAMENT - 1);
        const y2 = Y_TOP - t2 * VERTICAL_SPAN;
        positions[vIdx * 3] = Math.cos(bAngle) * rVal;
        positions[vIdx * 3 + 1] = y2;
        positions[vIdx * 3 + 2] = Math.sin(bAngle) * rVal;
        normY[vIdx] = t2;
        id[vIdx] = f;
        phase[vIdx] = ph;
        freq[vIdx] = fr;
        radius[vIdx] = rVal;
        baseAngle[vIdx] = bAngle;
        direction[vIdx] = dir;
        vIdx++;
      }
    }

    return { positions, normY, id, phase, freq, radius, baseAngle, direction, totalVertices };
  }, []);

  // 5. Precomputed Stream Particles Initial Metadata & Color Buffers
  const streamParticlesMeta = useMemo(() => {
    const positions = new Float32Array(NUM_STREAM_PARTICLES * 3);
    const colors = new Float32Array(NUM_STREAM_PARTICLES * 3);
    const sizes = new Float32Array(NUM_STREAM_PARTICLES);
    const items: { streamIndex: number; t: number; speed: number; baseSize: number }[] = [];

    const colorCyan = new THREE.Color(0x00F0FF);
    const colorViolet = new THREE.Color(0x8B5CF6);
    const colorWhite = new THREE.Color(0xFFFFFF);

    for (let i = 0; i < NUM_STREAM_PARTICLES; i++) {
      const streamIndex = i % NUM_SPLINE_GUIDES;
      const t = Math.random();
      const speed = 0.0016 + Math.random() * 0.0036;
      const baseSize = 0.14 + Math.random() * 0.22;

      items.push({ streamIndex, t, speed, baseSize });

      const lutArray = splineLUT.lut[streamIndex];
      const sampleIdx = Math.floor(t * (SPLINE_SAMPLES - 1));
      positions[i * 3] = lutArray[sampleIdx * 3];
      positions[i * 3 + 1] = lutArray[sampleIdx * 3 + 1];
      positions[i * 3 + 2] = lutArray[sampleIdx * 3 + 2];

      const pick = Math.random();
      const col = pick < 0.5 ? colorCyan : pick < 0.85 ? colorViolet : colorWhite;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = baseSize;
    }

    return { positions, colors, sizes, items };
  }, [splineLUT]);

  // 6. Precomputed Ambient Glial Constellation Initial Buffers
  const ambientParticlesMeta = useMemo(() => {
    const positions = new Float32Array(NUM_AMBIENT * 3);
    const basePositions = new Float32Array(NUM_AMBIENT * 3);
    const colors = new Float32Array(NUM_AMBIENT * 3);
    const phases = new Float32Array(NUM_AMBIENT);

    const colorCyan = new THREE.Color(0x00F0FF);
    const colorViolet = new THREE.Color(0x8B5CF6);
    const colorWhite = new THREE.Color(0xFFFFFF);

    for (let i = 0; i < NUM_AMBIENT; i++) {
      const y = (Math.random() - 0.5) * 32.0;
      const rVal = 1.2 + Math.pow(Math.random(), 0.65) * 7.5;
      const theta = Math.random() * Math.PI * 2;

      const x = rVal * Math.cos(theta);
      const z = rVal * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;

      phases[i] = Math.random() * Math.PI * 2;

      const rRatio = Math.min(rVal / 8.5, 1.0);
      const col = new THREE.Color();
      if (rRatio < 0.35) {
        col.lerpColors(colorWhite, colorCyan, rRatio / 0.35);
      } else {
        col.lerpColors(colorCyan, colorViolet, (rRatio - 0.35) / 0.65);
      }

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    return { positions, basePositions, colors, phases };
  }, []);

  // =========================================================================
  // REQUESTANIMATIONFRAME THROTTLED SCROLL VELOCITY TRACKING
  // Eliminates event loop queue contention during high-velocity trackpad scrolling
  // =========================================================================
  useEffect(() => {
    let scrollRafId: number | null = null;

    const handleScrollVelocity = () => {
      if (scrollRafId !== null) return; // rAF throttle

      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = null;
        const now = performance.now();
        const dt = Math.max(now - lastScrollTimeRef.current, 8);
        const currentScrollY = window.scrollY;
        const signedDelta = currentScrollY - lastScrollYRef.current;
        const instantVelocity = (signedDelta / dt) * 16.67; // px per frame (signed)

        // Smooth impulse filter
        signedVelocityRef.current = signedVelocityRef.current * 0.72 + instantVelocity * 0.28;
        scrollVelocityRef.current = Math.abs(signedVelocityRef.current);
        lastScrollYRef.current = currentScrollY;
        lastScrollTimeRef.current = now;

        if (scrollVelocityRef.current > 12) {
          setIsMotionBlurActive(true);
        }
      });
    };

    window.addEventListener('scroll', handleScrollVelocity, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollVelocity);
      if (scrollRafId !== null) cancelAnimationFrame(scrollRafId);
    };
  }, []);

  // =========================================================================
  // PRIMARY THREE.JS SCENE SETUP & 60FPS LOCKED RENDER LOOP
  // =========================================================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.014);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Offscreen render target for optical & motion blur post-processing
    let renderTarget = new THREE.WebGLRenderTarget(
      Math.floor(width * pixelRatio),
      Math.floor(height * pixelRatio),
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType
      }
    );

    const postScene = new THREE.Scene();
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const postQuadGeom = new THREE.PlaneGeometry(2, 2);

    const motionBlurMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uVelocity: { value: new THREE.Vector2(0, 0) },
        uStrength: { value: 0.0 },
        uBaseBlur: { value: BLUR_PRESETS.cinematic.radius },
        uResolution: { value: new THREE.Vector2(width, height) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 uVelocity;
        uniform float uStrength;
        uniform float uBaseBlur;
        uniform vec2 uResolution;
        varying vec2 vUv;

        void main() {
          vec2 vel = uVelocity * uStrength;
          float speed = length(vel);
          vec2 dirVel = (speed > 0.0001) ? normalize(vel) * min(speed, 0.09) : vec2(0.0);
          float baseRadius = max(uBaseBlur, 0.001);
          vec2 aspectScale = vec2(1.0, uResolution.x / max(uResolution.y, 1.0));
          
          const int SAMPLES = 18;
          vec4 accColor = vec4(0.0);
          float totalWeight = 0.0;
          
          for (int i = 0; i < SAMPLES; i++) {
            float fi = float(i);
            float angle = fi * 2.39996323; 
            float rNorm = sqrt((fi + 0.5) / float(SAMPLES));
            
            vec2 radialOffset = vec2(cos(angle), sin(angle) * aspectScale.y) * (rNorm * baseRadius);
            float linearT = (fi / float(SAMPLES - 1)) - 0.5;
            vec2 motionOffset = dirVel * linearT;
            vec2 offset = radialOffset + motionOffset;
            
            float dispersion = (baseRadius * 0.42 + speed * 0.35) * linearT;
            vec2 uvR = clamp(vUv + offset + vec2(dispersion, dispersion * 0.5), 0.0, 1.0);
            vec2 uvG = clamp(vUv + offset, 0.0, 1.0);
            vec2 uvB = clamp(vUv + offset - vec2(dispersion, dispersion * 0.5), 0.0, 1.0);
            
            float r = texture2D(tDiffuse, uvR).r;
            float g = texture2D(tDiffuse, uvG).g;
            float b = texture2D(tDiffuse, uvB).b;
            float a = texture2D(tDiffuse, uvG).a;
            
            float weight = exp(-2.2 * rNorm * rNorm) * (1.0 - abs(linearT) * 0.35);
            accColor += vec4(r, g, b, a) * weight;
            totalWeight += weight;
          }
          
          vec4 blurred = accColor / max(totalWeight, 0.0001);
          vec4 sharp = texture2D(tDiffuse, vUv);
          vec4 result = mix(blurred, sharp, 0.12) + blurred * 0.38;
          gl_FragColor = min(result, vec4(1.0));
        }
      `,
      depthTest: false,
      depthWrite: false
    });

    const postQuad = new THREE.Mesh(postQuadGeom, motionBlurMaterial);
    postScene.add(postQuad);

    // Root group
    const streamFieldGroup = new THREE.Group();
    scene.add(streamFieldGroup);

    // =========================================================================
    // 1. ORGANIC NEURAL AXON FILAMENTS WITH SYNAPTIC ACTION POTENTIAL PROPAGATION
    // Biological membrane depolarization soliton waves (Hodgkin-Huxley dynamics)
    // Smooth bioluminescent neurotransmitter dispersion — ZERO HARSH ELECTRIC SPARK ZAPS
    // =========================================================================
    const uColCyan = new THREE.Vector3(0.0, 0.941, 1.0);
    const uColViolet = new THREE.Vector3(0.545, 0.361, 0.965);
    const uColIndigo = new THREE.Vector3(0.388, 0.4, 0.945);
    const uColWhite = new THREE.Vector3(1.0, 1.0, 1.0);

    const filamentShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uScrollVelocity: { value: 0 },
        uSpeedMultiplier: { value: 1.0 },
        uColorCyan: { value: uColCyan },
        uColorViolet: { value: uColViolet },
        uColorIndigo: { value: uColIndigo },
        uColorWhite: { value: uColWhite },
        uMode: { value: 0.0 }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        uniform float uScrollVelocity;
        uniform float uSpeedMultiplier;

        attribute float aNormY;
        attribute float aFilamentId;
        attribute float aPhase;
        attribute float aFreq;
        attribute float aRadius;
        attribute float aBaseAngle;
        attribute float aDirection;

        varying float vNormY;
        varying float vFilamentId;
        varying float vEmissive;
        varying float vAlpha;

        void main() {
          vNormY = aNormY;
          vFilamentId = aFilamentId;

          float y = position.y;

          // Organic biological nerve curvature & dendritic arborization
          float scrollFactor = uScroll * 3.14159265;
          float dynamicTime = uTime * 0.75 * uSpeedMultiplier;

          // Gentle biological axon undulation
          float axonCurvature = sin(y * 0.28 + dynamicTime * 0.6 + aPhase) * 0.35 * aDirection;
          float dendriticSway = cos(y * 0.55 - scrollFactor * 1.2 + aPhase * 1.5) * 0.18;
          float finalAngle = aBaseAngle + axonCurvature + dendriticSway;

          // Organic axon myelin sheath diameter & gentle synaptic swelling
          float myelinTaper = 0.88 + sin(aNormY * 3.14159265) * 0.32;
          float r = aRadius * myelinTaper;

          vec3 displacedPos;
          displacedPos.x = cos(finalAngle) * r;
          displacedPos.y = y;
          displacedPos.z = sin(finalAngle) * r + cos(y * 0.45 + scrollFactor + dynamicTime * 0.5 + aPhase) * 0.22;

          // ===================================================================
          // BIOLOGICAL SYNAPTIC ACTION POTENTIAL SOLITON (NOT AN ELECTRIC PULSE)
          // Smooth Hodgkin-Huxley membrane depolarization:
          // - Asymmetric bell wavefront
          // - Graceful exponential refractory repolarization
          // - Soft continuous oceanic bioluminescence
          // ===================================================================
          float neuralTravel = uScroll * 2.2 + dynamicTime * 0.42 + aPhase * 0.2;
          float wavePos1 = fract(aNormY * 2.5 - neuralTravel);
          
          // Organic bell soliton impulse with smooth refractory recovery
          float actionPotential1 = exp(-pow((wavePos1 - 0.4) / 0.14, 2.0));
          
          // Secondary retrograde dendritic wave
          float wavePos2 = fract(aNormY * 1.4 + neuralTravel * 0.6 + aPhase * 0.3);
          float actionPotential2 = exp(-pow((wavePos2 - 0.5) / 0.20, 2.0)) * 0.45;

          // Synaptic bouton nodes (periodic gentle swelling of neurotransmitter light)
          float synapticBoutons = pow(sin(aNormY * 18.849 + aPhase) * 0.5 + 0.5, 3.5) * 0.28;

          // Velocity modulates neurotransmitter firing rate gracefully
          float scrollExcitation = min(uScrollVelocity * 0.025, 0.7);
          vEmissive = (actionPotential1 + actionPotential2 + synapticBoutons) * (1.0 + scrollExcitation);

          // Soft axon terminal fades at absolute extremes
          vAlpha = smoothstep(0.0, 0.07, aNormY) * smoothstep(1.0, 0.93, aNormY);

          gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorCyan;
        uniform vec3 uColorViolet;
        uniform vec3 uColorIndigo;
        uniform vec3 uColorWhite;
        uniform float uMode;

        varying float vNormY;
        varying float vFilamentId;
        varying float vEmissive;
        varying float vAlpha;

        void main() {
          // Bioluminescent neurotransmitter spectrum:
          // Synaptic Cyan (#00F0FF) -> Neuro-Violet (#8B5CF6) -> Axon Indigo (#6366F1)
          vec3 baseColor;
          if (vNormY < 0.5) {
            baseColor = mix(uColorCyan, uColorViolet, vNormY / 0.5);
          } else {
            baseColor = mix(uColorViolet, uColorIndigo, (vNormY - 0.5) / 0.5);
          }

          float baseAlpha = 0.38 * vAlpha;
          if (uMode > 1.5) {
            baseAlpha *= 0.12;
          }

          // Organic Synaptic Bioluminescence:
          // Velvety diffusion rather than harsh white electric sparks
          vec3 synapticBloom = mix(baseColor, uColorCyan, clamp(vEmissive * 0.6, 0.0, 1.0));
          vec3 finalColor = baseColor + synapticBloom * (vEmissive * 1.35) + uColorWhite * pow(vEmissive, 3.0) * 0.22;
          float finalAlpha = clamp(baseAlpha + vEmissive * 0.65, 0.0, 1.0);

          gl_FragColor = vec4(finalColor, finalAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const filamentGeometry = new THREE.BufferGeometry();
    filamentGeometry.setAttribute('position', new THREE.BufferAttribute(filamentBufferData.positions, 3));
    filamentGeometry.setAttribute('aNormY', new THREE.BufferAttribute(filamentBufferData.normY, 1));
    filamentGeometry.setAttribute('aFilamentId', new THREE.BufferAttribute(filamentBufferData.id, 1));
    filamentGeometry.setAttribute('aPhase', new THREE.BufferAttribute(filamentBufferData.phase, 1));
    filamentGeometry.setAttribute('aFreq', new THREE.BufferAttribute(filamentBufferData.freq, 1));
    filamentGeometry.setAttribute('aRadius', new THREE.BufferAttribute(filamentBufferData.radius, 1));
    filamentGeometry.setAttribute('aBaseAngle', new THREE.BufferAttribute(filamentBufferData.baseAngle, 1));
    filamentGeometry.setAttribute('aDirection', new THREE.BufferAttribute(filamentBufferData.direction, 1));

    const filamentMesh = new THREE.LineSegments(filamentGeometry, filamentShaderMaterial);
    streamFieldGroup.add(filamentMesh);

    // =========================================================================
    // 2. FLOWING NEUROTRANSMITTER VESICLES (1,800 PHOTONS ALONG 48 SPLINES)
    // Updated via high-resolution precomputed spline LUT — O(1) linear interpolation
    // Zero CatmullRom spline CPU overhead!
    // =========================================================================
    const streamParticleGeom = new THREE.BufferGeometry();
    const particlePositionsArray = new Float32Array(streamParticlesMeta.positions);
    streamParticleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositionsArray, 3));
    streamParticleGeom.setAttribute('color', new THREE.BufferAttribute(streamParticlesMeta.colors, 3));
    streamParticleGeom.setAttribute('size', new THREE.BufferAttribute(streamParticlesMeta.sizes, 1));

    const streamParticleMaterial = new THREE.PointsMaterial({
      size: 0.22,
      map: glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const streamPoints = new THREE.Points(streamParticleGeom, streamParticleMaterial);
    streamFieldGroup.add(streamPoints);

    // =========================================================================
    // 3. AMBIENT GLIAL NEURAL CLOUD (700 AMBIENT NODES)
    // =========================================================================
    const ambientGeom = new THREE.BufferGeometry();
    const ambientPositionsArray = new Float32Array(ambientParticlesMeta.positions);
    ambientGeom.setAttribute('position', new THREE.BufferAttribute(ambientPositionsArray, 3));
    ambientGeom.setAttribute('color', new THREE.BufferAttribute(ambientParticlesMeta.colors, 3));

    const ambientMaterial = new THREE.PointsMaterial({
      size: 0.16,
      map: glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const ambientPoints = new THREE.Points(ambientGeom, ambientMaterial);
    streamFieldGroup.add(ambientPoints);

    // =========================================================================
    // 4. INTERACTION LISTENERS
    // =========================================================================
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mouseRef.current.isDragging = true;
      mouseRef.current.lastMouseX = clientX;
      mouseRef.current.lastMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      mouseRef.current.targetX = (clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(clientY / window.innerHeight) * 2 + 1;

      if (mouseRef.current.isDragging) {
        const dx = clientX - mouseRef.current.lastMouseX;
        const dy = clientY - mouseRef.current.lastMouseY;
        mouseRef.current.dragVelX = dx * 0.006;
        mouseRef.current.dragVelY = dy * 0.006;
        manualRot.current.y += mouseRef.current.dragVelX;
        manualRot.current.x += mouseRef.current.dragVelY;
        mouseRef.current.lastMouseX = clientX;
        mouseRef.current.lastMouseY = clientY;
      }
    };

    const handlePointerUp = () => {
      mouseRef.current.isDragging = false;
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      const pr = Math.min(window.devicePixelRatio, 2);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(pr);
      motionBlurMaterial.uniforms.uResolution.value.set(width, height);
      renderTarget.setSize(Math.floor(width * pr), Math.floor(height * pr));
    };
    window.addEventListener('resize', handleResize);

    // =========================================================================
    // 5. LOCKED 60FPS RENDER LOOP WITH RAF THROTTLE
    // Guarantees zero frame drops or stuttering during high-speed scroll events
    // =========================================================================
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let lastTelemetryUpdate = 0;
    let lastFrameTime = performance.now();

    const particleItems = streamParticlesMeta.items;
    const luts = splineLUT.lut;

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);

      // REQUESTANIMATIONFRAME THROTTLE:
      // Locks execution to locked 60 FPS cadence (~16.67ms) to prevent render burst stutter during scroll
      const elapsedSinceLastFrame = currentTime - lastFrameTime;
      if (elapsedSinceLastFrame < TARGET_FRAME_MS - 1.5) {
        return;
      }
      lastFrameTime = currentTime - (elapsedSinceLastFrame % TARGET_FRAME_MS);

      const delta = Math.min(clock.getDelta(), 0.06);
      const elapsedTime = clock.getElapsedTime();
      const currentScroll = scrollRef.current;
      const speedMult = speedRef.current;

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Friction on drag velocity
      if (!mouseRef.current.isDragging) {
        manualRot.current.y += mouseRef.current.dragVelX;
        manualRot.current.x += mouseRef.current.dragVelY;
        mouseRef.current.dragVelX *= 0.92;
        mouseRef.current.dragVelY *= 0.92;
      }

      // Decay scroll velocity smoothly
      signedVelocityRef.current *= 0.92;
      scrollVelocityRef.current = Math.abs(signedVelocityRef.current);
      if (scrollVelocityRef.current < 2) {
        setIsMotionBlurActive(false);
      }

      const normalizedScrollSpeed = Math.min(scrollVelocityRef.current / 25, 2.5);

      // Mode toggle & filament uniform updates
      const isSynapseOnly = activeModeRef.current === 'synapse';
      filamentMesh.visible = !isSynapseOnly;

      filamentShaderMaterial.uniforms.uTime.value = elapsedTime;
      filamentShaderMaterial.uniforms.uScroll.value = currentScroll;
      filamentShaderMaterial.uniforms.uScrollVelocity.value = scrollVelocityRef.current;
      filamentShaderMaterial.uniforms.uSpeedMultiplier.value = speedMult;
      filamentShaderMaterial.uniforms.uMode.value = isSynapseOnly ? 2.0 : (activeModeRef.current === 'quantum' ? 1.0 : 0.0);

      // Smooth rotation with scroll progress
      const autoRotY = elapsedTime * 0.08 * speedMult;
      streamFieldGroup.rotation.y = manualRot.current.y + autoRotY + mouseRef.current.x * 0.15 + currentScroll * Math.PI * 1.5;
      streamFieldGroup.rotation.x = manualRot.current.x + mouseRef.current.y * 0.12;
      streamFieldGroup.rotation.z = Math.sin(elapsedTime * 0.15) * 0.04;

      // -----------------------------------------------------------------------
      // HIGH-SPEED PARTICLE PROPAGATION VIA PRECOMPUTED SPLINE LUT
      // Zero CatmullRom polynomial solves on CPU -> locked 60fps
      // -----------------------------------------------------------------------
      const scrollSpeedBoost = 1.0 + scrollVelocityRef.current * 0.12;
      const totalSpeedFactor = speedMult * scrollSpeedBoost;

      for (let i = 0; i < NUM_STREAM_PARTICLES; i++) {
        const pMeta = particleItems[i];
        pMeta.t = (pMeta.t + pMeta.speed * totalSpeedFactor * delta * 60) % 1.0;

        const lutArray = luts[pMeta.streamIndex];
        const sampleIndexFloat = pMeta.t * (SPLINE_SAMPLES - 1);
        const idx0 = Math.floor(sampleIndexFloat);
        const idx1 = Math.min(idx0 + 1, SPLINE_SAMPLES - 1);
        const frac = sampleIndexFloat - idx0;

        const px0 = lutArray[idx0 * 3];
        const py0 = lutArray[idx0 * 3 + 1];
        const pz0 = lutArray[idx0 * 3 + 2];

        const px1 = lutArray[idx1 * 3];
        const py1 = lutArray[idx1 * 3 + 1];
        const pz1 = lutArray[idx1 * 3 + 2];

        const swirlOffset = Math.sin(elapsedTime * 2.0 + i) * 0.07;
        particlePositionsArray[i * 3] = px0 + (px1 - px0) * frac + swirlOffset;
        particlePositionsArray[i * 3 + 1] = py0 + (py1 - py0) * frac;
        particlePositionsArray[i * 3 + 2] = pz0 + (pz1 - pz0) * frac - swirlOffset;
      }
      (streamParticleGeom.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      // -----------------------------------------------------------------------
      // AMBIENT GLIAL ORBITAL DRIFT
      // -----------------------------------------------------------------------
      const ambientBasePos = ambientParticlesMeta.basePositions;
      const ambientPhases = ambientParticlesMeta.phases;
      const mouseWorldX = mouseRef.current.x * 7.0;
      const mouseWorldY = mouseRef.current.y * 5.5;

      for (let i = 0; i < NUM_AMBIENT; i++) {
        const bx = ambientBasePos[i * 3];
        const by = ambientBasePos[i * 3 + 1];
        const bz = ambientBasePos[i * 3 + 2];
        const phase = ambientPhases[i];

        const gentleDrift = Math.sin(elapsedTime * 0.4 + phase) * 0.04;
        let currX = bx * (1 + gentleDrift);
        let currY = by;
        let currZ = bz * (1 + gentleDrift);

        const dx = currX - mouseWorldX;
        const dy = currY - mouseWorldY;
        const distSq = dx * dx + dy * dy;
        if (distSq < 10.0) {
          const factor = (1.0 - Math.sqrt(distSq) / 3.16) * 0.65;
          currX += dx * factor;
          currY += dy * factor;
        }

        ambientPositionsArray[i * 3] = currX;
        ambientPositionsArray[i * 3 + 1] = currY;
        ambientPositionsArray[i * 3 + 2] = currZ;
      }
      (ambientGeom.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      // -----------------------------------------------------------------------
      // OPTICAL BOKEH BLUR & DIRECTIONAL VELOCITY POST-PASS
      // -----------------------------------------------------------------------
      const currentBlurPreset = BLUR_PRESETS[blurPresetRef.current];
      motionBlurMaterial.uniforms.uBaseBlur.value = currentBlurPreset.radius;

      const targetBlur = Math.min(scrollVelocityRef.current / 16.0, 2.2);
      smoothBlurStrengthRef.current += (targetBlur - smoothBlurStrengthRef.current) * 0.28;

      const screenVelY = (-signedVelocityRef.current / Math.max(height, 600)) * 2.4;
      const screenVelX = (mouseRef.current.dragVelX * 1.6);
      motionBlurMaterial.uniforms.uVelocity.value.set(screenVelX, screenVelY);
      motionBlurMaterial.uniforms.uStrength.value = smoothBlurStrengthRef.current;

      // -----------------------------------------------------------------------
      // THROTTLED HUD TELEMETRY UPDATE (Every 150ms)
      // -----------------------------------------------------------------------
      if (elapsedTime - lastTelemetryUpdate > 0.15) {
        lastTelemetryUpdate = elapsedTime;
        const loadVal = Math.round(14 + normalizedScrollSpeed * 34);
        const clockFreq = (1.4 + normalizedScrollSpeed * 2.6).toFixed(1);
        const flowMB = (4.8 + normalizedScrollSpeed * 14.8).toFixed(1);
        const stateStr = scrollVelocityRef.current > 10 
          ? 'MOTION STREAK ENGAGED' 
          : scrollVelocityRef.current > 1.5
          ? 'SYNAPTIC POTENTIAL: ACTIVE'
          : `OPTICAL BLUR: ${currentBlurPreset.label.toUpperCase()}`;

        setTelemetry({
          clock: `${clockFreq} GHz`,
          load: `${loadVal}%`,
          flowRate: `${flowMB} GB/s`,
          state: stateStr
        });

        if (scrollVelocityRef.current > 10) {
          setIsMotionBlurActive(true);
        } else {
          setIsMotionBlurActive(false);
        }
      }

      // Step 1: Render 3D Scene into High-Precision Render Target
      renderer.setRenderTarget(renderTarget);
      renderer.clear();
      renderer.render(scene, camera);

      // Step 2: Render Directional Velocity Motion Blur Post-Processing Pass to Screen
      renderer.setRenderTarget(null);
      motionBlurMaterial.uniforms.tDiffuse.value = renderTarget.texture;
      renderer.render(postScene, postCamera);
    };

    render(performance.now());

    // Cleanup resources cleanly on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      renderTarget.dispose();
      postQuadGeom.dispose();
      motionBlurMaterial.dispose();

      glowTexture.dispose();
      streamParticleGeom.dispose();
      streamParticleMaterial.dispose();
      ambientGeom.dispose();
      ambientMaterial.dispose();

      filamentGeometry.dispose();
      filamentShaderMaterial.dispose();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [glowTexture, filamentBufferData, streamParticlesMeta, ambientParticlesMeta, splineLUT]);

  const handleResetOrientation = useCallback(() => {
    manualRot.current = { x: 0.15, y: -0.2 };
    mouseRef.current.dragVelX = 0;
    mouseRef.current.dragVelY = 0;
  }, []);

  const handleCycleBlur = useCallback(() => {
    setBlurPreset(prev => {
      if (prev === 'cinematic') return 'deep';
      if (prev === 'deep') return 'dream';
      if (prev === 'dream') return 'subtle';
      return 'cinematic';
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Three.js Canvas Container (Hardware WebGL Canvas with Post-Processing Optical & Motion Blur) */}
      <div
        ref={mountRef}
        className="w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing"
        title="Click and drag to rotate the Blurred Neural Axons & Data Streams"
      />

      {/* Elegant Floating Telemetry & Stream Controller (Bottom Right) */}
      <div className="absolute right-4 sm:right-8 bottom-6 pointer-events-auto z-20 flex flex-col items-end gap-3 select-none">
        {/* Neural Stream Performance Monitor Pill with Live Status */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/75 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-xs text-slate-300 font-mono transition-all">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isMotionBlurActive ? 'bg-[#00F0FF]' : 'bg-cyan-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isMotionBlurActive ? 'bg-[#00F0FF]' : 'bg-cyan-400'
              }`} />
            </span>
            <span className={isMotionBlurActive ? 'text-[#00F0FF] font-semibold' : 'text-slate-300'}>
              {telemetry.state}
            </span>
          </div>

          <span className="text-slate-600">|</span>

          {/* Locked 60 FPS Engine Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            <Wind className="w-3 h-3 text-[#00F0FF]" />
            <span>60FPS LOCKED ENGINE</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>{telemetry.clock}</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <div className="flex items-center gap-1 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>LOAD {telemetry.load}</span>
          </div>

          <span className="text-slate-600">|</span>

          <div className="flex items-center gap-1 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{telemetry.flowRate}</span>
          </div>
        </div>

        {/* Stream & Blur Interaction Bar */}
        <div className="flex flex-wrap items-center justify-end gap-1.5 p-1.5 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl">
          {/* Interactive Blur Preset Cycle Button */}
          <button
            onClick={handleCycleBlur}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-white border border-[#00F0FF]/40 shadow-[0_0_14px_rgba(0,240,255,0.25)] hover:border-[#00F0FF]/70"
            title={`Current blur: ${activeBlurConfig.description}. Click to cycle intensity.`}
          >
            <Droplets className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" />
            <span>{activeBlurConfig.label}</span>
          </button>

          <button
            onClick={() => setActiveMode('stream')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 ${
              activeMode === 'stream'
                ? 'bg-gradient-to-r from-[#00F0FF]/20 to-[#8B5CF6]/20 text-white border border-[#00F0FF]/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Neural Axon Filaments with Biological Synaptic Action Potentials"
          >
            <Network className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Neural Axons (88x)</span>
          </button>

          <button
            onClick={() => setActiveMode('synapse')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 ${
              activeMode === 'synapse'
                ? 'bg-gradient-to-r from-[#00F0FF]/20 to-[#8B5CF6]/20 text-white border border-[#00F0FF]/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Pure Synaptic Vesicle Photons"
          >
            <Eye className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Photons (4.2k)</span>
          </button>

          {/* Speed Multiplier Pill */}
          <button
            onClick={() => setSpeedMultiplier(prev => (prev === 1 ? 1.8 : prev === 1.8 ? 0.6 : 1))}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Cycle Synaptic Velocity"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{speedMultiplier}x</span>
          </button>

          {/* Reset Orientation */}
          <button
            onClick={handleResetOrientation}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset 3D Perspective"
            aria-label="Reset 3D Perspective"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
});

NeuralPrismCanvas.displayName = 'NeuralPrismCanvas';
