// Hintergrund auf der Grafikkarte: 32-Punkt-Raster und vier Sterne, jedes Bild neu
// in echten Punkten gezeichnet. So streckt sich beim Ändern der Fenstergröße nichts.
import { abs, cos, max, mix, picture, shader, size, smoothstep, sqrt, step, time, vec2, vec3, vec4 } from 'claude-code/shader'

// Deckkraft eines vierzackigen Sterns um `at`, Radius `r` in Punkten
function star(point: vec2, at: vec2, r: number, px: number, delay: number): number {
  const d = vec2(abs(point - at) / r)
  const edge = sqrt(d.x) + sqrt(d.y)
  const soft = 1.5 * px / r
  const shape = 1 - smoothstep(1 - soft, 1 + soft, edge)
  return shape * (0.75 + 0.25 * cos((time + delay) * 0.8976))
}

const sky = picture(p => {
  // y zählt von unten, das Raster beginnt oben links
  const at = vec2(p.point.x, size.y - p.point.y)
  const gx = at.x % 32
  const gy = at.y % 32
  const line = max(1 - step(1, gx), 1 - step(1, gy))
  let c = mix(vec3(0.0706, 0.0549, 0.1412), vec3(0.7255, 0.651, 1), line * 0.22)
  c = mix(c, vec3(1, 0.4784, 0.7843), star(at, vec2(size.x - 78, 86), 14, p.px, 0))
  c = mix(c, vec3(0.7765, 1, 0.2392), star(at, vec2(size.x - 38, 130), 8, p.px, 2))
  c = mix(c, vec3(0.4353, 0.9059, 1), star(at, vec2(39, 95), 11, p.px, 4))
  c = mix(c, vec3(1, 1, 1), star(at, vec2(size.x - 47, size.y - 221), 9, p.px, 1))
  return vec4(c, 1)
})

export default shader({ fps: 60, passes: [sky] })
