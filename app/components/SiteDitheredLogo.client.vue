<script setup lang="ts">
/**
 * Dithered logo — negative-space invert (dots on field, letters punched out).
 */
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  shallowRef,
  watch,
  type CSSProperties,
} from 'vue'
import {
  applyMaskInversion,
  DITHERED_LOGO_DEFAULTS,
  drawParticles,
  errorDiffusionDither,
  fetchImage,
  initParticles,
  toGrayscaleGrid,
  type ParticleSystem,
  type Ripple,
} from 'dithered-logo-vue/src/lib/ditheredLogoCore'

export interface SiteDitheredLogoProps {
  imageSrc: string
  gridSize?: number
  scale?: number
  dotScale?: number
  invert?: boolean
  cornerRadius?: number
  threshold?: number
  contrast?: number
  gamma?: number
  blur?: number
  diffusionStrength?: number
  serpentine?: boolean
  dotRgb?: [number, number, number]
  canvasOpacity?: number
  contentInset?: number
  /** Extra layout inset so hover ripples are not clipped at edges. Auto-scaled when omitted. */
  interactionInset?: number
  /**
   * In invert mode: cells with luma >= this stay negative space (letter cutout).
   * Stops dither dots bleeding into antialiased letter edges.
   */
  letterLumaMin?: number
  style?: CSSProperties
  class?: string
}

const props = withDefaults(defineProps<SiteDitheredLogoProps>(), {
  ...DITHERED_LOGO_DEFAULTS,
  invert: true,
  scale: 1,
  blur: 0,
  contrast: 42,
  letterLumaMin: 150,
  diffusionStrength: 0.75,
  contentInset: 0,
})

const rootRef = shallowRef<HTMLElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const systemRef = shallowRef<ParticleSystem | null>(null)

const cursor = { x: 0, y: 0, active: false }
const ripples: Ripple[] = []
let animFrame = 0
let running = false
let prevConfigKey = ''
let resizeTimer: ReturnType<typeof setTimeout> | null = null
let lastW = 0
let lastH = 0
let teardownCanvas: (() => void) | null = null
let teardownVisible: (() => void) | null = null

function interactionScale(width: number, height: number) {
  return Math.min(width, height) / 200
}

function buildRoundedMask(w: number, h: number, radiusPct: number): Set<number> {
  const r = Math.round(radiusPct * Math.min(w, h))
  const mask = new Set<number>()

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let inside = false
      if (x >= r && x < w - r) {
        inside = true
      } else if (y >= r && y < h - r) {
        inside = true
      } else {
        const cx = x < r ? r : w - r - 1
        const cy = y < r ? r : h - r - 1
        const dx = x - cx
        const dy = y - cy
        inside = dx * dx + dy * dy <= r * r
      }
      if (inside) mask.add(y * w + x)
    }
  }

  return mask
}

/** Invert mask but punch out letter cells by luma cutoff. */
function applyLetterAwareMaskInversion(
  positions: Float32Array,
  gridW: number,
  gridH: number,
  radiusPct: number,
  alpha: Uint8Array,
  grayscale: Uint8Array,
  letterLumaMin: number,
): Float32Array {
  const mask = buildRoundedMask(gridW, gridH, radiusPct)
  const filled = new Set<number>()
  for (let i = 0; i < positions.length; i += 2) {
    filled.add(Math.round(positions[i + 1]) * gridW + Math.round(positions[i]))
  }

  const result: number[] = []
  for (const idx of mask) {
    if (filled.has(idx)) continue
    if (alpha[idx] < 128) continue
    if (grayscale[idx] >= letterLumaMin) continue
    result.push(idx % gridW, Math.floor(idx / gridW))
  }

  return new Float32Array(result)
}

function gridLayout(cssW: number, cssH: number, gw: number, gh: number) {
  const k = interactionScale(cssW, cssH)
  const ripplePad = props.interactionInset ?? Math.ceil(10 * k + 4)
  const inset = (props.contentInset ?? 0) + ripplePad
  const availW = Math.max(1, cssW - inset * 2)
  const availH = Math.max(1, cssH - inset * 2)
  const s = Math.min(
    (availW * props.scale) / gw,
    (availH * props.scale) / gh,
  )
  return {
    s,
    ox: (cssW - gw * s) / 2,
    oy: (cssH - gh * s) / 2,
  }
}

function stepParticlesScaled(
  sys: ParticleSystem,
  cursorX: number,
  cursorY: number,
  cursorActive: boolean,
  rippleList: Ripple[],
  now: number,
  canvasW: number,
  canvasH: number,
) {
  const k = interactionScale(canvasW, canvasH)
  const cursorRadiusSq = (100 * k) ** 2
  const cursorRadius = 100 * k
  const cursorForce = 40 * k
  const rippleSpeed = 225 * k
  const rippleWidth = 37 * k
  const rippleForce = 20 * k
  const rippleDuration = 675

  const { count, baseX, baseY, offsetX, offsetY } = sys

  for (let i = rippleList.length - 1; i >= 0; i--) {
    if (now - rippleList[i].start >= rippleDuration) rippleList.splice(i, 1)
  }

  const numRipples = rippleList.length
  const rippleMul = numRipples > 0 ? 1 + 0.5 * (numRipples - 1) : 0
  let hasMotion = false

  for (let i = 0; i < count; i++) {
    let fx = 0
    let fy = 0

    if (cursorActive) {
      const vx = baseX[i] + offsetX[i] - cursorX
      const vy = baseY[i] + offsetY[i] - cursorY
      const d2 = vx * vx + vy * vy
      if (d2 > 0.1 && d2 < cursorRadiusSq) {
        const d = Math.sqrt(d2)
        const f = (1 - d / cursorRadius) ** 3 * cursorForce
        fx += (vx / d) * f
        fy += (vy / d) * f
      }
    }

    for (let r = 0; r < numRipples; r++) {
      const rp = rippleList[r]
      const elapsed = now - rp.start
      const radius = (elapsed / 1000) * rippleSpeed
      const life = 1 - elapsed / rippleDuration
      const sx = baseX[i] - rp.x
      const sy = baseY[i] - rp.y
      const d = Math.sqrt(sx * sx + sy * sy)
      if (d < 0.1) continue
      const band = Math.abs(d - radius)
      if (band < rippleWidth) {
        const wf = (1 - band / rippleWidth) * life * rippleForce * rippleMul
        fx += (sx / d) * wf
        fy += (sy / d) * wf
      }
    }

    offsetX[i] += (fx - offsetX[i]) * 0.12
    offsetY[i] += (fy - offsetY[i]) * 0.12
    if (Math.abs(offsetX[i]) < 0.01) offsetX[i] = 0
    if (Math.abs(offsetY[i]) < 0.01) offsetY[i] = 0
    if (offsetX[i] !== 0 || offsetY[i] !== 0) hasMotion = true

    const margin = sys.size * 1.1
    const px = baseX[i] + offsetX[i]
    const py = baseY[i] + offsetY[i]
    if (px < margin) offsetX[i] = margin - baseX[i]
    else if (px > canvasW - margin) offsetX[i] = canvasW - margin - baseX[i]
    if (py < margin) offsetY[i] = margin - baseY[i]
    else if (py > canvasH - margin) offsetY[i] = canvasH - margin - baseY[i]
  }

  return hasMotion || numRipples > 0 || cursorActive
}

const containerStyle = computed<CSSProperties>(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  ...props.style,
}))

const canvasStyle = computed<CSSProperties>(() => ({
  display: 'block',
  width: '100%',
  height: '100%',
  touchAction: 'none',
  cursor: 'default',
  opacity: props.canvasOpacity ?? 1,
}))

const configKey = computed(() =>
  JSON.stringify([
    props.imageSrc,
    props.gridSize,
    props.scale,
    props.dotScale,
    props.invert,
    props.cornerRadius,
    props.threshold,
    props.contrast,
    props.gamma,
    props.blur,
    props.diffusionStrength,
    props.serpentine,
    props.dotRgb,
    props.canvasOpacity,
    props.contentInset,
    props.interactionInset,
    props.letterLumaMin,
  ]),
)

function drawParticlesWithRgb(
  ctx: CanvasRenderingContext2D,
  sys: ParticleSystem,
  canvasW: number,
  canvasH: number,
  dpr: number,
  rgb: [number, number, number],
) {
  ctx.clearRect(0, 0, canvasW * dpr, canvasH * dpr)

  const buckets: number[][] = new Array(126)
  for (let i = 0; i < 126; i++) buckets[i] = []

  for (let i = 0; i < sys.count; i++) {
    const bucket =
      6 * Math.round(20 * sys.brightness[i]) + Math.round(5 * sys.tint[i])
    buckets[Math.max(0, Math.min(125, bucket))].push(i)
  }

  const [r, g, b] = rgb
  const size = sys.size * dpr
  const pad = 0.25 * dpr
  const padSize = 0.5 * dpr

  for (let z = 0; z < 126; z++) {
    const ids = buckets[z]
    if (ids.length === 0) continue
    const alpha = Math.floor(z / 6) / 20
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
    for (let j = 0; j < ids.length; j++) {
      const i = ids[j]
      const rx = (sys.baseX[i] + sys.offsetX[i]) * dpr
      const ry = (sys.baseY[i] + sys.offsetY[i]) * dpr
      ctx.fillRect(rx - pad, ry - pad, size + padSize, size + padSize)
    }
  }
}

function renderFrame(
  ctx: CanvasRenderingContext2D,
  sys: ParticleSystem,
  cssW: number,
  cssH: number,
  dpr: number,
) {
  if (props.dotRgb) {
    drawParticlesWithRgb(ctx, sys, cssW, cssH, dpr, props.dotRgb)
    return
  }
  drawParticles(ctx, sys, props.invert, cssW, cssH, dpr)
}

function paintFrame(): boolean {
  const canvas = canvasRef.value
  const sys = systemRef.value
  if (!canvas || !sys) return false

  const ctx = canvas.getContext('2d')
  if (!ctx) return false

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  const cssW = rect.width
  const cssH = rect.height
  if (cssW < 1 || cssH < 1) return false

  const bufW = Math.round(cssW * dpr)
  const bufH = Math.round(cssH * dpr)
  if (canvas.width !== bufW || canvas.height !== bufH) {
    canvas.width = bufW
    canvas.height = bufH
  }

  renderFrame(ctx, sys, cssW, cssH, dpr)
  return true
}

function startLoop() {
  if (running) return
  running = true

  const canvas = canvasRef.value
  if (!canvas) {
    running = false
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    running = false
    return
  }

  const tick = () => {
    const sys = systemRef.value
    if (!sys) {
      running = false
      return
    }

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const cssW = rect.width
    const cssH = rect.height
    if (cssW < 1 || cssH < 1) {
      running = false
      requestAnimationFrame(() => startLoop())
      return
    }

    const needsMore = stepParticlesScaled(
      sys,
      cursor.x,
      cursor.y,
      cursor.active,
      ripples,
      performance.now(),
      cssW,
      cssH,
    )
    renderFrame(ctx, sys, cssW, cssH, dpr)

    if (needsMore) animFrame = requestAnimationFrame(tick)
    else running = false
  }

  animFrame = requestAnimationFrame(tick)
}

async function rebuild(src: string, attempt = 0) {
  const canvas = canvasRef.value
  if (!canvas || !src) return

  try {
    const img = await fetchImage(src)
    const rect = canvas.getBoundingClientRect()
    const cssW = rect.width
    const cssH = rect.height
    if (cssW < 1 || cssH < 1) {
      if (attempt < 12) requestAnimationFrame(() => void rebuild(src, attempt + 1))
      return
    }

    const processed = toGrayscaleGrid(
      img,
      props.gridSize,
      props.contrast,
      props.gamma,
      props.blur,
    )
    const { width: gw, height: gh } = processed

    let positions = errorDiffusionDither(
      processed.grayscale,
      gw,
      gh,
      {
        threshold: props.threshold,
        serpentine: props.serpentine,
        diffusionStrength: props.diffusionStrength,
      },
      processed.alpha,
    )

    if (props.invert) {
      if (props.letterLumaMin != null) {
        positions = applyLetterAwareMaskInversion(
          positions,
          gw,
          gh,
          props.cornerRadius,
          processed.alpha,
          processed.grayscale,
          props.letterLumaMin,
        )
      } else {
        positions = applyMaskInversion(
          positions,
          gw,
          gh,
          props.cornerRadius,
          processed.alpha,
        )
      }
    }

    const { s, ox, oy } = gridLayout(cssW, cssH, gw, gh)
    systemRef.value = initParticles(positions, s, props.dotScale, ox, oy)
    paintFrame()
    startLoop()
  } catch (err) {
    console.error('SiteDitheredLogo: failed to process image', err)
  }
}

function setupCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return () => {}

  const handleResize = () => {
    paintFrame()
    const rect = canvas.getBoundingClientRect()
    const w = Math.round(rect.width)
    const h = Math.round(rect.height)
    if (w < 1 || h < 1) return
    if (lastW !== 0 && (w !== lastW || h !== lastH)) {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => void rebuild(props.imageSrc), 200)
    }
    lastW = w
    lastH = h
  }

  handleResize()
  const ro = new ResizeObserver(handleResize)
  ro.observe(canvas)

  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    cursor.x = e.clientX - rect.left
    cursor.y = e.clientY - rect.top
    cursor.active = true
    startLoop()
  }
  const onPointerLeave = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    cursor.active = false
    startLoop()
  }
  const onPointerCancel = () => {
    cursor.active = false
    startLoop()
  }
  const onPointerUp = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    ripples.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      start: performance.now(),
    })
    if (e.pointerType !== 'mouse') cursor.active = false
    startLoop()
  }

  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerleave', onPointerLeave)
  canvas.addEventListener('pointercancel', onPointerCancel)
  canvas.addEventListener('pointerup', onPointerUp)

  return () => {
    cancelAnimationFrame(animFrame)
    running = false
    if (resizeTimer) clearTimeout(resizeTimer)
    ro.disconnect()
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerleave', onPointerLeave)
    canvas.removeEventListener('pointercancel', onPointerCancel)
    canvas.removeEventListener('pointerup', onPointerUp)
  }
}

function setupVisibility() {
  const root = rootRef.value
  if (!root || typeof IntersectionObserver === 'undefined') return () => {}

  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      if (!systemRef.value) void rebuild(props.imageSrc)
      else paintFrame()
    },
    { threshold: 0 },
  )
  io.observe(root)
  return () => io.disconnect()
}

function mount() {
  teardownCanvas?.()
  teardownVisible?.()
  teardownCanvas = setupCanvas()
  teardownVisible = setupVisibility()
  prevConfigKey = configKey.value
  void rebuild(props.imageSrc)
}

watch(configKey, (key) => {
  if (key === prevConfigKey) return
  prevConfigKey = key
  void rebuild(props.imageSrc)
})

onMounted(async () => {
  await nextTick()
  mount()
})

onUnmounted(() => {
  teardownCanvas?.()
  teardownVisible?.()
  cancelAnimationFrame(animFrame)
  running = false
})

defineExpose({ rebuild: () => rebuild(props.imageSrc), paintFrame })
</script>

<template>
  <div ref="rootRef" :class="props.class" :style="containerStyle">
    <canvas ref="canvasRef" :style="canvasStyle" aria-hidden="true" />
  </div>
</template>
