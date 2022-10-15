import { visit } from "unist-util-visit"

import type { Plugin, Transformer } from "unified"
import type { Link } from "mdast"

const relativeLinkRegex = /^\.\.?\/.+/

type Options = {
  resolver: (url: string) => string
}
const remarkResolveRelativeLinks: Plugin<[Options]> = ({ resolver }) => {
  const transformer: Transformer = (ast) => {
  
    const visitor = (link: Link) => {
      // only handle relative links
      if (!relativeLinkRegex.test(link.url)) { return }
      link.url = resolver(link.url)
    }

    visit(ast, 'link', visitor)
  }

  return transformer
}

export default remarkResolveRelativeLinks