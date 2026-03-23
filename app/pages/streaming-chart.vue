<script setup lang="ts">
import { html, reactive } from "@arrow-js/core";

useSeoMeta({
  title: "Arrow.js Streaming Chart Demo",
  description:
    "Client-only streaming chart demo using Arrow.js reactivity in a Nuxt 4 + Nuxt UI app.",
});

const mountEl = ref<HTMLElement | null>(null);

const viewport = {
  width: 760,
  height: 280,
  padding: 24,
} as const;

const state = reactive({
  running: true,
  samples: 120,
  tickMs: 120,
  points: [] as number[],
  phase: 0,
  baseline: 52,
  amplitude: 24,
  noise: 8,
  ticks: 0,
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const nextSignalValue = () => {
  const wobble = Math.sin(state.phase / 8) * state.amplitude;
  const noise = (Math.random() - 0.5) * state.noise;
  state.phase += 1;
  return clamp(state.baseline + wobble + noise, 0, 100);
};

const pushSample = () => {
  const value = nextSignalValue();
  const nextPoints = [...state.points, value];
  state.points = nextPoints.slice(-state.samples);
  state.ticks += 1;
};

const xForIndex = (index: number, total: number) => {
  const drawableWidth = viewport.width - viewport.padding * 2;
  const denominator = Math.max(total - 1, 1);
  return viewport.padding + (index / denominator) * drawableWidth;
};

const yForValue = (value: number) => {
  const drawableHeight = viewport.height - viewport.padding * 2;
  return viewport.padding + ((100 - value) / 100) * drawableHeight;
};

const linePath = () => {
  const points = state.points;
  if (!points.length) return "";

  return points
    .map((value, index) => {
      const cmd = index === 0 ? "M" : "L";
      return `${cmd} ${xForIndex(index, points.length)} ${yForValue(value)}`;
    })
    .join(" ");
};

const areaPath = () => {
  const points = state.points;
  if (!points.length) return "";

  const firstX = xForIndex(0, points.length);
  const lastX = xForIndex(points.length - 1, points.length);
  const floorY = yForValue(0);
  return `${linePath()} L ${lastX} ${floorY} L ${firstX} ${floorY} Z`;
};

const latest = () => {
  const value = state.points.at(-1);
  return value === undefined ? "—" : value.toFixed(1);
};

const average = () => {
  if (!state.points.length) return "—";
  const sum = state.points.reduce((acc, value) => acc + value, 0);
  return (sum / state.points.length).toFixed(1);
};

const toggleRunning = () => {
  state.running = !state.running;
};

const resetSeries = () => {
  state.points = [];
  state.ticks = 0;
  state.phase = 0;
  for (let i = 0; i < 24; i += 1) pushSample();
};

let intervalHandle: ReturnType<typeof setInterval> | undefined;

const restartInterval = () => {
  if (intervalHandle) clearInterval(intervalHandle);
  intervalHandle = setInterval(() => {
    if (state.running) pushSample();
  }, state.tickMs);
};

onMounted(() => {
  resetSeries();
  restartInterval();

  if (!mountEl.value) return;

  const app = html`
    <section class="space-y-6">
      <div class="grid gap-4 md:grid-cols-4">
        <div class="rounded-lg border border-default px-4 py-3">
          <p class="text-xs uppercase tracking-wide text-muted">Latest</p>
          <p class="text-2xl font-semibold">${latest}</p>
        </div>
        <div class="rounded-lg border border-default px-4 py-3">
          <p class="text-xs uppercase tracking-wide text-muted">Average</p>
          <p class="text-2xl font-semibold">${average}</p>
        </div>
        <div class="rounded-lg border border-default px-4 py-3">
          <p class="text-xs uppercase tracking-wide text-muted">Window</p>
          <p class="text-2xl font-semibold">${() => state.points.length}</p>
        </div>
        <div class="rounded-lg border border-default px-4 py-3">
          <p class="text-xs uppercase tracking-wide text-muted">Ticks</p>
          <p class="text-2xl font-semibold">${() => state.ticks}</p>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-default bg-elevated">
        <svg
          viewBox="0 0 ${viewport.width} ${viewport.height}"
          class="h-72 w-full"
          role="img"
          aria-label="Streaming line chart"
        >
          <line
            x1="${viewport.padding}"
            y1="${yForValue(75)}"
            x2="${viewport.width - viewport.padding}"
            y2="${yForValue(75)}"
            stroke="currentColor"
            opacity="0.15"
          />
          <line
            x1="${viewport.padding}"
            y1="${yForValue(50)}"
            x2="${viewport.width - viewport.padding}"
            y2="${yForValue(50)}"
            stroke="currentColor"
            opacity="0.2"
          />
          <line
            x1="${viewport.padding}"
            y1="${yForValue(25)}"
            x2="${viewport.width - viewport.padding}"
            y2="${yForValue(25)}"
            stroke="currentColor"
            opacity="0.15"
          />
          <path d="${areaPath}" fill="currentColor" opacity="0.08" />
          <path
            d="${linePath}"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div class="grid gap-4 md:grid-cols-[auto_auto_1fr] md:items-center">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-md border border-default px-3 py-2 text-sm font-medium hover:bg-elevated"
            @click="${toggleRunning}"
          >
            ${() => (state.running ? "Pause stream" : "Resume stream")}
          </button>
          <button
            type="button"
            class="rounded-md border border-default px-3 py-2 text-sm font-medium hover:bg-elevated"
            @click="${resetSeries}"
          >
            Reset
          </button>
        </div>

        <div class="text-sm text-muted">
          ${() => (state.running ? "Status: running" : "Status: paused")}
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="space-y-1 text-sm">
            <span class="text-muted">Render interval: ${() => state.tickMs}ms</span>
            <input
              type="range"
              min="30"
              max="400"
              step="10"
              value="${() => state.tickMs}"
              class="w-full"
              @input="${(event: Event) => {
                state.tickMs = Number((event.target as HTMLInputElement).value);
                restartInterval();
              }}"
            />
          </label>
          <label class="space-y-1 text-sm">
            <span class="text-muted">Window size: ${() => state.samples}</span>
            <input
              type="range"
              min="30"
              max="220"
              step="10"
              value="${() => state.samples}"
              class="w-full"
              @input="${(event: Event) => {
                state.samples = Number((event.target as HTMLInputElement).value);
                state.points = state.points.slice(-state.samples);
              }}"
            />
          </label>
        </div>
      </div>
    </section>
  `;

  mountEl.value.replaceChildren();
  app(mountEl.value);
});

onBeforeUnmount(() => {
  if (intervalHandle) clearInterval(intervalHandle);
});
</script>

<template>
  <div class="space-y-6 py-10">
    <div class="space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">Arrow.js streaming chart demo</h1>
      <p class="text-muted">
        A client-rendered example using <code>@arrow-js/core</code> for reactivity and SVG for
        fast streaming updates in this Nuxt UI app.
      </p>
    </div>

    <UCard>
      <ClientOnly>
        <div ref="mountEl" />
        <template #fallback>
          <div class="py-8 text-sm text-muted">Loading client-only chart…</div>
        </template>
      </ClientOnly>
    </UCard>
  </div>
</template>
