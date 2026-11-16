// Hero background: slow night clouds drawn in WebGL.
// The fragment shader is the cloud shader from Aceternity UI (the React component Cyrill supplied), ported to plain JS
// and given dark colours. Without WebGL the hero keeps its CSS gradient.
(() => {
  const canvas = document.querySelector('.hero-clouds');
  const gl = canvas?.getContext('webgl', { alpha: false, antialias: false });
  if (!gl) return;

  const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }`;

  // Each cloud is a dome-topped envelope filled with domain-warped billow noise; a second sample above the pixel fakes self-shadowing.
  const FRAG = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_cloud;
uniform vec3 u_skyTop;
uniform vec3 u_skyBottom;
const mat2 R = mat2(0.80, 0.60, -0.60, 0.80);

float hash(vec2 p) { return fract(sin(dot(p, vec2(41.31, 289.17))) * 26737.367); }
float vnoise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float sum = 0.0; float amp = 0.5;
  for (int i = 0; i < 4; i++) { sum += amp * vnoise(p); p = R * p * 2.03 + 19.19; amp *= 0.5; }
  return sum;
}
float billow(vec2 p) {
  float sum = 0.0; float amp = 0.5;
  for (int i = 0; i < 5; i++) { sum += amp * (1.0 - abs(2.0 * vnoise(p) - 1.0)); p = R * p * 2.11 + 13.37; amp *= 0.5; }
  return sum;
}
float cloudDensity(vec2 p, vec2 c, vec2 r, float seed, float t) {
  vec2 q = p - c;
  float ry = q.y > 0.0 ? r.y : r.y * 0.42;
  float env = 1.0 - length(vec2(q.x / r.x, q.y / ry));
  if (env < -0.35) return 0.0;
  vec2 dp = q * (2.4 / r.x) + seed;
  dp += 0.6 * vec2(fbm(dp * 1.4 + t * 0.04), fbm(dp * 1.4 + 7.7 - t * 0.03));
  return env + (billow(dp * 1.6) - 0.62) * 0.62;
}
vec3 shadeCloud(vec3 color, vec3 sky, vec2 p, vec2 c, vec2 r, float seed, float t, float dist) {
  float d = cloudDensity(p, c, r, seed, t);
  if (d < 0.02) return color;
  float dUp = cloudDensity(p + vec2(0.0, r.y * 0.55), c, r, seed, t);
  float occl = clamp((dUp - d) * 1.1 + d * 0.55, 0.0, 1.0);
  vec3 cloudCol = mix(u_cloud * 1.04, mix(u_cloud * 0.60, sky, 0.38), occl * 0.85);
  float alpha = smoothstep(0.02, 0.38, d);
  float rim = smoothstep(0.02, 0.14, d) * (1.0 - smoothstep(0.14, 0.40, d));
  cloudCol += rim * 0.05;
  cloudCol = mix(cloudCol, sky, dist * 0.35);
  alpha *= mix(1.0, 0.8, dist);
  return mix(color, cloudCol, alpha);
}
vec3 cloudPass(vec3 color, vec3 sky, vec2 p, float aspect, float t, float spd, float phase, float y, vec2 r, float seed, float dist) {
  float cx = mix(-r.x - 0.25, aspect + r.x + 0.25, fract(t * spd + phase));
  float cy = y + sin(t * 0.05 + phase * 6.2831) * 0.012;
  return shadeCloud(color, sky, p, vec2(cx, cy), r, seed, t, dist);
}
void main() {
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(v_uv.x * aspect, v_uv.y);
  float t = u_time;
  vec3 sky = mix(u_skyBottom, u_skyTop, v_uv.y);
  vec3 color = sky;
  // a pale moon glow, upper right
  float moon = length(p - vec2(aspect * 0.78, 0.92));
  color += vec3(1.0, 0.9, 0.0) * exp(-moon * moon * 5.0) * 0.07;
  color = cloudPass(color, sky, p, aspect, t, 0.006, 0.10, 0.84, vec2(0.20, 0.10), 43.7, 1.0);
  color = cloudPass(color, sky, p, aspect, t, 0.008, 0.62, 0.73, vec2(0.24, 0.12), 71.3, 0.85);
  color = cloudPass(color, sky, p, aspect, t, 0.011, 0.33, 0.60, vec2(0.34, 0.16), 17.3, 0.55);
  color = cloudPass(color, sky, p, aspect, t, 0.013, 0.80, 0.47, vec2(0.30, 0.15), 29.9, 0.45);
  color = cloudPass(color, sky, p, aspect, t, 0.016, 0.05, 0.35, vec2(0.46, 0.20), 91.1, 0.15);
  color = cloudPass(color, sky, p, aspect, t, 0.020, 0.48, 0.20, vec2(0.56, 0.24), 57.2, 0.0);
  gl_FragColor = vec4(color, 1.0);
}`;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vert = compile(gl.VERTEX_SHADER, VERT);
  const frag = compile(gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vert || !frag) return;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.bindAttribLocation(program, 0, 'a_pos');
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const u = (n) => gl.getUniformLocation(program, n);
  gl.uniform3f(u('u_cloud'), 0.29, 0.30, 0.31);
  gl.uniform3f(u('u_skyTop'), 0.024, 0.02, 0.027);
  gl.uniform3f(u('u_skyBottom'), 0.07, 0.072, 0.078);
  const uRes = u('u_res');
  const uTime = u('u_time');

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // start partway in, so the clouds are already spread across the sky on the first frame
  const draw = (now) => {
    // half resolution: the clouds are soft, and the shader is heavy per pixel
    const w = Math.max(1, Math.floor(canvas.clientWidth / 2));
    const h = Math.max(1, Math.floor(canvas.clientHeight / 2));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); gl.uniform2f(uRes, w, h); }
    gl.uniform1f(uTime, 40 + (still ? 0 : now / 1000));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  canvas.classList.add('on');
  let frame = 0;
  let visible = true;
  const loop = (now) => { draw(now); frame = visible && !still ? requestAnimationFrame(loop) : 0; };
  // only animate while the hero is on screen
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !frame) frame = requestAnimationFrame(loop); }).observe(canvas);
  addEventListener('resize', () => { if (!frame) draw(performance.now()); });
  draw(0);
})();
