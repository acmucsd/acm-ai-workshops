import { visit } from "unist-util-visit"
import parse from "html-react-parser"

import { parseOpeningTag, isClosingTag, isOpeningTag, parseClosingTag, isChildlessTag } from "./utils"

import type { Plugin, Transformer } from "unified"
import type { HTML, Parent } from "mdast"

/**
 * rehype plugin for transforming html attributes
 *  to conform to JSX style as opposed to "standard" html
 */
const remarkHtmlToJsx: Plugin = () => {
  const transformer: Transformer = (mdast) => {

    const visitor = (node: HTML, i: number, parent: Parent) => {
      const html = node.value

      if (isOpeningTag(html)) {
        const { tag } = parseOpeningTag(html) ?? {}

        const isChildless = isChildlessTag(html)
        const validHtmlString = isChildless ? html : `${html}<${tag}/>`
        const el = parse(validHtmlString) as unknown as JSX.Element
        
        let outputHtml = `<${tag}`
        for (const k in el.props) {
          if (k === 'children') { continue } 
          const v = el.props[k]
          if (v instanceof Function) { continue } // not gonna bother
          outputHtml += ` ${k}={${JSON.stringify(v)}}`
        }
        
        outputHtml += isChildless ? `/>` : `>`

        const newNode = { type: 'html', tag, value: outputHtml } as HTML
        parent.children.splice(i, 1, newNode)        
      } else if (isClosingTag(html)) {
        const tag = parseClosingTag(html)
        const newNode = { type: 'html', tag, value: html } as HTML
        parent.children.splice(i, 1, newNode)
      }
    }

    visit(mdast, 'html', visitor)
  }

  return transformer
}

export default remarkHtmlToJsx