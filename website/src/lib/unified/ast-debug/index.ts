import type { Plugin, Transformer } from "unified"
import { Node } from "unist"
import { Parent, visit } from "unist-util-visit"

type Options = {
  name?: string
  stringify?: boolean
  ignorePositionData?: boolean
  visitOnly?: string | { type?: string, condition: boolean | ((node: Node<any>) => boolean), printChildren?: boolean }
}

/**
 * a unified plugin that exists purely for the utility of printing out the AST in its current state.
 */
const astDebug: Plugin<[Options]> = ({
  name = 'ast',
  stringify = false,
  ignorePositionData = true,
  visitOnly,
} = {}) => {
  const transformer: Transformer = (ast) => {
    if (!visitOnly) {
      const cleaned = ignorePositionData ? purgePositionData(ast) : ast
      const output = stringify ? JSON.stringify(cleaned, null, 2) : cleaned
      console.log(name, output)  
    } else {
      const { type, condition = true, printChildren = false } = typeof visitOnly === 'string' ? { type: visitOnly } : visitOnly
      const conditionFn = typeof condition === 'boolean' ? (() => condition) : condition
      const visitor = (node: Node) => {
        if (!conditionFn(node)) { return }
        const childless = printChildren ? node : purgeChildren(node)
        const cleaned = ignorePositionData ? purgePositionData(childless) : childless
        const output = stringify ? JSON.stringify(cleaned, null, 2) : cleaned
        console.log(name, output)
      }
      if (type) { visit(ast, type, visitor) }
      else { visit(ast, visitor) }
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