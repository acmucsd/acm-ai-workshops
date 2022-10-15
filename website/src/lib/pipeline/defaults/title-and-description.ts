import path from "path"

import { extractTitleAndDescriptionFromMdFrontmatter } from "@/lib/helpers/extract-title-and-description/from-md-frontmatter"
import { extractTitleAndDescriptionFromMdStructure } from "@/lib/helpers/extract-title-and-description/from-md-structure"
import { extractTitleAndDescriptionFromMetadataFile } from "@/lib/helpers/extract-title-and-description/from-metadata"

import type { TitleAndDescriptionExtractorArgs } from "@/lib/pipeline/types"
import type { FsDir } from "@/lib/pipeline/fs-tree/types"
import type { TitleAndDescription } from "@/lib/helpers/extract-title-and-description/types"

export const fileFallbackTitleAndDescription = ({ fullPath }: Pick<TitleAndDescriptionExtractorArgs, 'fullPath'>): TitleAndDescription  => {
  const fallback = {
    title: path.parse(fullPath).name, // file name (no extension)
    description: '',                  // no description
  }
  return fallback
}

export const dirFallbackTitleAndDescription = ({ entry }: Pick<TitleAndDescriptionExtractorArgs, 'entry'>): TitleAndDescription => {
  const { fsPath, numLeaves } = entry as FsDir
  const fallback = {
    title: fsPath[fsPath.length - 1],
    description: numLeaves === 1
    ? `${numLeaves} item`
    : `${numLeaves} items`
  }

  return fallback
}

export const markdownTitleAndDescription = async ({ md }: Pick<TitleAndDescriptionExtractorArgs, 'md'>) => (
  await extractTitleAndDescriptionFromMdFrontmatter(md)   // try obtaining from frontmatter
  ?? await extractTitleAndDescriptionFromMdStructure(md)  // try guessing from markdown file structure
)

export const fileDefaultGetTitleAndDescription = async ({ md, fullPath }: TitleAndDescriptionExtractorArgs) => (
  await extractTitleAndDescriptionFromMetadataFile(fullPath)
  ?? await markdownTitleAndDescription({ md })
)

export const dirDefaultGetTitleAndDescription = async ({ fullPath }: Pick<TitleAndDescriptionExtractorArgs, 'fullPath'>) => (
  await extractTitleAndDescriptionFromMetadataFile(fullPath)
)

export const dirFileDefaultGetTitleAndDescription = async ({ md, fullPath }: TitleAndDescriptionExtractorArgs) => (
  await extractTitleAndDescriptionFromMetadataFile(fullPath)
  ?? await markdownTitleAndDescription({ md })
  ?? await dirDefaultGetTitleAndDescription({ fullPath })
)