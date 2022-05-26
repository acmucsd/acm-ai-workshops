import { EXIT, SKIP, visit } from "unist-util-visit"

import { toValue } from "@/lib/pipeline/toc/utils"

import type { Root } from "mdast"
import type { TitleAndDescription } from "./types"

const wrapSpan = (html: string) => `<span>${html}</span>`

/**
 * extracts title and description data from markdown AST.
 * if a title is found but no description,
 *  the description will fall back to an empty string
 */
export async function extractTitleAndDescriptionFromMdast (mdast: Root): Promise<TitleAndDescription | null> {
  let title: string | undefined = undefined
  let description: string = ''
  visit(mdast, (node) => {
    // title not found
    if (title === undefined) {  
      if (node.type === 'heading' && node.depth === 1) {
        title = wrapSpan(toValue(node))
        return SKIP
      }
    // found title
    } else {
      if (node.type === 'paragraph') {
        description = wrapSpan(toValue(node))
        return EXIT
      }
    }
  })

  return (title === undefined)
    ? null
    : { title, description }
}