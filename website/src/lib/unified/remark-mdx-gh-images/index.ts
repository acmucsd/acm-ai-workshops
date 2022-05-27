/**
 * Copyright (c) Remco Haszing.
 *
 * This source code is licensed under the MIT license found in the
 * license/remark-mdx-images file in the root directory of the website source tree.
 */

import { visit } from 'unist-util-visit';

import type { Plugin, Transformer } from 'unified';
import type { Parent } from 'unist';
import type { MdxjsEsm, MdxJsxTextElement } from 'mdast-util-mdx';
import type { Image } from 'mdast';

interface RemarkMdxGhImagesOptions {
  /**
   * By default imports are resolved relative to the markdown file. This matches default markdown
   * behaviour. If this is set to false, this behaviour is removed and URLs are no longer processed.
   * This allows to import images from `node_modules`. If this is disabled, local images can still
   * be imported by prepending the path with `./`.
   *
   * @default true
   */
  resolve?: boolean;
}

const urlPattern = /^(https?:)?\//;
const relativePathPattern = /\.\.?\//;

const ghImageRegex = /^(?<url>.*)#gh-(?<mode>light|dark)-mode-only$/

/**
 * A Remark plugin for converting Markdown images to MDX images using imports for the image source.
 * this fork of it also parses "github-style" images, i.e. images with a url ending in `#gh-light-mode-only` or `#gh-dark-mode-only`
 */
const remarkMdxGhImages: Plugin<[RemarkMdxGhImagesOptions?]> =
  ({ resolve = true } = {}) => {
    
  const transformer: Transformer = (mdast) => {
    const imports: Omit<MdxjsEsm, 'value'>[] = [];
    const imported = new Map<string, string>();

    const visitor = (node: Image, index: number, parent: Parent) => {
      let { alt = null, title, url } = node;
      if (urlPattern.test(url)) {
        return;
      }
      if (!relativePathPattern.test(url) && resolve) {
        url = `./${url}`;
      }

      const ghImageMatch = url.match(ghImageRegex)
      const isGhImage = !!ghImageMatch

      url = isGhImage ? ghImageMatch!.groups!.url : url

      let name = imported.get(url);
      if (!name) {
        name = `__${imported.size}_${url.replace(/\W/g, '_')}__`;

        imports.push({
          type: 'mdxjsEsm',
          data: {
            estree: {
              type: 'Program',
              sourceType: 'module',
              body: [
                {
                  type: 'ImportDeclaration',
                  source: { type: 'Literal', value: url, raw: JSON.stringify(url) },
                  specifiers: [
                    {
                      type: 'ImportDefaultSpecifier',
                      local: { type: 'Identifier', name },
                    },
                  ],
                },
              ],
            },
          },
        });
        imported.set(url, name);
      }

      const textElement: MdxJsxTextElement = {
        type: 'mdxJsxTextElement',
        name: 'img',
        children: [],
        attributes: [
          { type: 'mdxJsxAttribute', name: 'alt', value: alt },
          {
            type: 'mdxJsxAttribute',
            name: 'src',
            value: {
              type: 'mdxJsxAttributeValueExpression',
              value: name,
              data: {
                estree: {
                  type: 'Program',
                  sourceType: 'module',
                  comments: [],
                  body: [{ type: 'ExpressionStatement', expression: { type: 'Identifier', name } }],
                },
              },
            },
          },
          // @ts-ignore
          ...(isGhImage ? [{
            type: 'mdxJsxAttribute',
            name: 'className',
            value: ghImageMatch!.groups!.mode === 'light' ? 'light-mode-only' : 'dark-mode-only'
          }] : [])
        ],
      };
      if (title) {
        textElement.attributes.push({ type: 'mdxJsxAttribute', name: 'title', value: title });
      }
      (parent as Parent).children.splice(index, 1, textElement);
    }

    visit(mdast, 'image', visitor);
    (mdast as Parent).children.unshift(...imports);
  };

  return transformer
}

export default remarkMdxGhImages