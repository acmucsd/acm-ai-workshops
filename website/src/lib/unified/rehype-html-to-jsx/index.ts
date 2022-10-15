/**
 * Copyright (c) rhysd, Mapbox, Titus Wormer
 *
 * This source code is licensed under the MIT license found in the
 * license/rehype-react file in the root directory of the website source tree.
 */

import { SKIP, visit } from "unist-util-visit"
import { createElement } from "react";
import { toH } from "hast-to-hyperscript"
// @ts-ignore
import tableCellStyle from "@mapbox/hast-util-table-cell-style"
import {whitespace} from "hast-util-whitespace"

import type { Plugin, Transformer } from "unified"
import type { ComponentType, ReactNode } from "react"
import type { Element, Parent } from "hast";
import { stringifyEntities } from "stringify-entities";
import { Raw } from "hast-util-to-html/lib/types";

const own = {}.hasOwnProperty
const tableElements = new Set([
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td'
])

// adapted / selected subset of https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements#list_of_inline_elements
const inlineElements = new Set(`
a abbr acronym b bdi bdo big br button canvas cite code data datalist del dfn
em embed i iframe input img ins kbd label map mark meter noscript object
output picture progress q ruby s samp script select slot small span strong
sub sup svg template textarea time u tt var video wbr
`.trim().split(/s+/))
inlineElements.delete('img') // we will treat images as block elements

type Options = {
  prefix?: string
}
/**
 * rehype plugin for transforming html attributes
 *  to conform to JSX style as opposed to "standard" html
 * this should be used on a tree generated from remark and passed through with `remark-identify-markdown`
 */
const rehypeHtmlToJsx: Plugin = ({ prefix = 'h-' }: Options = {}) => {
  const transformer: Transformer = (hast) => {

    const visitor = (node: Element, i: number, parent: Parent) => {
      // don't transform code blocks or any of their children/contents - it messes up with turning them back to markdown code blocks
      if (node.tagName === 'pre') { return SKIP }
      
      // dont transform nodes with no properties - there's nothing to transform
      if (!node.properties || Object.keys(node.properties).length === 0) { return }

      // @ts-ignore idk why its complaining about this
      const el = toH(h, tableCellStyle(node), prefix)
      const { className, ...props } = el.props
      
      const originalClassName = node?.properties?.className || ''
      node.properties = {
        ...props,
        ...(originalClassName && { className: className ? [originalClassName, className] : originalClassName }),
      }

      let openTag = `<${el.type}`
      for (let k in el.props) {
        if (k === 'children') { continue }
        let v = el.props[k]
        if (v instanceof Function) { continue } // not gonna bother
        
        if (typeof v === 'string') {
          v = stringifyEntities(v, { subset: [`"`], attribute: true })
        }
        openTag += ` ${k}={${JSON.stringify(v)}}`
      }
      openTag += `>`
      const closingTag = `</${el.type}>`
      
      const open: Raw = { type: 'raw', value: openTag }
      const close: Raw = { type: 'raw', value: closingTag }

      const newNodes = [open, ...node.children, close]

      parent.children.splice(i, 1, ...newNodes)
      return [SKIP, 1] as [typeof SKIP, number]
    }

    function h(name: keyof JSX.IntrinsicElements, props: Record<string, unknown>, children: ReactNode[]): ReactNode {
      // Currently, a warning is triggered by react for *any* white space in
      // tables.
      // So we remove the pretty lines for now.
      // See: <https://github.com/facebook/react/pull/7081>.
      // See: <https://github.com/facebook/react/pull/7515>.
      // See: <https://github.com/remarkjs/remark-react/issues/64>.
      if (children && tableElements.has(name)) {
        children = children.filter((child) => !whitespace(child))
      }
  
      return createElement(name, props, children)
    }

    // update elements
    visit(hast, 'element', visitor)
  }

  return transformer
}

export default rehypeHtmlToJsx