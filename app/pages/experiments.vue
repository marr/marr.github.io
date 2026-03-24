<script setup lang="ts">
const treeCanvas = ref<HTMLCanvasElement | null>(null);
const flowCanvas = ref<HTMLCanvasElement | null>(null);

useSeoMeta({
  title: "Experiments",
  description:
    "A collection of visual, generative experiments inspired by animated algorithmic sketches.",
});

const state = reactive({
  tree: {
    depth: 10,
    angleDeg: 27,
    sway: 0.65,
    growth: 0.78,
    speed: 1.1,
    running: true,
  },
  flow: {
    count: 220,
    turn: 0.22,
    speed: 0.95,
    trailAlpha: 0.08,
    running: true,
  },
});

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
};

const flowParticles = ref<Particle[]>([]);
let rafId: number | undefined;
let dpr = 1;
let width = 0;
let height = 0;
let startTime = 0;
let resizeObserver: ResizeObserver | undefined;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const resizeCanvas = (canvas: HTMLCanvasElement) => {
  const rect = canvas.getBoundingClientRect();
  width = Math.max(320, Math.floor(rect.width));
  height = Math.max(320, Math.floor(rect.height));
  dpr = clamp(window.devicePixelRatio || 1, 1, 2);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

const makeParticle = (): Particle => {
  const x = Math.random() * width;
  const y = Math.random() * height;
  const angle = Math.random() * Math.PI * 2;
  const speed = 0.25 + Math.random() * 0.9;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    hue: 180 + Math.random() * 140,
  };
};

const resetParticles = () => {
  flowParticles.value = Array.from({ length: state.flow.count }, makeParticle);
};

const renderFractalTree = (ctx: CanvasRenderingContext2D, time: number) => {
  if (!width || !height) return;
  const { depth, angleDeg, sway, growth } = state.tree;
  const baseLen = Math.min(width, height) * 0.2;
  const angle = (angleDeg * Math.PI) / 180;
  const wobble = Math.sin(time * state.tree.speed) * sway * 0.24;

  ctx.save();
  ctx.translate(width * 0.5, height * 0.94);
  ctx.lineCap = "round";

  const branch = (level: number, len: number) => {
    const t = level / Math.max(depth, 1);
    ctx.strokeStyle = `hsl(${110 - t * 70} 74% ${70 - t * 28}%)`;
    ctx.lineWidth = Math.max(1, (depth - level + 1) * 0.78);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();
    ctx.translate(0, -len);

    if (level >= depth) {
      ctx.fillStyle = "hsl(46 92% 64% / 0.9)";
      ctx.beginPath();
      ctx.arc(0, 0, 1.5 + Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    const nextLen = len * growth;
    ctx.save();
    ctx.rotate(angle + wobble);
    branch(level + 1, nextLen);
    ctx.restore();

    ctx.save();
    ctx.rotate(-angle + wobble * 0.85);
    branch(level + 1, nextLen);
    ctx.restore();
  };

  branch(0, baseLen);
  ctx.restore();
};

const renderFlowField = (ctx: CanvasRenderingContext2D, time: number) => {
  if (!width || !height) return;
  ctx.fillStyle = `hsl(222 28% 8% / ${state.flow.trailAlpha})`;
  ctx.fillRect(0, 0, width, height);

  const turn = state.flow.turn;
  const speedScale = state.flow.speed;

  for (const particle of flowParticles.value) {
    const prevX = particle.x;
    const prevY = particle.y;
    const n =
      Math.sin((particle.x * 0.012 + time * 0.7) * 1.7) +
      Math.cos((particle.y * 0.009 - time * 0.8) * 1.9);
    const theta = n * Math.PI * turn;
    particle.vx += Math.cos(theta) * 0.05 * speedScale;
    particle.vy += Math.sin(theta) * 0.05 * speedScale;
    particle.vx *= 0.985;
    particle.vy *= 0.985;
    particle.x += particle.vx * speedScale;
    particle.y += particle.vy * speedScale;

    if (particle.x < 0) particle.x += width;
    if (particle.x > width) particle.x -= width;
    if (particle.y < 0) particle.y += height;
    if (particle.y > height) particle.y -= height;

    ctx.strokeStyle = `hsl(${particle.hue + Math.sin(time + particle.x * 0.01) * 25} 95% 68% / 0.35)`;
    ctx.lineWidth = 1.05;
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(particle.x, particle.y);
    ctx.stroke();
  }
};

const renderFrame = (ms: number) => {
  if (!startTime) startTime = ms;
  const time = (ms - startTime) / 1000;

  const treeCtx = treeCanvas.value?.getContext("2d");
  if (treeCtx && state.tree.running) {
    treeCtx.clearRect(0, 0, width, height);
    treeCtx.fillStyle = "hsl(224 28% 11%)";
    treeCtx.fillRect(0, 0, width, height);
    renderFractalTree(treeCtx, time);
  }

  const flowCtx = flowCanvas.value?.getContext("2d");
  if (flowCtx && state.flow.running) {
    renderFlowField(flowCtx, time);
  }

  rafId = requestAnimationFrame(renderFrame);
};

const setupCanvases = () => {
  if (!treeCanvas.value || !flowCanvas.value) return;
  resizeCanvas(treeCanvas.value);
  resizeCanvas(flowCanvas.value);

  const flowCtx = flowCanvas.value.getContext("2d");
  if (flowCtx) {
    flowCtx.fillStyle = "hsl(222 28% 8%)";
    flowCtx.fillRect(0, 0, width, height);
  }

  resetParticles();
};

watch(
  () => state.flow.count,
  () => {
    resetParticles();
  },
);

onMounted(() => {
  setupCanvases();

  resizeObserver = new ResizeObserver(() => {
    setupCanvases();
  });

  if (treeCanvas.value) resizeObserver.observe(treeCanvas.value);
  if (flowCanvas.value) resizeObserver.observe(flowCanvas.value);

  rafId = requestAnimationFrame(renderFrame);
});

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
  resizeObserver?.disconnect();
});
</script>

<template>
  <div class="py-10 space-y-8">
    <section class="space-y-3">
      <p class="text-xs uppercase tracking-[0.2em] text-muted">Experiments</p>
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
        Generative visual playground
      </h1>
      <p class="text-muted max-w-2xl">
        A page inspired by animated Observable studies: tweak parameters and explore two
        algorithmic sketches in real time.
      </p>
    </section>

    <section class="grid gap-6">
      <UCard>
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 class="text-xl font-semibold">Animated fractal tree</h2>
              <p class="text-sm text-muted">
                Recursive branching with gentle temporal sway.
              </p>
            </div>
            <UButton
              :label="state.tree.running ? 'Pause' : 'Resume'"
              color="neutral"
              variant="outline"
              @click="state.tree.running = !state.tree.running"
            />
          </div>
        </template>

        <div class="space-y-4">
          <canvas
            ref="treeCanvas"
            class="w-full h-[360px] rounded-lg border border-default bg-black/20"
          />

          <div class="grid gap-4 md:grid-cols-2">
            <label class="space-y-1 text-sm">
              <div class="flex justify-between text-muted">
                <span>Depth</span><span>{{ state.tree.depth }}</span>
              </div>
              <input v-model.number="state.tree.depth" type="range" min="6" max="13" class="w-full" />
            </label>
            <label class="space-y-1 text-sm">
              <div class="flex justify-between text-muted">
                <span>Branch angle</span><span>{{ state.tree.angleDeg }}deg</span>
              </div>
              <input
                v-model.number="state.tree.angleDeg"
                type="range"
                min="12"
                max="40"
                class="w-full"
              />
            </label>
            <label class="space-y-1 text-sm">
              <div class="flex justify-between text-muted">
                <span>Growth ratio</span><span>{{ state.tree.growth.toFixed(2) }}</span>
              </div>
              <input
                v-model.number="state.tree.growth"
                type="range"
                min="0.65"
                max="0.86"
                step="0.01"
                class="w-full"
              />
            </label>
            <label class="space-y-1 text-sm">
              <div class="flex justify-between text-muted">
                <span>Sway speed</span><span>{{ state.tree.speed.toFixed(2) }}</span>
              </div>
              <input
                v-model.number="state.tree.speed"
                type="range"
                min="0.2"
                max="2.4"
                step="0.05"
                class="w-full"
              />
            </label>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 class="text-xl font-semibold">Nocturnal flow field</h2>
              <p class="text-sm text-muted">
                Particles trace an evolving vector field with glowing trails.
              </p>
            </div>
            <UButton
              :label="state.flow.running ? 'Pause' : 'Resume'"
              color="neutral"
              variant="outline"
              @click="state.flow.running = !state.flow.running"
            />
          </div>
        </template>

        <div class="space-y-4">
          <canvas
            ref="flowCanvas"
            class="w-full h-[360px] rounded-lg border border-default bg-black/20"
          />
          <div class="grid gap-4 md:grid-cols-2">
            <label class="space-y-1 text-sm">
              <div class="flex justify-between text-muted">
                <span>Particle count</span><span>{{ state.flow.count }}</span>
              </div>
              <input
                v-model.number="state.flow.count"
                type="range"
                min="80"
                max="500"
                step="10"
                class="w-full"
              />
            </label>
            <label class="space-y-1 text-sm">
              <div class="flex justify-between text-muted">
                <span>Turn strength</span><span>{{ state.flow.turn.toFixed(2) }}</span>
              </div>
              <input
                v-model.number="state.flow.turn"
                type="range"
                min="0.04"
                max="0.55"
                step="0.01"
                class="w-full"
              />
            </label>
            <label class="space-y-1 text-sm">
              <div class="flex justify-between text-muted">
                <span>Velocity</span><span>{{ state.flow.speed.toFixed(2) }}</span>
              </div>
              <input
                v-model.number="state.flow.speed"
                type="range"
                min="0.2"
                max="2.2"
                step="0.05"
                class="w-full"
              />
            </label>
            <label class="space-y-1 text-sm">
              <div class="flex justify-between text-muted">
                <span>Trail persistence</span><span>{{ state.flow.trailAlpha.toFixed(2) }}</span>
              </div>
              <input
                v-model.number="state.flow.trailAlpha"
                type="range"
                min="0.02"
                max="0.22"
                step="0.01"
                class="w-full"
              />
            </label>
          </div>
        </div>
      </UCard>
    </section>
  </div>
</template>
