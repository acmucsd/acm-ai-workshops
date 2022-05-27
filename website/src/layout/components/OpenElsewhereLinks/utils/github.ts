export const REPO_OWNER = 'acmucsd'
export const REPO_NAME = 'acm-ai-workshops'
export const DEFAULT_BRANCH = 'main'

// GitHub uses `blob` for files and `tree` for directories
// `/tree/file` auto redirects to `/blob/file` but not vice versa so we want to use `tree` by default
// but Colab expects a well-formed `blob`
export const getGithubSlug = (
  fsPath: string[],
  { blob = false }: { blob?: boolean } = {},
) => (
  `${REPO_OWNER}/${REPO_NAME}/${blob ? 'blob' : 'tree'}/${DEFAULT_BRANCH}/${fsPath.map(encodeURIComponent).join('/')}`
)