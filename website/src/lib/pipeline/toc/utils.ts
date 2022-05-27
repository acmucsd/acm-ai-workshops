/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * license/docusaurus file in the root directory of the website source tree.
 */

import escapeHtml from "escape-html"
import { toString } from "mdast-util-to-string"
import { toMarkdown } from "mdast-util-to-markdown"
import { mathToMarkdown } from "mdast-util-math"
import { unified } from "unified"
import remarkParse from "remark-parse/lib"
import remarkMath from "remark-math"
import remarkRehype from "remark-rehype"
import rehypeKatex from "rehype-katex"
import rehypeStringify from "rehype-stringify/lib"

import type { Parent } from "unist"
import type { Paragraph, PhrasingContent, Heading } from "mdast"

export const stringifyContent = (node: Parent): string => {
  return ((node.children || []) as PhrasingContent[])
    .map(toValue)
    .join('')
}

// this function was basically taken from Docusaurus,
// with handling for inline math and paragraph nodes added
// i _think_ we could literally avoid needing to use `toValue` + `stringifyContent`
// by literally running the whole pipeline (+ add remark-gfm to handle strikethroughs) in the case of inlineMath
// on the original node, and it should yield the same value
// but i'm assuming the Docusaurus maintainers implemented it the way they did
// for performance reasons so i'll leave it as is for now.
// this can definitely be revisited later though

/**
 * converts a tree rooted at MDAST node into an html string 
 * @param node the node to convert
 * @returns the html string representing that node
 */
export const toValue = (node: PhrasingContent | Heading | Paragraph): string => {
  switch (node?.type) {
    case 'text':
      return escapeHtml(node.value)
    case 'heading':
      return stringifyContent(node)
    case 'inlineCode':
      return `<code>${escapeHtml(node.value)}</code>`
    case 'emphasis':
      return `<em>${stringifyContent(node)}</em>`
    case 'strong':
      return `<strong>${stringifyContent(node)}</strong>`
    case 'delete':
      return `<del>${stringifyContent(node)}</del>`
    case 'link':
      return stringifyContent(node)
    case 'inlineMath':
      const contents = toMarkdown(node, { extensions: [mathToMarkdown()] })
      const html = unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .processSync(contents)
        .toString()
      // the result will be wrapped in a <p> tag; we want to remove that
      const stripWrappingTag = (html: string) => html.match(/^<(.*)>(?<content>.*)<\/\1>$/)?.groups!.content
      const stripped = stripWrappingTag(html) ?? html
      return stripped
    case 'paragraph':
      return stringifyContent(node)
    default:
  }

  return toString(node)
}