export const REPO_OWNER = 'acmucsd'
export const REPO_NAME = 'acm-ai-workshops'
export const DEFAULT_BRANCH = 'main'

export const getGithubSlug = (fsPath: string[]) => `${REPO_OWNER}/${REPO_NAME}/tree/${DEFAULT_BRANCH}/${fsPath.map(encodeURIComponent).join('/')}`