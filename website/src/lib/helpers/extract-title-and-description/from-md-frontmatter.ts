import matter from "gray-matter"

import type { TitleAndDescription } from "./types"

/**
 * extracts title and description data from markdown frontmatter.
 * if a title is found but no description,
 *  the description will fall back to an empty string
 */
export async function extractTitleAndDescriptionFromMdFrontmatter (md: string): Promise<TitleAndDescription | null> {
  const { data: { title, description = '' } } = matter(md)

  return typeof title === 'string'
    ? { title, description }
    : null
}