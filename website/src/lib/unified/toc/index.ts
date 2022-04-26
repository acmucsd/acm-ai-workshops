/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-docusaurus file in the root directory of the website source tree.
 */

import { parse } from "@babel/parser"
import traverse from "@babel/traverse"
import stringifyObject from "stringify-object"

import { createExportNode } from "./node"
import search from "./search"

import type { Identifier } from "@babel/types"
import type { ParserOptions } from "@babel/parser"
import type { Plugin, Transformer } from "unified"
import type { Node, Parent } from "unist"
import type { Literal } from "mdast"

interface Options {
  name?: string
}

const toc: Plugin<[Options?]> = ({ name = 'toc' } = {}) => {

  const transformer: Transformer = (node) => {
    const headings = search(node)
    const { children } = node as Parent<Literal>
    const targetIndex = getOrCreateExistingTargetIndex(children, name);

    if (headings && headings.length) {
      children[targetIndex] = createExportNode(`export const ${name} = ${stringifyObject(
        headings,
      )};`)
    }
  }

  return transformer
}

const isImport = (child: Node): child is Literal => child.type === 'import'
const hasImports = (index: number) => index > -1;
const isExport = (child: Node): child is Literal => child.type === 'export'

const parseOptions: ParserOptions = {
  plugins: ['jsx'],
  sourceType: 'module',
};

const isTarget = (child: Literal, name: string) => {
  let found = false
  const ast = parse(child.value, parseOptions)
  traverse(ast, {
    VariableDeclarator: (path) => {
      if ((path.node.id as Identifier).name === name) {
        found = true;
      }
    },
  })
  return found
}

const getOrCreateExistingTargetIndex = (children: Node[], name: string) => {
  let importsIndex = -1
  let targetIndex = -1

  children.forEach((child, index) => {
    if (isImport(child)) {
      importsIndex = index
    } else if (isExport(child) && isTarget(child, name)) {
      targetIndex = index
    }
  })

  if (targetIndex === -1) {
    const target = createExportNode(`export const ${name} = [];`)

    targetIndex = hasImports(importsIndex) ? importsIndex + 1 : 0
    children.splice(targetIndex, 0, target)
  }

  return targetIndex
}

export default toc