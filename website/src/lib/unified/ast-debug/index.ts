import type { Plugin, Transformer } from "unified"

/**
 * a unified plugin that exists purely for the utility of printing out the AST in its current state.
 */
const astDebug: Plugin = ({ name = 'ast' }: { name?: string } = {}) => {
  const transformer: Transformer = (ast) => {
    console.log(name, ast)
  }

  return transformer
}

export default astDebug