'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uLightMode;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  if (uLightMode > 0.5) {
    float energy = clamp(max(intensity, 0.0), 0.0, 1.0);
    float coverage = clamp(auroraAlpha * (0.55 + 0.45 * energy), 0.0, 0.86);
    vec3 chroma = pow(clamp(rampColor, 0.0, 1.0), vec3(1.2));
    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
    chroma /= max(chromaPeak, 0.0001);
    fragColor = vec4(mix(vec3(1.0), chroma, min(coverage * 1.08, 0.94)), 1.0);
  } else {
    fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
  }
}
`;

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
  lightMode?: boolean;
}

export default function Aurora(props: AuroraProps) {
  const { colorStops = ['#dad517', '#186cc9', '#084e0c'], amplitude = 1.0, blend = 0.5, lightMode = false } = props;
  const propsRef = useRef<AuroraProps>(props);
  propsRef.current = props;

  const ctnDom = useRef<HTMLDivElement>(null);
  const [webglActive, setWebglActive] = useState(false);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    let renderer: Renderer | null = null;
    let animateId = 0;

    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5)
      });
      const gl = renderer.gl;
      if (!gl) throw new Error("WebGL not supported");

      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.canvas.style.backgroundColor = 'transparent';
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      gl.canvas.style.position = 'absolute';
      gl.canvas.style.inset = '0';

      let program: Program | undefined;

      const resize = () => {
        if (!ctn || !renderer) return;
        const width = ctn.offsetWidth || window.innerWidth;
        const height = ctn.offsetHeight || window.innerHeight;
        renderer.setSize(width, height);
        if (program) {
          program.uniforms.uResolution.value = [width, height];
        }
      };
      window.addEventListener('resize', resize);
      resize();

      const geometry = new Triangle(gl);
      if ((geometry.attributes as any).uv) {
        delete (geometry.attributes as any).uv;
      }

      const colorStopsArray = colorStops.map(hex => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });

      program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: amplitude },
          uColorStops: { value: colorStopsArray },
          uResolution: { value: [ctn.offsetWidth || 300, ctn.offsetHeight || 300] },
          uBlend: { value: blend },
          uLightMode: { value: lightMode ? 1 : 0 }
        }
      });

      const mesh = new Mesh(gl, { geometry, program });
      ctn.appendChild(gl.canvas);
      setWebglActive(true);

      const update = (t: number) => {
        animateId = requestAnimationFrame(update);
        const { time = t * 0.01, speed = 1.0 } = propsRef.current;
        if (program) {
          program.uniforms.uTime.value = time * speed * 0.1;
          program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1.0;
          program.uniforms.uBlend.value = propsRef.current.blend ?? blend;
          program.uniforms.uLightMode.value = (propsRef.current.lightMode ?? lightMode) ? 1 : 0;
        }
        if (renderer) {
          renderer.render({ scene: mesh });
        }
      };
      animateId = requestAnimationFrame(update);

      return () => {
        cancelAnimationFrame(animateId);
        window.removeEventListener('resize', resize);
        if (gl && gl.canvas && gl.canvas.parentNode) {
          gl.canvas.parentNode.removeChild(gl.canvas);
        }
        if (gl && renderer) {
          const loseContext = gl.getExtension('WEBGL_lose_context');
          if (loseContext) loseContext.loseContext();
        }
      };
    } catch (e) {
      console.warn("WebGL Shader fallback triggered:", e);
      setWebglActive(false);
    }
  }, [colorStops, amplitude, blend, lightMode]);

  return (
    <div className="relative w-full h-full overflow-hidden pointer-events-none select-none bg-[#030d22]">
      {/* 1. Fluid GPU-Accelerated CSS Mesh Aurora Layer (Guaranteed on 100% of mobile devices) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden opacity-90">
        {/* Blob 1: Yellow/Lime (#dad517) */}
        <div 
          className="absolute -top-20 left-1/4 w-[450px] sm:w-[600px] h-[350px] sm:h-[450px] rounded-full blur-[90px] sm:blur-[120px] animate-aurora-1 opacity-70"
          style={{ backgroundColor: colorStops[0] || '#dad517' }}
        />
        {/* Blob 2: Vibrant Blue (#186cc9) */}
        <div 
          className="absolute top-10 -right-20 w-[400px] sm:w-[650px] h-[400px] sm:h-[500px] rounded-full blur-[100px] sm:blur-[130px] animate-aurora-2 opacity-80"
          style={{ backgroundColor: colorStops[1] || '#186cc9' }}
        />
        {/* Blob 3: Deep Emerald (#084e0c) */}
        <div 
          className="absolute -bottom-20 left-10 w-[500px] sm:w-[700px] h-[350px] sm:h-[450px] rounded-full blur-[90px] sm:blur-[120px] animate-aurora-3 opacity-60"
          style={{ backgroundColor: colorStops[2] || '#084e0c' }}
        />
        {/* Radial Depth Overlay */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#030d22]/40 to-[#030d22]/90" />
      </div>

      {/* 2. WebGL Canvas Container Overlay */}
      <div ref={ctnDom} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
}
