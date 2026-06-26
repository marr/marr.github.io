/**
 * Redis Iris (Context Surfaces) MCP client for watched GitHub repositories.
 * @see https://redis.io/iris/
 * @see https://redis.io/docs/latest/develop/ai/context-engine/context-retriever/
 */

const DEFAULT_MCP_URL = 'https://gcp-us-east4.context-surfaces.redis.io/mcp'

export interface IrisConfig {
  mcpAgentKey?: string
  ctxMcpUrl?: string
  irisWatchedReposTool?: string
}

export interface WatchedRepo {
  title: string
  url: string
  description?: string
  tags?: string[]
  icon?: string
}

type McpJson = Record<string, unknown>

function getMcpUrl(config: IrisConfig): string {
  return config.ctxMcpUrl?.trim() || DEFAULT_MCP_URL
}

function getAgentKey(config: IrisConfig): string | undefined {
  const key = config.mcpAgentKey?.trim()
  return key || undefined
}

function getWatchedReposToolName(config: IrisConfig): string | undefined {
  const name = config.irisWatchedReposTool?.trim()
  return name || undefined
}

async function mcpRequest<T = unknown>(
  config: IrisConfig,
  method: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const agentKey = getAgentKey(config)
  if (!agentKey) {
    throw new Error('MCP_AGENT_KEY is not configured')
  }

  const response = await fetch(getMcpUrl(config), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': agentKey,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }),
  })

  if (!response.ok) {
    throw new Error(`Iris MCP HTTP ${response.status}: ${response.statusText}`)
  }

  const data = (await response.json()) as McpJson
  if (data.error) {
    throw new Error(`Iris MCP error: ${JSON.stringify(data.error)}`)
  }

  return data.result as T
}

export async function listIrisTools(
  config: IrisConfig,
): Promise<Array<{ name: string, description?: string }>> {
  const result = await mcpRequest<{ tools?: Array<{ name: string, description?: string }> }>(
    config,
    'tools/list',
  )
  return result.tools ?? []
}

function pickWatchedReposTool(
  config: IrisConfig,
  tools: Array<{ name: string, description?: string }>,
): string | undefined {
  const explicit = getWatchedReposToolName(config)
  if (explicit) {
    return tools.some(t => t.name === explicit) ? explicit : explicit
  }

  const patterns = [
    /filter_.*repositor.*watch/i,
    /filter_.*watch.*repositor/i,
    /list_.*watch.*repositor/i,
    /list_.*repositor.*watch/i,
    /filter_repositor/i,
    /search_.*repositor/i,
  ]

  for (const pattern of patterns) {
    const match = tools.find(t => pattern.test(t.name))
    if (match) return match.name
  }

  return tools.find(t => /repositor/i.test(t.name))?.name
}

function extractTextPayload(result: unknown): string | undefined {
  if (!result || typeof result !== 'object') return undefined
  const record = result as McpJson
  const content = record.content
  if (!Array.isArray(content)) return undefined
  const textBlock = content.find(
    (item): item is { type: string, text: string } =>
      typeof item === 'object'
      && item !== null
      && (item as McpJson).type === 'text'
      && typeof (item as McpJson).text === 'string',
  )
  return textBlock?.text
}

function parseToolPayload(result: unknown): unknown {
  if (!result || typeof result !== 'object') return result
  const record = result as McpJson

  const text = extractTextPayload(result)
  if (text) {
    try {
      return JSON.parse(text)
    }
    catch {
      return { raw_text: text }
    }
  }

  if (typeof record.raw_text === 'string') {
    try {
      return JSON.parse(record.raw_text)
    }
    catch {
      return { raw_text: record.raw_text }
    }
  }

  return result
}

function collectRecords(payload: unknown): McpJson[] {
  if (!payload) return []
  if (Array.isArray(payload)) {
    return payload.filter((item): item is McpJson => typeof item === 'object' && item !== null)
  }
  if (typeof payload !== 'object') return []

  const record = payload as McpJson
  const buckets = ['results', 'records', 'items', 'repositories', 'data']
  for (const key of buckets) {
    const value = record[key]
    if (Array.isArray(value)) {
      return value.filter((item): item is McpJson => typeof item === 'object' && item !== null)
    }
  }

  return [record]
}

function stringField(record: McpJson, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return undefined
}

function buildRepoUrl(record: McpJson): string | undefined {
  const direct = stringField(record, ['html_url', 'url', 'repo_url', 'repository_url'])
  if (direct) return direct

  const fullName = stringField(record, ['full_name', 'repo_full_name', 'repository_full_name'])
  if (fullName) return `https://github.com/${fullName}`

  const owner = stringField(record, ['owner', 'owner_login', 'org'])
  const name = stringField(record, ['name', 'repo_name', 'repository_name', 'title'])
  if (owner && name) return `https://github.com/${owner}/${name}`

  return undefined
}

function languageIcon(language?: string): string | undefined {
  if (!language) return 'i-mdi-github'
  const slug = language.toLowerCase().replace(/[^a-z0-9+#]/g, '')
  const map: Record<string, string> = {
    typescript: 'i-logos-typescript-icon',
    javascript: 'i-simple-icons-javascript',
    vue: 'i-logos-vue',
    python: 'i-logos-python',
    go: 'i-logos-go',
    rust: 'i-logos-rust',
    java: 'i-logos-java',
    kotlin: 'i-logos-kotlin-icon',
    ruby: 'i-logos-ruby',
    nuxt: 'i-logos-nuxt-icon',
  }
  return map[slug] ?? 'i-mdi-github'
}

function mapRecordToWatchedRepo(record: McpJson): WatchedRepo | undefined {
  const url = buildRepoUrl(record)
  if (!url) return undefined

  const title
    = stringField(record, ['full_name', 'name', 'repo_name', 'repository_name', 'title'])
      ?? url.replace(/^https:\/\/github\.com\//, '')

  const description = stringField(record, [
    'description',
    'summary',
    'repo_description',
  ])

  const language = stringField(record, ['language', 'primary_language'])
  const topics = record.topics
  const tags = [
    ...(language ? [language] : []),
    ...(Array.isArray(topics)
      ? topics.filter((t): t is string => typeof t === 'string').slice(0, 2)
      : []),
  ]

  return {
    title,
    url,
    description,
    tags: tags.length ? tags : undefined,
    icon: languageIcon(language),
  }
}

function buildToolArguments(toolName: string): Record<string, unknown> {
  const args: Record<string, unknown> = { limit: 24 }

  if (/watch/i.test(toolName)) {
    args.watched = true
    args.is_watched = true
  }

  if (/filter_/i.test(toolName)) {
    args.field = 'watched'
    args.value = true
  }

  return args
}

export async function fetchWatchedReposFromIris(config: IrisConfig): Promise<WatchedRepo[]> {
  const tools = await listIrisTools(config)
  const toolName = pickWatchedReposTool(config, tools)
  if (!toolName) {
    throw new Error(
      'No repository tool found on Iris context surface. Set IRIS_WATCHED_REPOS_TOOL.',
    )
  }

  const raw = await mcpRequest(
    config,
    'tools/call',
    {
      name: toolName,
      arguments: buildToolArguments(toolName),
    },
  )

  const parsed = parseToolPayload(raw)
  const records = collectRecords(parsed)

  const seen = new Set<string>()
  const repos: WatchedRepo[] = []

  for (const record of records) {
    const repo = mapRecordToWatchedRepo(record)
    if (!repo || seen.has(repo.url)) continue
    seen.add(repo.url)
    repos.push(repo)
  }

  return repos.slice(0, 24)
}

export function isIrisConfigured(config: IrisConfig): boolean {
  return Boolean(getAgentKey(config))
}
