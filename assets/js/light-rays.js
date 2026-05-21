/**
 * LightRays - Vanilla JS WebGL light ray effect
 * Converted from React/OGL component for static HTML pages.
 * Requires: https://resource.trickle.so/vendor_lib/ogl.iife.js
 */

const LightRays = (() => {
  const hexToRgb = hex => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
  };

  const getAnchorAndDir = (origin, w, h) => {
    const outside = 0.2;
    switch (origin) {
      case 'top-left':     return { anchor: [0, -outside * h], dir: [0, 1] };
      case 'top-right':    return { anchor: [w, -outside * h], dir: [0, 1] };
      case 'left':         return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
      case 'right':        return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
      case 'bottom-left':  return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
      case 'bottom-center':return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
      case 'bottom-right': return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
      default:             return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
    }
  };

  const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

  const frag = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;
uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);
  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;
  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );
  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }
  vec4 rays1 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed);
  fragColor = rays1 * 0.5 + rays2 * 0.4;
  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }
  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;
  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }
  fragColor.rgb *= raysColor;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}`;

  function init(container, opts = {}) {
    if (!container || typeof OGL === 'undefined') {
      console.warn('LightRays: container or OGL not found.');
      return null;
    }

    const config = {
      raysOrigin:     opts.raysOrigin     || 'top-center',
      raysColor:      opts.raysColor      || '#a78bfa',
      raysSpeed:      opts.raysSpeed      || 0.8,
      lightSpread:    opts.lightSpread    || 1.2,
      rayLength:      opts.rayLength      || 2.5,
      pulsating:      opts.pulsating      || true,
      fadeDistance:    opts.fadeDistance    || 1.2,
      saturation:     opts.saturation     || 1.0,
      followMouse:    opts.followMouse    !== undefined ? opts.followMouse : true,
      mouseInfluence: opts.mouseInfluence || 0.08,
      noiseAmount:    opts.noiseAmount    || 0.0,
      distortion:     opts.distortion     || 0.0,
    };

    const { Renderer, Program, Triangle, Mesh } = OGL;

    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
    const gl = renderer.gl;
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.top = '0';
    gl.canvas.style.left = '0';
    gl.canvas.style.pointerEvents = 'none';
    gl.canvas.style.zIndex = '1';

    container.style.position = 'relative';
    container.appendChild(gl.canvas);

    const uniforms = {
      iTime:          { value: 0 },
      iResolution:    { value: [1, 1] },
      rayPos:         { value: [0, 0] },
      rayDir:         { value: [0, 1] },
      raysColor:      { value: hexToRgb(config.raysColor) },
      raysSpeed:      { value: config.raysSpeed },
      lightSpread:    { value: config.lightSpread },
      rayLength:      { value: config.rayLength },
      pulsating:      { value: config.pulsating ? 1.0 : 0.0 },
      fadeDistance:    { value: config.fadeDistance },
      saturation:     { value: config.saturation },
      mousePos:       { value: [0.5, 0.5] },
      mouseInfluence: { value: config.mouseInfluence },
      noiseAmount:    { value: config.noiseAmount },
      distortion:     { value: config.distortion },
    };

    const geometry = new Triangle(gl);
    const program  = new Program(gl, { vertex: vert, fragment: frag, uniforms });
    const mesh     = new Mesh(gl, { geometry, program });

    const mouse       = { x: 0.5, y: 0.5 };
    const smoothMouse = { x: 0.5, y: 0.5 };
    let animId = null;

    function updateSize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      const dpr = renderer.dpr;
      uniforms.iResolution.value = [w * dpr, h * dpr];
      const { anchor, dir } = getAnchorAndDir(config.raysOrigin, w * dpr, h * dpr);
      uniforms.rayPos.value = anchor;
      uniforms.rayDir.value = dir;
    }

    function loop(t) {
      uniforms.iTime.value = t * 0.001;
      if (config.followMouse && config.mouseInfluence > 0) {
        smoothMouse.x = smoothMouse.x * 0.92 + mouse.x * 0.08;
        smoothMouse.y = smoothMouse.y * 0.92 + mouse.y * 0.08;
        uniforms.mousePos.value = [smoothMouse.x, smoothMouse.y];
      }
      try {
        renderer.render({ scene: mesh });
      } catch (e) { return; }
      animId = requestAnimationFrame(loop);
    }

    function onMouseMove(e) {
      const rect = container.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
    }

    window.addEventListener('resize', updateSize);
    if (config.followMouse) window.addEventListener('mousemove', onMouseMove);
    updateSize();
    animId = requestAnimationFrame(loop);

    // Return destroy function
    return function destroy() {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', onMouseMove);
      try {
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
        if (gl.canvas.parentNode) gl.canvas.parentNode.removeChild(gl.canvas);
      } catch (e) {}
    };
  }

  return { init };
})();
