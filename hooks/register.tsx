import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// ── Palette ────────────────────────────────────────────────────────────────
const MIDNIGHT = '#1B1530'
const ICE = '#F4F1FF'
const BUBBLEGUM = '#FF7AC8'
const AQUA = '#6FE7FF'
const LIME = '#C6FF3D'
const LILAC = '#B9A6FF'
const NIGHT = '#120E24'

// ── Farben der App, fest im Nacht-Modus (die helle Palette bleibt ungenutzt) ────────────────────────────
const { theme, problems } = makeColors({
  label: 'Daydreams Night',
  roles: { accent: BUBBLEGUM, danger: '#E0245E', success: '#6CC21F', warning: '#E0A100', pro: '#8F7BFF' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#EDE8FF',
        'surface-1': ICE,
        'surface-2': '#FBFAFF',
        'text-primary': MIDNIGHT,
        'text-secondary': '#3A3158',
        'text-muted': '#564D78',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': NIGHT,
        'surface-1': '#1B1530',
        'surface-2': '#201B33',
        'surface-3': '#231F33',
        'text-primary': ICE,
        'text-secondary': '#D8D3EC',
        'text-muted': '#C4BEDD',
      },
    },
  },
})

const BASE: ThemeSetArgs = {
  colors: theme,
  // Fast klares Glas, damit Raster und Sterne durchscheinen
  backdrop: { scene: 'y2k-grid', glass: { blur: 0, tint: NIGHT, opacity: 0.25 } },
  overrideColorScheme: 'dark',
}

// Werte aus dem Moodboard (Tafel Chat, Nacht). Die Flächen sind deckend,
// damit der Text über dem Raster lesbar bleibt.
const LOOK: ThemeSetArgs = {
  ...BASE,
  style: {
    Heading: { fontWeight: 'bold', letterSpacing: 0.4 },
    UserMessage: {
      color: MIDNIGHT,
      backgroundColor: BUBBLEGUM,
      borderColor: MIDNIGHT,
      borderWidth: 1.5,
      radius: [22, 22, 6, 22],
      paddingX: 18,
      paddingY: 12,
    },
    AssistantMessage: {
      color: ICE,
      backgroundColor: '#231F33',
      borderColor: '#383547',
      borderWidth: 1,
      radius: [6, 22, 22, 22],
      paddingX: 20,
      paddingY: 14,
      shadow: { y: 6, blur: 16, color: '#00000059' },
    },
    ToolUse: { color: '#C4BEDD', backgroundColor: '#1B1530', borderColor: '#383547', borderWidth: 1, radius: 14, paddingX: 10 },
  },
}

// ── Deko: 4-zackiger Stern ─────────────────────────────────────────────────
// Pfad aus dem Moodboard, 24×24
const STAR = 'M12 0C13 7 17 11 24 12C17 13 13 17 12 24C11 17 7 13 0 12C7 11 11 7 12 0Z'

// ── Hintergrund: 32-px-Lila-Raster, ein paar Sterne am Rand ───────────────
// Abstand zum Rand, damit die Sterne auch in schmalen und flachen Fenstern sichtbar bleiben.
const W = 1600
const H = 1000
const stars = [
  { x: 1330, y: 150, size: 28, c: BUBBLEGUM, d: 0 },
  { x: 1385, y: 205, size: 16, c: LIME, d: 2 },
  { x: 190, y: 165, size: 22, c: AQUA, d: 4 },
  { x: 1375, y: 760, size: 18, c: '#FFFFFF', d: 1 },
]

const gridLines = (end: number, line: (n: number) => string) =>
  Array.from({ length: Math.floor(end / 32) + 1 }, (_, i) => line(i * 32)).join('')
const GRID = gridLines(W, x => `M${x} 0V${H}`) + gridLines(H, y => `M0 ${y}H${W}`)

// Ersatz, wo der Shader (backdrop.ts) nicht läuft. Feste Zeichenfläche mit slice: wächst beim Ändern der Fenstergröße stufenlos mit.
const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<style>
.st{animation:tw 7s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:1}50%{opacity:.5}}
</style>
<rect width="${W}" height="${H}" fill="${NIGHT}"/>
<path d="${GRID}" fill="none" stroke="${LILAC}" stroke-opacity=".22" stroke-width="1" vector-effect="non-scaling-stroke"/>
${stars.map(s => `<g transform="translate(${s.x} ${s.y}) scale(${s.size / 24})"><path class="st" style="animation-delay:-${s.d}s" fill="${s.c}" d="${STAR}"/></g>`).join('')}
</svg>`

// ── Pixel-Schrift (3×5) für Labels und Status ─────────────────────────────
const FONT: Record<string, string> = {
  A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110',
  E: '111100110100111', G: '011100101101011', H: '101101111101101', I: '111010010010111',
  K: '101101110101101', L: '100100100100111', M: '10001|11011|10101|10001|10001', N: '1001|1101|1011|1001|1001',
  O: '010101101101010', P: '110101110100100', R: '110101110101101', S: '011100010001110',
  T: '111010010010010', U: '101101101101111', W: '10001|10001|10101|11011|10001', X: '101101010101101',
  Y: '101101010010010', '.': '000000000000010', ' ': '000000000000000',
}

const glyph = (ch: string): string[] => {
  const g = FONT[ch] ?? '000000000000000'
  return g.includes('|') ? g.split('|') : [0, 1, 2, 3, 4].map(r => g.slice(r * 3, r * 3 + 3))
}

const pixelPath = (text: string, x: number, y: number, px: number) => {
  let d = ''
  let cx = x
  for (const ch of text.toUpperCase()) {
    const rows = glyph(ch)
    rows.forEach((row, r) => {
      ;[...row].forEach((bit, c) => {
        if (bit === '1') {
          d += `M${cx + c * px} ${y + r * px}h${px}v${px}h-${px}z`
        }
      })
    })
    cx += ((rows[0] ?? '').length + 1) * px
  }
  return d
}
const pixelWidth = (text: string, px: number) =>
  [...text.toUpperCase()].reduce((w, ch) => w + ((glyph(ch)[0] ?? '').length + 1) * px, 0) - px

// ── Pixel-Ladebalken ──────────────────────────────────────────────────────
const CELLS = 12
// Leere Kästchen: alle gleich, Lilac mit 18 % auf Night
const CELL_OFF = '#302A4B'
const CELL_COLORS = [LIME, AQUA, LILAC, BUBBLEGUM]
const LABELS: Record<string, string> = {
  thinking: 'THINKING', requesting: 'SENDING', responding: 'WRITING', 'tool-use': 'WORKING', 'tool-input': 'WORKING',
}

const loader = (label: string) => {
  const cell = 10
  const gap = 3
  const barW = CELLS * (cell + gap) + gap
  const w = barW + 14 + pixelWidth(label, 2)
  const cells = Array.from({ length: CELLS }, (_, i) =>
    `<rect class="c" style="animation-delay:${(i * 0.12).toFixed(2)}s" x="${gap + i * (cell + gap) + 2}" y="5" width="${cell}" height="${cell}" fill="${CELL_COLORS[Math.floor((i * CELL_COLORS.length) / CELLS)]}"/>`,
  ).join('')
  const off = Array.from({ length: CELLS }, (_, i) =>
    `<rect x="${gap + i * (cell + gap) + 2}" y="5" width="${cell}" height="${cell}" fill="${CELL_OFF}"/>`,
  ).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="24" viewBox="0 0 ${w} 24">
<style>
.c{opacity:0;animation:on 1.8s steps(1,end) infinite}
@keyframes on{0%{opacity:0}8%{opacity:1}70%{opacity:1}100%{opacity:0}}
@media (prefers-reduced-motion: reduce){.c{animation:none;opacity:1}}
</style>
<rect x="1" y="2" width="${barW + 2}" height="16" fill="none" stroke="${ICE}" stroke-width="1.5"/>
${off}
${cells}
<path fill="${ICE}" d="${pixelPath(label, barW + 14, 5, 2)}"/>
</svg>`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    let set
    try {
      set = await $.theme.set(LOOK)
    } catch (error) {
      // Ältere Versionen kennen style noch nicht
      $.ui.log(String(error))
      set = await $.theme.set(BASE)
    }
    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }
    return next(e)
  })

  // Hintergrund
  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Shader, Svg } = $.ui.resolve(e)
    return (
      <Shader module="./backdrop.ts">
        <Svg source={SCENE} alt="Fine lilac grid with a few stars" />
      </Shader>
    )
  })

  // Pixel-Ladebalken beim Nachdenken
  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    if (e.surface !== 'desktop') {
      return next(e)
    }
    const { Box, Svg, Text } = $.ui.resolve(e)
    const label = LABELS[e.props.mode] ?? 'THINKING'
    return (
      <Box flexDirection="row" gap="sm" alignItems="center">
        <Svg source={loader(label)} alt={`Loading: ${label.toLowerCase()}`} isInteractive />
        {e.props.message !== null && <Text dimColor>{e.props.message}</Text>}
      </Box>
    )
  })
}
