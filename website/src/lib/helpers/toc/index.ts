import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { unified } from "unified"
import remarkHeadingIds from "@/lib/unified/remark-heading-ids"
import remarkParse from "remark-parse/lib"
import remarkStringify from "remark-stringify"
import search from "./search"
import type { TocItem } from "./types"

export const extractToc = async (md: string) => {
  let toc: TocItem[] = []
  const createToc = () => {
    const transformer = (node: any) => {
      toc = search(node)
    }
  
    return transformer
  }

  // basically just a convoluted way to access the AST to be able to generate the toc
  await unified()
    .use(remarkParse)       // this is just to be able to use remark plugins
    .use(remarkHeadingIds)  // bind ids to headings 
    .use(remarkGfm)         // recognize strikethroughs and stuff
    .use(remarkMath)        // recognize math
    .use(createToc)         // generate the table of contents
    // @ts-ignore TODO dunno why this isn't seen as a properly typed plugin
    .use(remarkStringify)   // this is just to be able to use remark plugins
    .process(md)
  return toc
}