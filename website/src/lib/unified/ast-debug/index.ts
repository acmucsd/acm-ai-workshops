import type { Plugin, Transformer } from "unified"
import { Node } from "unist"
import { Parent, visit } from "unist-util-visit"

type Options = {
  name?: string
  stringify?: boolean
  ignorePositionData?: boolean
  visitOnly?: string | null
}

/**
 * a unified plugin that exists purely for the utility of printing out the AST in its current state.
 */
const astDebug: Plugin = ({
  name = 'ast',
  stringify = false,
  ignorePositionData = true,
  visitOnly = null,
}: Options = {}) => {
  const transformer: Transformer = (ast) => {
    if (!visitOnly) {
      const cleaned = ignorePositionData ? purgePositionData(ast) : ast
      const output = stringify ? JSON.stringify(cleaned, null, 2) : cleaned
      console.log(name, output)  
    } else {
      visit(ast, visitOnly, (node) => {
        const childless = purgeChildren(node)
        const cleaned = ignorePositionData ? purgePositionData(childless) : childless
        const output = stringify ? JSON.stringify(cleaned, null, 2) : cleaned
        console.log(name, output)
      })
    }
  }

  return transformer
}

function purgePositionData(ast: Node) {
  const { position, ...node } = ast
  const children = (node as Parent)?.children ?? []
  if (children.length > 0) {
    (node as Parent).children = (node as Parent).children.map(purgePositionData)
  }
  return node
}

function purgeChildren(ast: Node) {
  // @ts-ignore
  const { children, ...node } = ast
  return node
}

export default astDebug