/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * license/docusaurus file in the root directory of the website source tree.
 */


import * as acorn from "acorn"
import { fromMarkdown } from "mdast-util-from-markdown"
import { mdxjsEsm } from "micromark-extension-mdxjs-esm"
import { mdxjsEsmFromMarkdown } from "mdast-util-mdxjs-esm"
import { mathFromMarkdown } from "mdast-util-math"

import type { Literal } from "mdast"

export const createExportNode = (exportContent: string): Literal => {
  const tree = fromMarkdown(exportContent, {
    extensions: [mdxjsEsm({
      // @ts-ignore idk unified typings
      acorn,
      addResult: true,
    })],
    mdastExtensions: [mathFromMarkdown(), mdxjsEsmFromMarkdown],
  })

  const exportNode = tree.children[0] as Literal
  delete exportNode.position
  
  return exportNode
}