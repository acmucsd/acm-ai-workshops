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
      console.log('old', link.url)
      link.url = resolver(link.url)
      console.log('new', link.url)
    }

    visit(ast, 'link', visitor)
  }

  return transformer
}

export default remarkResolveRelativeLinks