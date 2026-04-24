/**
 * Match `@nuxt/content` + `ufo`’s `withoutTrailingSlash` (path segment only) so queries hit the DB
 * `path` column: leading slash, no trailing slash, root is `"/"`. Router may give `""` for `/`.
 */
function normalizePathForContent(path: string) {
  const noTrailing = path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
  return noTrailing || "/";
}

/**
 * Path for @nuxt/content `queryCollection().path(...)` and stable `useAsyncData` keys.
 * Stored pages use a leading slash and no trailing slash; root is `"/"`.
 * Vue Router can surface `""` for the index route (e.g. HMR or navigation edge cases),
 * which would miss `content/index.md` and surface as 404 in the catch-all page.
 */
export function useContentPath() {
  const route = useRoute();
  return computed(() => normalizePathForContent(route.path));
}
