<script setup lang="ts">
/**
 * Header-sized dithered logo — scales repulsion forces for small canvases.
 * Sizing follows the package (getBoundingClientRect); always repaints after
 * buffer changes so the canvas never stays blank after resize/HMR.
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
  style?: CSSProperties
  class?: string
}

const props = withDefaults(defineProps<SiteDitheredLogoProps>(), {
  ...DITHERED_LOGO_DEFAULTS,
  scale: 0.92,
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
  }

  return hasMotion || numRipples > 0 || cursorActive
}

const containerStyle = computed<CSSProperties>(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  ...props.style,
}))

function canvasMetrics(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  const cssW = rect.width
  const cssH = rect.height
  return { cssW, cssH, dpr }
}

/** Sync backing store to CSS size; returns null when layout not ready. */
function syncCanvasBuffer(canvas: HTMLCanvasElement) {
  const { cssW, cssH, dpr } = canvasMetrics(canvas)
  if (cssW < 1 || cssH < 1) return null
  const bufW = Math.round(cssW * dpr)
  const bufH = Math.round(cssH * dpr)
  if (canvas.width !== bufW || canvas.height !== bufH) {
    canvas.width = bufW
    canvas.height = bufH
  }
  return { cssW, cssH, dpr }
}

const canvasStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  height: '100%',
  touchAction: 'none',
  cursor: 'default',
}

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
  ]),
)

function paintFrame(): boolean {
  const canvas = canvasRef.value
  if (!canvas) return false

  const ctx = canvas.getContext('2d')
  const sys = systemRef.value
  if (!ctx || !sys) return false

  const size = syncCanvasBuffer(canvas)
  if (!size) return false

  const { cssW, cssH, dpr } = size
  drawParticles(ctx, sys, props.invert, cssW, cssH, dpr)
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

    const size = syncCanvasBuffer(canvas)
    if (!size) {
      running = false
      requestAnimationFrame(() => startLoop())
      return
    }

    const { cssW, cssH, dpr } = size
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
    drawParticles(ctx, sys, props.invert, cssW, cssH, dpr)

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
    const size = syncCanvasBuffer(canvas)
    if (!size) {
      if (attempt < 12) {
        requestAnimationFrame(() => void rebuild(src, attempt + 1))
      }
      return
    }
    const { cssW, cssH } = size

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
      positions = applyMaskInversion(
        positions,
        gw,
        gh,
        props.cornerRadius,
        processed.alpha,
      )
    }

    const k = interactionScale(cssW, cssH)
    const margin = 18 * k + 1
    const availW = Math.max(1, cssW - margin * 2)
    const availH = Math.max(1, cssH - margin * 2)
    const s = Math.min(
      (availW * props.scale) / gw,
      (availH * props.scale) / gh,
    )
    const ox = (cssW - gw * s) / 2
    const oy = (cssH - gh * s) / 2

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

    const { cssW, cssH } = canvasMetrics(canvas)
    const w = Math.round(cssW)
    const h = Math.round(cssH)
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
    <canvas ref="canvasRef" :style="canvasStyle" />
  </div>
</template>
