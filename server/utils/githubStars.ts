import { z } from "zod";

const githubStarSchema = z.object({
  starred_at: z.string(),
  repo: z.object({
    full_name: z.string(),
    html_url: z.string().url(),
    description: z.string().nullable(),
    language: z.string().nullable(),
    owner: z.object({
      login: z.string(),
      avatar_url: z.string().url(),
    }),
  }),
});

const githubStarsResponseSchema = z.array(githubStarSchema);

export type GitHubStar = {
  title: string;
  url: string;
  description: string;
  language: string | null;
  owner: string;
  ownerAvatar: string;
  starredAt: string;
};

export async function fetchGitHubStars(
  username: string,
  limit: number,
  token?: string,
): Promise<GitHubStar[]> {
  const perPage = Math.min(Math.max(limit, 1), 30);
  const headers: HeadersInit = {
    Accept: "application/vnd.github.star+json",
    "User-Agent": "marr.github.io",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/starred?sort=created&direction=desc&per_page=${perPage}`,
    { headers },
  );

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: `GitHub API error: ${response.statusText}`,
    });
  }

  const payload = githubStarsResponseSchema.parse(await response.json());

  return payload.map(({ starred_at, repo }) => ({
    title: repo.full_name,
    url: repo.html_url,
    description: repo.description ?? "",
    language: repo.language,
    owner: repo.owner.login,
    ownerAvatar: repo.owner.avatar_url,
    starredAt: starred_at,
  }));
}
