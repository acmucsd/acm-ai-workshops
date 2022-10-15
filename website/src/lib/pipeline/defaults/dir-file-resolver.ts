import { join } from "path"
import { isFile } from "@/lib/utils/fs" 

import type { DirFileResolver } from "@/lib/pipeline/types"

const README_FILENAMES = ['README.md', 'README', 'README.txt']

/**
 * finds the README file in a given directory.
 * if multiple README files are present, goes in precedent of order in the README_FILENAMES array
 * if no README is found, returns null
 * @param dirPath full path to directory to search README for
 * @returns the full path to the README, or null if none found
 */
export const getReadmePath = async (dirPath: string) => {
  for (const readme of README_FILENAMES) {
    const readmePath = join(dirPath, readme)
    if (await isFile(readmePath)) { return readmePath }
  }
  return null
}

export const defaultDirFileResolver: DirFileResolver = async ({ fullPath }) => await getReadmePath(fullPath)