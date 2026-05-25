import {
  fetchWatchedReposFromIris,
  isIrisConfigured,
  type WatchedRepo,
} from '../utils/iris'

export default defineEventHandler(async (event): Promise<{
  enabled: boolean
  repos: WatchedRepo[]
  source?: 'iris'
  error?: string
}> => {
  const config = useRuntimeConfig(event)
  const irisConfig = {
    mcpAgentKey: config.mcpAgentKey,
    ctxMcpUrl: config.ctxMcpUrl,
    irisWatchedReposTool: config.irisWatchedReposTool,
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
