import { readFile, stat } from "fs/promises"
import { join } from "path"

import matter from "gray-matter"

import type { TitleAndDescription } from "./types"

export const METADATA_NAME = `.acm-ai-metadata.yml`

const asFrontmatter = (metadata: string) =>
`---
${metadata}
---`

/**
 * extracts title and description data from metadata file associated with a given file or directory.
 * if a title is found but no description,
 *  the description will fall back to an empty string
 */
export async function extractTitleAndDescriptionFromMetadataFile (fullPath: string): Promise<TitleAndDescription | null> {
  try {
    const stats = await stat(fullPath)
    if (!stats.isFile() && !stats.isDirectory()) { return null }
    const metadataPath = stats.isFile()
      ? `${fullPath}${METADATA_NAME}`    // METADATA_NAME becomes the extension to indicate metadata file
      : join(fullPath, METADATA_NAME)    // METADATA_NAME is the name of the file in the directory
    
    const metadataContents = await readFile(metadataPath, 'utf8')
    const { data: { title, description = '' } } = matter(asFrontmatter(metadataContents)) // hacky yaml parser lol

    return typeof title === 'string'
      ? { title, description }
      : null
  } catch {
    return null
  }
}