import {
  fetchWatchedReposFromIris,
  isIrisConfigured,
  type WatchedRepo,
} from '../utils/iris'

function env(name: string): string {
  const envRecord = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env
  const value = envRecord?.[name]
  return typeof value === 'string' ? value : ''
}

export default defineEventHandler(async (event): Promise<{
  enabled: boolean
  repos: WatchedRepo[]
  source?: 'iris'
  error?: string
}> => {
  const config = useRuntimeConfig(event)
  const irisConfig = {
    mcpAgentKey: config.mcpAgentKey || env('MCP_AGENT_KEY'),
    ctxMcpUrl: config.ctxMcpUrl || env('CTX_MCP_URL'),
    irisWatchedReposTool: config.irisWatchedReposTool || env('IRIS_WATCHED_REPOS_TOOL'),
  }

  if (!isIrisConfigured(irisConfig)) {
    return { enabled: false, repos: [] }
  }

  try {
    const repos = await fetchWatchedReposFromIris(irisConfig)
    return { enabled: true, repos, source: 'iris' }
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load watched repos'
    console.error('[watched-repos]', message)
    return { enabled: true, repos: [], source: 'iris', error: message }
  }
})
