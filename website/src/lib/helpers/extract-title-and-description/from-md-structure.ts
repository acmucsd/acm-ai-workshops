import { fromMarkdown } from "mdast-util-from-markdown"
import { math } from "micromark-extension-math"
import { gfm } from "micromark-extension-gfm"
import { mathFromMarkdown } from "mdast-util-math"
import { gfmFromMarkdown } from "mdast-util-gfm"


import { extractTitleAndDescriptionFromMdast } from "./from-mdast"

/**
 * extracts title and description data from markdown string through its AST structure
 */
export async function extractTitleAndDescriptionFromMdStructure (md: string) {
  const mdast = fromMarkdown(md, 'utf-8', {
    extensions: [gfm(), math()],
    mdastExtensions: [gfmFromMarkdown(), mathFromMarkdown()],
  })
  
  return await extractTitleAndDescriptionFromMdast(mdast)
}