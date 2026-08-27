import { fetchGitHubStars } from "../../utils/githubStars";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const config = useRuntimeConfig(event);
  const limit = Number(query.limit) || 8;
  const username =
    (typeof query.username === "string" && query.username) ||
    config.public.githubUsername;

  setResponseHeader(event, "Cache-Control", "public, max-age=3600, s-maxage=3600");

  return fetchGitHubStars(username, limit, config.github.token || undefined);
});
