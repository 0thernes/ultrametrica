/**
 * ULTRAMETRICA — Zero-Dependency WebGL2 3D Hyperbolic Bruhat-Tits & Kerr-BTZ Renderer.
 *
 * Renders the living p-adic holographic spacetime in 3D:
 *   - Fractal Cantor-ring boundary Z_p / p^n Z_p with live probability-density pillars
 *   - Hyperbolic AdS Bruhat-Tits bulk tree T_p plunging downward into the holographic throat
 *   - Suspended rotating Kerr-BTZ black hole event horizon shader (T_p / p^{hZ})
 *   - Camera-facing volumetric geodesic edge ribbons with animated phase-current pulses
 *   - Analytic-SDF volumetric bulk nodes + dynamic gravitational strain displacement
 *   - 4 live physics shader modes: Field, Ollivier-Ricci Curvature, Ryu-Takayanagi Cut, Grav Strain
 *   - Exact 3D raycast picking of bulk nodes, edges (wormhole surgery), and boundary leaves
 */

const TWO_PI = 2 * Math.PI;

// ---- Minimal 4x4 Matrix & Vector Math (Column-Major for WebGL2) ----

function mat4Perspective(fovRad, aspect, near, far) {
  const f = 1.0 / Math.tan(fovRad * 0.5);
  const nf = 1.0 / (near - far);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (far + near) * nf;
  m[11] = -1;
  m[14] = 2 * far * near * nf;
  return m;
}

function mat4LookAt(eye, target, up) {
  let zx = eye[0] - target[0];
  let zy = eye[1] - target[1];
  let zz = eye[2] - target[2];
  let len = Math.hypot(zx, zy, zz) || 1;
  zx /= len; zy /= len; zz /= len;

  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;
  len = Math.hypot(xx, xy, xz) || 1;
  xx /= len; xy /= len; xz /= len;

  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;

  const m = new Float32Array(16);
  m[0] = xx; m[1] = yx; m[2] = zx; m[3] = 0;
  m[4] = xy; m[5] = yy; m[6] = zy; m[7] = 0;
  m[8] = xz; m[9] = yz; m[10] = zz; m[11] = 0;
  m[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2]);
  m[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2]);
  m[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2]);
  m[15] = 1;
  return m;
}

function mat4Multiply(a, b) {
  const out = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    const b0 = b[col * 4 + 0];
    const b1 = b[col * 4 + 1];
    const b2 = b[col * 4 + 2];
    const b3 = b[col * 4 + 3];
    for (let row = 0; row < 4; row++) {
      out[col * 4 + row] =
        a[0 + row] * b0 + a[4 + row] * b1 + a[8 + row] * b2 + a[12 + row] * b3;
    }
  }
  return out;
}

function mat4Invert(m) {
  const inv = new Float32Array(16);
  inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
  inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
  inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
  inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];

  inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
  inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
  inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
  inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];

  inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
  inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
  inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
  inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];

  inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
  inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
  inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
  inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

  let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
  if (Math.abs(det) < 1e-12) return inv;
  det = 1.0 / det;
  for (let i = 0; i < 16; i++) inv[i] *= det;
  return inv;
}

// Perceptually balanced cyclic complex phase palette (argument in [-pi, pi] -> RGB)
export function phaseToRGB(angle, out, off = 0) {
  const t = ((angle / TWO_PI) % 1 + 1) % 1;
  // Cosine palette tuned for high-contrast scientific readability on dark obsidian
  const r = 0.52 + 0.45 * Math.cos(TWO_PI * (t + 0.06));
  const g = 0.56 + 0.42 * Math.cos(TWO_PI * (t + 0.36));
  const b = 0.62 + 0.36 * Math.cos(TWO_PI * (t + 0.68));
  out[off] = Math.max(0.05, Math.min(1, r));
  out[off + 1] = Math.max(0.08, Math.min(1, g));
  out[off + 2] = Math.max(0.12, Math.min(1, b));
}

// Diverging scientific colormap for Ollivier-Ricci curvature delta = kappa - kappa_AdS
function ricciToRGB(deltaKappa, out, off = 0) {
  const x = Math.max(-1, Math.min(1, deltaKappa * 1.4));
  if (x < 0) {
    // Deeper negative curvature (gravitational well / pinched throat) -> incandescent crimson-amber
    const t = -x;
    out[off] = 0.24 + 0.76 * t;
    out[off + 1] = 0.34 + 0.14 * t - 0.18 * t * t;
    out[off + 2] = 0.58 * (1 - t) + 0.12 * t;
  } else {
    // Flatter / less negative curvature (compressed bridge / BTZ shortcut) -> luminous ice-cyan
    const t = x;
    out[off] = 0.24 * (1 - t) + 0.22 * t;
    out[off + 1] = 0.34 + 0.62 * t;
    out[off + 2] = 0.58 + 0.42 * t;
  }
}

// ---- GLSL 300 es Shaders ----

const GRID_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec4 aColor;
uniform mat4 uViewProj;
out vec4 vColor;
void main() {
  vColor = aColor;
  gl_Position = uViewProj * vec4(aPos, 1.0);
}
`;

const GRID_FS = `#version 300 es
precision highp float;
in vec4 vColor;
out vec4 fragColor;
void main() {
  fragColor = vColor;
}
`;

const HORIZON_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aQuad;
uniform mat4 uViewProj;
uniform float uRadius;
uniform float uY;
out vec2 vUV;
void main() {
  vUV = aQuad;
  vec3 world = vec3(aQuad.x * uRadius, uY, aQuad.y * uRadius);
  gl_Position = uViewProj * vec4(world, 1.0);
}
`;

const HORIZON_FS = `#version 300 es
precision highp float;
in vec2 vUV;
uniform float uTime;
uniform float uFlux;
uniform float uCurrent;
uniform float uActivity;
out vec4 fragColor;

void main() {
  float r = length(vUV);
  if (r > 1.04) discard;

  float theta = atan(vUV.y, vUV.x);
  float spin = uTime * (0.65 + 0.75 * uFlux) + uFlux * 2.2 * log(max(r, 0.08));
  float spiral = 0.5 + 0.5 * sin(theta * 5.0 - spin + 1.8 * sin(r * 9.0 - uTime * 2.4));
  float spiral2 = 0.5 + 0.5 * cos(theta * 9.0 + spin * 0.7);

  // Dark Schwarzschild shadow interior + luminous Kerr photon-sphere accretion rim
  float coreShadow = smoothstep(0.28, 0.94, r);
  float photonRing = exp(-pow((r - 0.91) * 14.0, 2.0));
  float innerVortex = smoothstep(0.15, 0.88, r) * (1.0 - smoothstep(0.88, 1.04, r));

  vec3 vortexCol = mix(vec3(0.08, 0.16, 0.34), vec3(0.95, 0.44, 0.16), spiral * (0.45 + 0.55 * uActivity));
  vortexCol += vec3(0.20, 0.78, 0.96) * spiral2 * 0.28 * (0.3 + abs(uCurrent) * 6.0);

  vec3 ringCol = vec3(1.0, 0.72, 0.34) * (0.85 + 0.35 * sin(theta * 3.0 - uTime * 3.5));
  vec3 col = mix(vec3(0.015, 0.02, 0.035), vortexCol, coreShadow * 0.75) + ringCol * photonRing * 1.15;

  float alpha = smoothstep(1.04, 0.92, r) * (0.92 * (1.0 - 0.18 * innerVortex) + 0.3 * photonRing);
  fragColor = vec4(col, clamp(alpha, 0.0, 0.96));
}
`;

// Volumetric camera-aligned geodesic edge ribbons
const EDGE_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec3 aPosA;
layout(location = 1) in vec3 aPosB;
layout(location = 2) in vec2 aCorner;   // x in [0,1] along edge, y in [-1,1] across ribbon width
layout(location = 3) in vec4 aColorA;   // rgb + width
layout(location = 4) in vec4 aColorB;   // rgb + intensity
layout(location = 5) in vec2 aFlow;     // x = pulse speed/dir, y = highlight flag

uniform mat4 uViewProj;
uniform vec3 uCamPos;

out vec2 vUV;
out vec3 vColor;
out float vIntensity;
out vec2 vFlow;

void main() {
  vec3 center = mix(aPosA, aPosB, aCorner.x);
  vec3 dir = normalize(aPosB - aPosA + vec3(1e-6));
  vec3 toCam = normalize(uCamPos - center);
  vec3 side = cross(dir, toCam);
  float sideLen = length(side);
  side = sideLen > 1e-4 ? side / sideLen : vec3(1.0, 0.0, 0.0);

  float width = aColorA.a;
  vec3 world = center + side * (aCorner.y * width);

  vUV = aCorner;
  vColor = mix(aColorA.rgb, aColorB.rgb, aCorner.x);
  vIntensity = aColorB.a;
  vFlow = aFlow;
  gl_Position = uViewProj * vec4(world, 1.0);
}
`;

const EDGE_FS = `#version 300 es
precision highp float;
in vec2 vUV;
in vec3 vColor;
in float vIntensity;
in vec2 vFlow;

uniform float uTime;
out vec4 fragColor;

void main() {
  float across = abs(vUV.y);
  // Crisp luminous filament core + soft exponential bloom halo
  float core = exp(-across * across * 9.5);
  float halo = exp(-across * across * 2.1) * 0.42;

  // Animated phase-current pulse flowing along the geodesic
  float pulseWave = 0.5 + 0.5 * sin(vUV.x * 12.56637 - uTime * (2.2 + vFlow.x * 5.0));
  float pulse = 1.0 + 0.45 * pow(pulseWave, 3.0) * clamp(abs(vFlow.x) + vFlow.y, 0.0, 1.5);

  // Subtle highlight shimmer on Ryu-Takayanagi / triangle geodesic edges
  float special = vFlow.y;
  vec3 finalCol = vColor * (core * 1.35 + halo) * pulse + vec3(1.0, 0.96, 0.85) * core * 0.35 * special;
  float alpha = clamp((core * 0.95 + halo) * vIntensity, 0.0, 1.0);
  if (alpha < 0.01) discard;
  fragColor = vec4(finalCol, alpha);
}
`;

// Analytic-SDF glowing volumetric 3D node billboards
const NODE_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec3 aCenter;
layout(location = 1) in vec2 aQuad;     // [-1, 1] x [-1, 1]
layout(location = 2) in vec4 aColor;    // rgb + radius
layout(location = 3) in vec2 aMeta;     // x = glow intensity, y = ring highlight (hover / probe)

uniform mat4 uViewProj;
uniform vec3 uCamRight;
uniform vec3 uCamUp;

out vec2 vUV;
out vec3 vColor;
out vec2 vMeta;

void main() {
  float rad = aColor.a;
  vec3 world = aCenter + (uCamRight * aQuad.x + uCamUp * aQuad.y) * rad;
  vUV = aQuad;
  vColor = aColor.rgb;
  vMeta = aMeta;
  gl_Position = uViewProj * vec4(world, 1.0);
}
`;

const NODE_FS = `#version 300 es
precision highp float;
in vec2 vUV;
in vec3 vColor;
in vec2 vMeta;
out vec4 fragColor;

void main() {
  float r = length(vUV);
  if (r > 1.0) discard;

  float sphereR = 0.56;
  float core = 1.0 - smoothstep(sphereR * 0.72, sphereR, r);
  float halo = exp(-r * r * 4.5) * 0.58 * vMeta.x;

  // Analytic pseudo-3D sphere shading inside core
  float z = sqrt(max(0.0, 1.0 - clamp(r / sphereR, 0.0, 1.0) * clamp(r / sphereR, 0.0, 1.0)));
  vec3 normal = normalize(vec3(vUV / sphereR, z + 0.001));
  float spec = pow(max(0.0, dot(normal, normalize(vec3(-0.35, 0.55, 0.75)))), 14.0);
  float fresnel = pow(1.0 - z, 2.2);

  vec3 sphereCol = vColor * (0.65 + 0.6 * z) + vec3(0.95, 0.98, 1.0) * spec * 0.65 + vColor * fresnel * 0.6;
  vec3 col = sphereCol * core + vColor * halo;

  // Crisp precision reticle ring for hovered or probed nodes
  float ring = exp(-pow((r - 0.84) * 18.0, 2.0)) * vMeta.y;
  col += vec3(1.0, 0.94, 0.72) * ring * 1.4;

  float alpha = clamp(core * 0.96 + halo + ring, 0.0, 1.0);
  fragColor = vec4(col, alpha);
}
`;

function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(`WebGL2 shader compile error: ${log}`);
  }
  return s;
}

function createProgram(gl, vsSrc, fsSrc) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(prog);
    throw new Error(`WebGL2 program link error: ${log}`);
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return prog;
}

export class HyperbolicRenderer3D {
  constructor(canvas) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl2', {
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.gl = gl;
    this.supported = Boolean(gl);

    // View mode: 'field' | 'ricci' | 'rt' | 'gravity'
    this.viewMode = 'field';
    this.showTriangleOverlay = false;

    // Spherical orbit camera with smooth damping
    this.yaw = 0.58;
    this.pitch = 0.56;
    this.distance = 6.2;
    this.targetYaw = 0.58;
    this.targetPitch = 0.56;
    this.targetDistance = 6.2;
    this.targetY = -0.18;
    this.autoRotate = true;

    this.hoveredNode = -1;
    this.hoveredEdge = -1;

    // Cached topology layout & dynamic node positions
    this._topoKey = '';
    this.basePos = null;
    this.nodePos = null;
    this.nodeAngle = null;
    this.nodeRadius = null;

    // Camera matrices cached for exact raycast picking
    this.camPos = [0, 3, 5];
    this.camRight = [1, 0, 0];
    this.camUp = [0, 1, 0];
    this.viewProj = new Float32Array(16);
    this.invViewProj = new Float32Array(16);

    if (this.supported) {
      this._initGL();
      this._initPointerControls();
      this.canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        this.supported = false;
        document.getElementById('webglFallback')?.classList.remove('hidden');
      });
      this.canvas.addEventListener('webglcontextrestored', () => {
        try {
          this._topoKey = '';
          this._initGL();
          this.supported = true;
          document.getElementById('webglFallback')?.classList.add('hidden');
        } catch {
          this.supported = false;
        }
      });
    }
  }

  _initGL() {
    const gl = this.gl;

    this.progGrid = createProgram(gl, GRID_VS, GRID_FS);
    this.progHorizon = createProgram(gl, HORIZON_VS, HORIZON_FS);
    this.progEdge = createProgram(gl, EDGE_VS, EDGE_FS);
    this.progNode = createProgram(gl, NODE_VS, NODE_FS);

    // Cache WebGL2 uniform locations once (zero per-frame GL string lookups)
    this.uGridViewProj = gl.getUniformLocation(this.progGrid, 'uViewProj');
    this.uHorViewProj = gl.getUniformLocation(this.progHorizon, 'uViewProj');
    this.uHorRadius = gl.getUniformLocation(this.progHorizon, 'uRadius');
    this.uHorY = gl.getUniformLocation(this.progHorizon, 'uY');
    this.uHorTime = gl.getUniformLocation(this.progHorizon, 'uTime');
    this.uHorFlux = gl.getUniformLocation(this.progHorizon, 'uFlux');
    this.uHorCurrent = gl.getUniformLocation(this.progHorizon, 'uCurrent');
    this.uHorActivity = gl.getUniformLocation(this.progHorizon, 'uActivity');
    this.uEdgeViewProj = gl.getUniformLocation(this.progEdge, 'uViewProj');
    this.uEdgeCamPos = gl.getUniformLocation(this.progEdge, 'uCamPos');
    this.uEdgeTime = gl.getUniformLocation(this.progEdge, 'uTime');
    this.uNodeViewProj = gl.getUniformLocation(this.progNode, 'uViewProj');
    this.uNodeCamRight = gl.getUniformLocation(this.progNode, 'uCamRight');
    this.uNodeCamUp = gl.getUniformLocation(this.progNode, 'uCamUp');

    // Static reference hyperbolic rings geometry
    this.gridVao = gl.createVertexArray();
    this.gridBuf = gl.createBuffer();
    this.gridVertexCount = 0;
    this._buildGridGeometry();

    // Horizon disc quad
    this.horizonVao = gl.createVertexArray();
    this.horizonBuf = gl.createBuffer();
    gl.bindVertexArray(this.horizonVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.horizonBuf);
    const hQuad = new Float32Array([-1.06, -1.06, 1.06, -1.06, 1.06, 1.06, -1.06, -1.06, 1.06, 1.06, -1.06, 1.06]);
    gl.bufferData(gl.ARRAY_BUFFER, hQuad, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // Dynamic Edge Ribbon VAO (18 floats per vertex * 6 vertices per edge)
    this.edgeVao = gl.createVertexArray();
    this.edgeBuf = gl.createBuffer();
    gl.bindVertexArray(this.edgeVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuf);
    const edgeStride = 18 * 4;
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, edgeStride, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, edgeStride, 12);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 2, gl.FLOAT, false, edgeStride, 24);
    gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 4, gl.FLOAT, false, edgeStride, 32);
    gl.enableVertexAttribArray(4); gl.vertexAttribPointer(4, 4, gl.FLOAT, false, edgeStride, 48);
    gl.enableVertexAttribArray(5); gl.vertexAttribPointer(5, 2, gl.FLOAT, false, edgeStride, 64);

    // Dynamic Node Billboard VAO (11 floats per vertex * 6 vertices per node)
    this.nodeVao = gl.createVertexArray();
    this.nodeBuf = gl.createBuffer();
    gl.bindVertexArray(this.nodeVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.nodeBuf);
    const nodeStride = 11 * 4;
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, nodeStride, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 2, gl.FLOAT, false, nodeStride, 12);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 4, gl.FLOAT, false, nodeStride, 20);
    gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 2, gl.FLOAT, false, nodeStride, 36);

    gl.bindVertexArray(null);
  }

  _buildGridGeometry() {
    const gl = this.gl;
    const verts = [];
    const pushLine = (x1, y1, z1, x2, y2, z2, r, g, b, a) => {
      verts.push(x1, y1, z1, r, g, b, a, x2, y2, z2, r, g, b, a);
    };

    // Concentric hyperbolic depth rings following the AdS Poincaré bowl contour
    const segs = 128;
    const rings = [0.68, 1.32, 1.98, 2.68];
    const ys = [-1.05, -0.62, -0.14, 0.35];
    for (let ri = 0; ri < rings.length; ri++) {
      const R = rings[ri];
      const y = ys[ri];
      const alpha = ri === rings.length - 1 ? 0.24 : 0.11;
      for (let i = 0; i < segs; i++) {
        const a0 = (i / segs) * TWO_PI;
        const a1 = ((i + 1) / segs) * TWO_PI;
        pushLine(
          Math.cos(a0) * R, y, Math.sin(a0) * R,
          Math.cos(a1) * R, y, Math.sin(a1) * R,
          0.35, 0.56, 0.82, alpha
        );
      }
    }

    // Subtle polar reference spokes on outer rim
    for (let s = 0; s < 12; s++) {
      const a = (s / 12) * TWO_PI;
      const c = Math.cos(a);
      const sn = Math.sin(a);
      pushLine(c * 2.68, 0.35, sn * 2.68, c * 2.86, 0.35, sn * 2.86, 0.45, 0.62, 0.85, 0.22);
    }

    this.gridVertexCount = verts.length / 7;
    gl.bindVertexArray(this.gridVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.gridBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 28, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 28, 12);
    gl.bindVertexArray(null);
  }

  _initPointerControls() {
    let dragging = false;
    let movedDist = 0;
    let lastX = 0;
    let lastY = 0;

    this.onPickClick = null;
    this.onHoverChange = null;

    this.canvas.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.button !== 2) return;
      dragging = true;
      movedDist = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      this.canvas.setPointerCapture(e.pointerId);
    });

    this.canvas.addEventListener('pointermove', (e) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      if (dragging) {
        movedDist += Math.hypot(dx, dy);
        if (movedDist > 3) {
          this.autoRotate = false;
          this.targetYaw -= dx * 0.0062;
          this.targetPitch = Math.max(-0.35, Math.min(1.42, this.targetPitch + dy * 0.0062));
        }
      } else if (this._lastSim) {
        const hit = this.pickAtClient(e.clientX, e.clientY, this._lastSim);
        if (hit.node !== this.hoveredNode || hit.edge !== this.hoveredEdge) {
          this.hoveredNode = hit.node;
          this.hoveredEdge = hit.edge;
          if (this.onHoverChange) this.onHoverChange(hit);
        }
      }
    });

    this.canvas.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      dragging = false;
      try { this.canvas.releasePointerCapture(e.pointerId); } catch {}

      if (movedDist < 6 && this._lastSim && this.onPickClick) {
        const hit = this.pickAtClient(e.clientX, e.clientY, this._lastSim);
        this.onPickClick(hit, e);
      }
    });

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    this.canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.targetDistance = Math.max(2.6, Math.min(11.5, this.targetDistance * (1 + e.deltaY * 0.0009)));
      },
      { passive: false }
    );
  }

  /**
   * Compute canonical 3D Hyperbolic Poincaré Bowl + Fractal Cantor-Ring embedding
   * for the Bruhat-Tits tree T_p or BTZ Black Hole T_p / p^{hZ}.
   */
  _ensureLayout(sim) {
    const bulk = sim.bulk;
    const key = `${sim.p}_${sim.n}_${bulk.horizonDepth}`;
    if (key === this._topoKey) return;
    this._topoKey = key;

    const V = bulk.numNodes;
    this.basePos = new Float32Array(V * 3);
    this.nodePos = new Float32Array(V * 3);
    this.nodeAngle = new Float32Array(V);
    this.nodeRadius = new Float32Array(V);

    const p = sim.p;
    const n = sim.n;
    const dMin = bulk.horizonDepth;
    const depthSpan = Math.max(1, n - dMin);

    // Assign fractal Cantor angular spans [a0, a1] top-down so ultrametric balls visibly cluster!
    const angStart = new Float64Array(V);
    const angEnd = new Float64Array(V);

    if (!bulk.isBTZ) {
      angStart[0] = 0;
      angEnd[0] = TWO_PI;
    } else {
      const L = bulk.horizonLength;
      const sector = TWO_PI / L;
      const gap = sector * 0.08;
      for (let j = 0; j < L; j++) {
        const u = bulk.horizonNodes[j];
        angStart[u] = j * sector + gap * 0.5;
        angEnd[u] = (j + 1) * sector - gap * 0.5;
      }
    }

    for (let u = 0; u < V; u++) {
      const ch = bulk.children[u];
      if (ch.length === 0) continue;
      const a0 = angStart[u];
      const span = angEnd[u] - a0;
      const relDepth = bulk.nodeDepth[u] - dMin;
      // Genuine Cantor ultrametric gap separating sibling p-adic balls
      const gapFrac = Math.max(0.05, 0.16 * (0.82 ** relDepth));
      const usable = span * (1.0 - gapFrac);
      const childSpan = usable / p;
      const stepGap = (span * gapFrac) / p;

      for (let r = 0; r < ch.length; r++) {
        const c = ch[r];
        const s0 = a0 + r * (childSpan + stepGap) + stepGap * 0.5;
        angStart[c] = s0;
        angEnd[c] = s0 + childSpan;
      }
    }

    const R_OUT = 2.68;
    const R_IN = bulk.isBTZ ? 0.68 : 0.0;
    const Y_TOP = 0.35;
    const Y_BOT = bulk.isBTZ ? -1.05 : -1.42;

    for (let u = 0; u < V; u++) {
      const d = bulk.nodeDepth[u];
      const t = (d - dMin) / depthSpan;
      const rNorm = Math.tanh(1.65 * t) / Math.tanh(1.65);
      const radius = R_IN + (R_OUT - R_IN) * rNorm;
      const y = Y_BOT + (Y_TOP - Y_BOT) * (1.0 - (1.0 - t) ** 1.45);
      const theta = 0.5 * (angStart[u] + angEnd[u]);

      this.nodeAngle[u] = theta;
      this.nodeRadius[u] = radius;
      this.basePos[u * 3 + 0] = Math.cos(theta) * radius;
      this.basePos[u * 3 + 1] = y;
      this.basePos[u * 3 + 2] = Math.sin(theta) * radius;
    }

    this.nodePos.set(this.basePos);

    // Preallocate CPU staging arrays for zero-GC rendering
    const maxEdgeSegs = bulk.numEdges + bulk.N + 16; // bulk edges + boundary wave pillars
    this._edgeData = new Float32Array(maxEdgeSegs * 6 * 18);
    this._nodeData = new Float32Array(V * 6 * 11);
    this._triEdgeMask = new Uint8Array(bulk.numEdges);
  }

  /**
   * Apply live dynamic gravitational strain deformation so stretching edges a_e > 1
   * physically warp the 3D hyperbolic Bruhat-Tits throat in real time!
   */
  _updateDynamicPositions(sim) {
    const bulk = sim.bulk;
    const V = bulk.numNodes;
    const base = this.basePos;
    const pos = this.nodePos;

    // Accumulate downward/inward gravitational throat sag from ancestors
    for (let u = 0; u < V; u++) {
      let sag = 0;
      let radialPull = 0;
      const pe = bulk.parentEdge[u];
      if (pe >= 0) {
        const s = bulk.sigma[pe] + bulk.pinSigma[pe];
        sag = s * 0.24;
        radialPull = -s * 0.05;
      } else if (bulk.isHorizon[u]) {
        const nb = bulk.adj[u];
        let hs = 0;
        let cnt = 0;
        for (let i = 0; i < nb.length; i++) {
          if (bulk.edges[nb[i].edge].isHorizon) {
            hs += bulk.sigma[nb[i].edge] + bulk.pinSigma[nb[i].edge];
            cnt++;
          }
        }
        if (cnt > 0) sag = (hs / cnt) * 0.18;
      }

      const bx = base[u * 3 + 0];
      const by = base[u * 3 + 1];
      const bz = base[u * 3 + 2];

      // Keep boundary leaves slightly breathing while internal bulk throat stretches dramatically
      const flex = bulk.isLeaf[u] ? 0.25 : 1.0;
      const scaleR = 1.0 + radialPull * flex;
      pos[u * 3 + 0] = bx * scaleR;
      pos[u * 3 + 1] = by - sag * flex;
      pos[u * 3 + 2] = bz * scaleR;
    }
  }

  /** Resize canvas cleanly to device pixel ratio. */
  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(this.canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
  }

  /** Exact 3D raycast picking of bulk/boundary nodes and bulk edges. */
  pickAtClient(clientX, clientY, sim) {
    const rect = this.canvas.getBoundingClientRect();
    const ndcX = ((clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
    const ndcY = 1 - ((clientY - rect.top) / Math.max(1, rect.height)) * 2;

    const unproject = (x, y, z) => {
      const m = this.invViewProj;
      const rx = m[0] * x + m[4] * y + m[8] * z + m[12];
      const ry = m[1] * x + m[5] * y + m[9] * z + m[13];
      const rz = m[2] * x + m[6] * y + m[10] * z + m[14];
      const rw = m[3] * x + m[7] * y + m[11] * z + m[15] || 1;
      return [rx / rw, ry / rw, rz / rw];
    };

    const nearP = unproject(ndcX, ndcY, -1);
    const farP = unproject(ndcX, ndcY, 1);
    let dx = farP[0] - nearP[0];
    let dy = farP[1] - nearP[1];
    let dz = farP[2] - nearP[2];
    const len = Math.hypot(dx, dy, dz) || 1;
    dx /= len; dy /= len; dz /= len;

    const roX = nearP[0], roY = nearP[1], roZ = nearP[2];
    const bulk = sim.bulk;
    const pos = this.nodePos;

    // 1. Closest node to ray
    let bestNode = -1;
    let bestNodeDist = 0.14;
    for (let u = 0; u < bulk.numNodes; u++) {
      const px = pos[u * 3 + 0] - roX;
      const py = pos[u * 3 + 1] - roY;
      const pz = pos[u * 3 + 2] - roZ;
      const t = px * dx + py * dy + pz * dz;
      if (t < 0) continue;
      const cx = px - t * dx;
      const cy = py - t * dy;
      const cz = pz - t * dz;
      const d = Math.hypot(cx, cy, cz);
      const thresh = bulk.isLeaf[u] ? 0.11 : 0.15;
      if (d < thresh && d < bestNodeDist) {
        bestNodeDist = d;
        bestNode = u;
      }
    }

    // 2. Closest bulk edge segment to ray
    let bestEdge = -1;
    let bestEdgeDist = 0.11;
    for (let ei = 0; ei < bulk.numEdges; ei++) {
      const e = bulk.edges[ei];
      const ax = pos[e.u * 3 + 0], ay = pos[e.u * 3 + 1], az = pos[e.u * 3 + 2];
      const bx = pos[e.v * 3 + 0], by = pos[e.v * 3 + 1], bz = pos[e.v * 3 + 2];

      // Closest point between ray (ro + t*d) and segment (a + s*(b-a))
      const ux = bx - ax, uy = by - ay, uz = bz - az;
      const wx = roX - ax, wy = roY - ay, wz = roZ - az;
      const aDot = dx * dx + dy * dy + dz * dz;
      const bDot = dx * ux + dy * uy + dz * uz;
      const cDot = ux * ux + uy * uy + uz * uz;
      const dDot = dx * wx + dy * wy + dz * wz;
      const eDot = ux * wx + uy * wy + uz * wz;
      const denom = aDot * cDot - bDot * bDot;

      let sN, sD = denom;
      let tN, tD = denom;
      if (denom < 1e-7) {
        sN = 0; sD = 1; tN = -dDot; tD = aDot;
      } else {
        tN = bDot * eDot - cDot * dDot;
        sN = aDot * eDot - bDot * dDot;
        if (sN < 0) { sN = 0; tN = -dDot; tD = aDot; }
        else if (sN > sD) { sN = sD; tN = -dDot + bDot; tD = aDot; }
      }
      const s = Math.max(0, Math.min(1, sN / (sD || 1)));
      const t = Math.max(0, tN / (tD || 1));

      const px = roX + t * dx - (ax + s * ux);
      const py = roY + t * dy - (ay + s * uy);
      const pz = roZ + t * dz - (az + s * uz);
      const dist = Math.hypot(px, py, pz);
      if (dist < bestEdgeDist) {
        bestEdgeDist = dist;
        bestEdge = ei;
      }
    }

    const leaf =
      bestNode >= 0 && bulk.isLeaf[bestNode]
        ? bulk.nodeIndexInLevel[bestNode]
        : -1;

    return { node: bestNode, edge: bestEdge, leaf };
  }

  render(sim, timeSec) {
    if (!this.supported) return;
    this._lastSim = sim;
    this.resize();
    this._ensureLayout(sim);
    this._updateDynamicPositions(sim);

    const gl = this.gl;
    const bulk = sim.bulk;
    const quantum = sim.quantum;
    const V = bulk.numNodes;
    const E = bulk.numEdges;

    // Smooth camera update
    if (this.autoRotate) {
      this.targetYaw += 0.0022;
    }
    this.yaw += (this.targetYaw - this.yaw) * 0.1;
    this.pitch += (this.targetPitch - this.pitch) * 0.1;
    this.distance += (this.targetDistance - this.distance) * 0.1;

    const cp = Math.cos(this.pitch);
    const sp = Math.sin(this.pitch);
    const cy = Math.cos(this.yaw);
    const sy = Math.sin(this.yaw);

    this.camPos = [
      this.distance * cp * sy,
      this.targetY + this.distance * sp,
      this.distance * cp * cy,
    ];
    const target = [0, this.targetY, 0];
    const view = mat4LookAt(this.camPos, target, [0, 1, 0]);
    const aspect = this.canvas.width / Math.max(1, this.canvas.height);
    const proj = mat4Perspective((42 * Math.PI) / 180, aspect, 0.1, 60);
    this.viewProj = mat4Multiply(proj, view);
    this.invViewProj = mat4Invert(this.viewProj);

    // Camera right & up vectors from view matrix rows
    this.camRight = [view[0], view[4], view[8]];
    this.camUp = [view[1], view[5], view[9]];

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0.024, 0.032, 0.052, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);

    // ---- Pass 1: Hyperbolic Reference Grid ----
    gl.depthMask(false);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.progGrid);
    gl.uniformMatrix4fv(this.uGridViewProj, false, this.viewProj);
    gl.bindVertexArray(this.gridVao);
    gl.drawArrays(gl.LINES, 0, this.gridVertexCount);

    // ---- Pass 2: Kerr-BTZ Black Hole Event Horizon Disc ----
    if (bulk.isBTZ) {
      gl.useProgram(this.progHorizon);
      gl.uniformMatrix4fv(this.uHorViewProj, false, this.viewProj);
      gl.uniform1f(this.uHorRadius, 0.69);
      // Match horizon ring vertical position (including average gravitational sag)
      let avgHy = 0;
      for (let j = 0; j < bulk.horizonLength; j++) {
        avgHy += this.nodePos[bulk.horizonNodes[j] * 3 + 1];
      }
      avgHy /= Math.max(1, bulk.horizonLength);
      gl.uniform1f(this.uHorY, avgHy);
      gl.uniform1f(this.uHorTime, timeSec);
      gl.uniform1f(this.uHorFlux, bulk.horizonFlux);
      gl.uniform1f(this.uHorCurrent, bulk.horizonFluxCurrent);
      gl.uniform1f(
        this.uHorActivity,
        Math.min(1.0, Math.sqrt(bulk.totalGravEnergy * 0.08))
      );
      gl.bindVertexArray(this.horizonVao);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // ---- Build Geodesic Edge Ribbons + Boundary Probability Pillars ----
    const edgeData = this._edgeData;
    let eOff = 0;
    const colA = [0, 0, 0];
    const colB = [0, 0, 0];

    const pushRibbon = (ax, ay, az, bx, by, bz, rA, gA, bA, rB, gB, bB, width, intensity, flowSpeed, special) => {
      const corners = [
        [0, -1], [1, -1], [1, 1],
        [0, -1], [1, 1], [0, 1],
      ];
      for (let k = 0; k < 6; k++) {
        edgeData[eOff++] = ax; edgeData[eOff++] = ay; edgeData[eOff++] = az;
        edgeData[eOff++] = bx; edgeData[eOff++] = by; edgeData[eOff++] = bz;
        edgeData[eOff++] = corners[k][0]; edgeData[eOff++] = corners[k][1];
        edgeData[eOff++] = rA; edgeData[eOff++] = gA; edgeData[eOff++] = bA; edgeData[eOff++] = width;
        edgeData[eOff++] = rB; edgeData[eOff++] = gB; edgeData[eOff++] = bB; edgeData[eOff++] = intensity;
        edgeData[eOff++] = flowSpeed; edgeData[eOff++] = special;
      }
    };

    // Build set of edges on Ultrametric Triangle geodesics when overlay is active (zero per-frame alloc)
    let triEdgeMask = null;
    if (this.showTriangleOverlay && sim.triangleGeodesics) {
      triEdgeMask = this._triEdgeMask;
      triEdgeMask.fill(0);
      for (let g = 0; g < sim.triangleGeodesics.length; g++) {
        const edges = sim.triangleGeodesics[g].edges;
        for (let i = 0; i < edges.length; i++) triEdgeMask[edges[i]] |= 1 << g;
      }
    }

    // Find max bulk amplitude for crisp auto-scaling without blowing out
    let maxLeafAmp = 1e-6;
    for (let l = 0; l < sim.space.N; l++) {
      const a = Math.hypot(quantum.leafRe[l], quantum.leafIm[l]);
      if (a > maxLeafAmp) maxLeafAmp = a;
    }
    const invMaxAmp = 1.0 / maxLeafAmp;
    const baseAdSKappa = (-2 * (sim.p - 1)) / (sim.p + 1);
    const pos = this.nodePos;
    const radialBoost = (nodeId) => sim.p ** (0.42 * (sim.n - bulk.nodeDepth[nodeId]));

    let ribbonCount = 0;

    for (let ei = 0; ei < E; ei++) {
      const e = bulk.edges[ei];
      const u = e.u;
      const v = e.v;
      const ax = pos[u * 3 + 0], ay = pos[u * 3 + 1], az = pos[u * 3 + 2];
      const bx = pos[v * 3 + 0], by = pos[v * 3 + 1], bz = pos[v * 3 + 2];

      // Holographic radial rescaling z^{-Delta_eff} * |phi| so bulk propagation glows all the way to the core
      const ampU = Math.min(1.0, Math.hypot(bulk.phiRe[u], bulk.phiIm[u]) * invMaxAmp * radialBoost(u) * 1.15);
      const ampV = Math.min(1.0, Math.hypot(bulk.phiRe[v], bulk.phiIm[v]) * invMaxAmp * radialBoost(v) * 1.15);
      const phaseU = Math.atan2(bulk.phiIm[u], bulk.phiRe[u]);
      const phaseV = Math.atan2(bulk.phiIm[v], bulk.phiRe[v]);

      let width = e.isHorizon ? 0.048 : Math.max(0.018, 0.040 - (e.depth - bulk.horizonDepth) * 0.0042);
      let intensity = 0.6;
      let flowSpeed = 0.0;
      let special = 0.0;

      if (this.viewMode === 'field') {
        phaseToRGB(phaseU, colA, 0);
        phaseToRGB(phaseV, colB, 0);
        const boostU = 0.34 + 0.85 * Math.pow(ampU, 0.55);
        const boostV = 0.34 + 0.85 * Math.pow(ampV, 0.55);
        colA[0] *= boostU; colA[1] *= boostU; colA[2] *= boostU;
        colB[0] *= boostV; colB[1] *= boostV; colB[2] *= boostV;
        if (e.isHorizon) {
          colA[0] = Math.min(1, colA[0] * 0.7 + 0.45);
          colA[1] = Math.min(1, colA[1] * 0.7 + 0.24);
          colB[0] = Math.min(1, colB[0] * 0.7 + 0.45);
          colB[1] = Math.min(1, colB[1] * 0.7 + 0.24);
          flowSpeed = Math.sign(bulk.horizonFlux || 1) * (0.7 + Math.abs(bulk.horizonFlux) * 0.75);
          intensity = 0.94;
        } else {
          const dPhase = Math.atan2(Math.sin(phaseV - phaseU), Math.cos(phaseV - phaseU));
          flowSpeed = dPhase * 0.55 * (0.45 + ampU + ampV);
          intensity = 0.34 + 0.64 * Math.max(ampU, ampV);
        }
        // Visibly brighten stretched/pinched wormhole edges even in field mode
        if (Math.abs(bulk.pinSigma[ei]) > 0.3) {
          colA[0] = 1.0; colA[1] = 0.32; colA[2] = 0.22;
          colB[0] = 1.0; colB[1] = 0.32; colB[2] = 0.22;
          width *= 1.5;
          intensity = 0.95;
          special = 0.6;
        }
      } else if (this.viewMode === 'ricci') {
        const dk = bulk.ricciCurvature[ei] - baseAdSKappa;
        ricciToRGB(dk, colA, 0);
        colB[0] = colA[0]; colB[1] = colA[1]; colB[2] = colA[2];
        intensity = 0.48 + Math.min(0.52, Math.abs(dk) * 0.95);
        width *= 1.0 + Math.min(0.8, Math.abs(dk) * 0.7);
        flowSpeed = dk * 0.6;
      } else if (this.viewMode === 'rt') {
        const isCut = bulk.rtCutEdges[ei] === 1;
        const inWedge = bulk.rtWedgeNodes[u] === 1 && bulk.rtWedgeNodes[v] === 1;
        if (isCut) {
          // Liquid gold Ryu-Takayanagi minimal cut surface gamma_A!
          colA[0] = 1.0; colA[1] = 0.80; colA[2] = 0.22;
          colB[0] = 1.0; colB[1] = 0.88; colB[2] = 0.38;
          width *= 2.1;
          intensity = 1.0;
          flowSpeed = 1.3;
          special = 1.0;
        } else if (inWedge) {
          colA[0] = 0.14; colA[1] = 0.84; colA[2] = 0.88;
          colB[0] = 0.18; colB[1] = 0.92; colB[2] = 0.94;
          intensity = 0.66;
          flowSpeed = 0.25;
        } else {
          colA[0] = 0.14; colA[1] = 0.19; colA[2] = 0.30;
          colB[0] = 0.14; colB[1] = 0.19; colB[2] = 0.30;
          intensity = 0.24;
        }
      } else {
        // 'gravity' — Dynamic edge-length strain sigma_e & bulk stress-energy T_e
        const totalSig = bulk.sigma[ei] + bulk.pinSigma[ei];
        const stressVis = Math.min(1.0, Math.sqrt(bulk.edgeStress[ei] * sim.space.N * 0.8));
        const t = Math.max(0, Math.min(1, Math.abs(totalSig) * 0.65 + stressVis * 0.45));
        if (totalSig >= 0) {
          colA[0] = 0.18 + 0.82 * t;
          colA[1] = 0.26 + 0.44 * t * (1 - 0.5 * t);
          colA[2] = 0.44 * (1 - t) + 0.12 * t;
        } else {
          colA[0] = 0.15;
          colA[1] = 0.52 + 0.45 * t;
          colA[2] = 0.72 + 0.28 * t;
        }
        colB[0] = colA[0]; colB[1] = colA[1]; colB[2] = colA[2];
        width *= 1.0 + t * 0.95;
        intensity = 0.32 + 0.68 * t;
        flowSpeed = totalSig * 0.9;
      }

      // Highlight Ultrametric Triangle geodesics when Triangle Prover mode is active
      if (triEdgeMask && triEdgeMask[ei]) {
        const mask = triEdgeMask[ei];
        colA[0] = mask & 1 ? 1.0 : 0.45;
        colA[1] = mask & 2 ? 0.95 : 0.78;
        colA[2] = mask & 4 ? 1.0 : 0.35;
        colB[0] = colA[0]; colB[1] = colA[1]; colB[2] = colA[2];
        width = Math.max(width * 1.9, 0.048);
        intensity = 1.0;
        special = 1.0;
      }

      // Highlight hovered edge
      if (ei === this.hoveredEdge) {
        colA[0] = 1.0; colA[1] = 0.96; colA[2] = 0.75;
        colB[0] = 1.0; colB[1] = 0.96; colB[2] = 0.75;
        width *= 1.85;
        intensity = 1.0;
        special = 1.0;
      }

      pushRibbon(ax, ay, az, bx, by, bz, colA[0], colA[1], colA[2], colB[0], colB[1], colB[2], width, intensity, flowSpeed, special);
      ribbonCount++;
    }

    // ---- Boundary Wave Spires rising off the Fractal Cantor Ring Z_p ----
    let maxProb = 1e-8;
    for (let l = 0; l < sim.space.N; l++) {
      const pr = quantum.leafRe[l] ** 2 + quantum.leafIm[l] ** 2;
      if (pr > maxProb) maxProb = pr;
    }
    const invMaxProb = 1.0 / maxProb;
    const pillarWidth = Math.max(0.011, 0.022 * Math.sqrt(243 / Math.max(243, sim.space.N)));

    for (let l = 0; l < sim.space.N; l++) {
      const v = bulk.leafNodes[l];
      const bx = pos[v * 3 + 0];
      const by = pos[v * 3 + 1];
      const bz = pos[v * 3 + 2];
      const prob = quantum.leafRe[l] ** 2 + quantum.leafIm[l] ** 2;
      const normP = prob * invMaxProb;
      const h = 0.03 + 0.82 * Math.pow(normP, 0.75);
      const phase = Math.atan2(quantum.leafIm[l], quantum.leafRe[l]);

      if (this.viewMode === 'rt') {
        const inA = bulk.rtRegionA[l] === 1;
        if (inA) {
          colA[0] = 0.14; colA[1] = 0.88; colA[2] = 0.92;
          colB[0] = 0.55; colB[1] = 0.98; colB[2] = 1.0;
        } else {
          colA[0] = 0.14; colA[1] = 0.20; colA[2] = 0.32;
          colB[0] = 0.22; colB[1] = 0.30; colB[2] = 0.44;
        }
        pushRibbon(bx, by, bz, bx, by + h * 0.65 + (inA ? 0.14 : 0.02), bz, colA[0], colA[1], colA[2], colB[0], colB[1], colB[2], pillarWidth * (inA ? 1.15 : 0.75), inA ? 0.72 : 0.24, 0.0, inA ? 0.2 : 0);
      } else {
        phaseToRGB(phase, colA, 0);
        // Preserve vivid phase chroma at spire tips instead of saturating to flat white
        colB[0] = Math.min(1, colA[0] * 1.08);
        colB[1] = Math.min(1, colA[1] * 1.08);
        colB[2] = Math.min(1, colA[2] * 1.08);
        const inten = 0.14 + 0.54 * Math.pow(normP, 0.55);
        pushRibbon(bx, by, bz, bx, by + h, bz, colA[0], colA[1], colA[2], colB[0], colB[1], colB[2], pillarWidth * (0.75 + 0.45 * normP), inten, 0.35, 0.0);
      }
      ribbonCount++;
    }

    // Draw all volumetric ribbons with additive-weighted luminance blending
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.useProgram(this.progEdge);
    gl.uniformMatrix4fv(this.uEdgeViewProj, false, this.viewProj);
    gl.uniform3fv(this.uEdgeCamPos, this.camPos);
    gl.uniform1f(this.uEdgeTime, timeSec);
    gl.bindVertexArray(this.edgeVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, edgeData.subarray(0, ribbonCount * 6 * 18), gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, ribbonCount * 6);

    // ---- Pass 5: Volumetric Bulk & Boundary Nodes ----
    const nodeData = this._nodeData;
    let nOff = 0;
    const triA = this.showTriangleOverlay && sim.triangleLeaves.length >= 3 ? bulk.leafNodes[sim.triangleLeaves[0]] : -1;
    const triB = this.showTriangleOverlay && sim.triangleLeaves.length >= 3 ? bulk.leafNodes[sim.triangleLeaves[1]] : -1;
    const triC = this.showTriangleOverlay && sim.triangleLeaves.length >= 3 ? bulk.leafNodes[sim.triangleLeaves[2]] : -1;
    const quadCorners = [
      [-1, -1], [1, -1], [1, 1],
      [-1, -1], [1, 1], [-1, 1],
    ];

    for (let u = 0; u < V; u++) {
      const px = pos[u * 3 + 0];
      const py = pos[u * 3 + 1];
      const pz = pos[u * 3 + 2];

      const amp = Math.min(1.0, Math.hypot(bulk.phiRe[u], bulk.phiIm[u]) * invMaxAmp * 1.35);
      const phase = Math.atan2(bulk.phiIm[u], bulk.phiRe[u]);
      const isLeaf = bulk.isLeaf[u] === 1;
      const isHor = bulk.isHorizon[u] === 1;

      let rad = isHor ? 0.115 : isLeaf ? 0.042 + 0.055 * amp : 0.058 + 0.068 * amp;
      let glow = 0.55 + 0.75 * amp;
      let ring = 0.0;

      if (this.viewMode === 'rt') {
        if (bulk.rtWedgeNodes[u]) {
          colA[0] = 0.2; colA[1] = 0.94; colA[2] = 0.96;
          glow = 0.9;
        } else {
          colA[0] = 0.18; colA[1] = 0.24; colA[2] = 0.36;
          glow = 0.32;
        }
        if (isHor && bulk.rtWedgeNodes[u]) {
          colA[0] = 1.0; colA[1] = 0.84; colA[2] = 0.28;
          rad *= 1.25;
        }
      } else if (this.viewMode === 'ricci') {
        const pe = bulk.parentEdge[u];
        const dk = pe >= 0 ? bulk.ricciCurvature[pe] - baseAdSKappa : 0;
        ricciToRGB(dk, colA, 0);
        glow = 0.75;
      } else if (this.viewMode === 'gravity') {
        const pe = bulk.parentEdge[u];
        const s = pe >= 0 ? Math.abs(bulk.sigma[pe] + bulk.pinSigma[pe]) : 0;
        const t = Math.min(1, s * 0.7);
        colA[0] = 0.25 + 0.75 * t;
        colA[1] = 0.38 + 0.35 * (1 - t);
        colA[2] = 0.55 * (1 - t) + 0.15 * t;
      } else {
        phaseToRGB(phase, colA, 0);
        if (isHor) {
          colA[0] = Math.min(1, colA[0] * 0.65 + 0.5);
          colA[1] = Math.min(1, colA[1] * 0.65 + 0.32);
          colA[2] = Math.min(1, colA[2] * 0.65 + 0.15);
          glow = 1.1;
        } else if (!isLeaf && u === 0 && !bulk.isBTZ) {
          // Pure AdS hyperbolic apex
          rad = 0.125 + 0.05 * amp;
          glow = 1.05;
        }
      }

      if (u === triA || u === triB || u === triC) {
        colA[0] = 1.0; colA[1] = 0.94; colA[2] = 0.55;
        rad = 0.145;
        glow = 1.3;
        ring = 1.0;
      }
      if (u === this.hoveredNode) {
        rad = Math.max(rad * 1.45, 0.14);
        glow = 1.4;
        ring = 1.0;
      }

      for (let k = 0; k < 6; k++) {
        nodeData[nOff++] = px; nodeData[nOff++] = py; nodeData[nOff++] = pz;
        nodeData[nOff++] = quadCorners[k][0]; nodeData[nOff++] = quadCorners[k][1];
        nodeData[nOff++] = colA[0]; nodeData[nOff++] = colA[1]; nodeData[nOff++] = colA[2]; nodeData[nOff++] = rad;
        nodeData[nOff++] = glow; nodeData[nOff++] = ring;
      }
    }

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.progNode);
    gl.uniformMatrix4fv(this.uNodeViewProj, false, this.viewProj);
    gl.uniform3fv(this.uNodeCamRight, this.camRight);
    gl.uniform3fv(this.uNodeCamUp, this.camUp);
    gl.bindVertexArray(this.nodeVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.nodeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, nodeData.subarray(0, V * 6 * 11), gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, V * 6);

    gl.depthMask(true);
    gl.bindVertexArray(null);
  }

  capturePNG(sim, timeSec) {
    if (!this.supported) return null;
    this.render(sim, timeSec);
    return this.canvas.toDataURL('image/png');
  }
}
