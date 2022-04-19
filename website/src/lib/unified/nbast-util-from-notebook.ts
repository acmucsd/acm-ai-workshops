import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse/lib";

import type { Parent } from "mdast";
import type { Cell, JupyterNotebook } from "@/lib/types/notebook";

/**
 * converts an ipynb file into a syntax tree,
 * it's honestly basically just an mdx tree, however,
 * rather than an actual new "nbast" custom specification syntax tree
 * @param doc: ipynb file contents
 * @returns the mdx syntax tree created from the ipynb file
 */
export const fromNotebook = (doc: string) => {
  const notebookJson = JSON.parse(doc) as JupyterNotebook;

  const language = notebookJson?.metadata?.language_info?.name ?? 'python';

  const { cells } = notebookJson;

  // construct the ast
  let ast = { type: 'root', children: [] as any[] };
  cells.forEach((cell: Cell) => {
    const { id, cell_type, metadata, source } = cell;
    const sourceStr = Array.isArray(source)
      ? source.join('') // it seems they already have a \n at the end so dont need to join with it? idk for sure tho
      : source;
    // TODO: handle attachments for all cells (or at least code/markdown)
    // TODO: handle outputs for code cells
    // TODO: show/hide source and outputs for each cell
    switch (cell_type) {
      case 'code':
        
        ast.children.push({ type: 'code', lang: language, value: sourceStr });
        
        // TODO
        const { outputs } = cell;

        // cell.outputs.forEach((outputDict) => {
        //
        // });
        break
      case 'markdown':
        const root = unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkMath)
          .parse(sourceStr)
        ;
        ast.children.push(...(root as Parent).children);
        break
      case 'raw':
        break
    }
  })
  return ast;
}