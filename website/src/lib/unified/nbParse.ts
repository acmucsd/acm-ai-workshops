/**
 * conceptually works akin to `remark-parse` or `rehype-parse`:
 *  it's a unified plugin that converts a ipynb file
 *  into a syntax tree (specifically, a mdx one here)
 */

import type { Plugin } from 'unified';
import { fromNotebook } from './nbast-util-from-notebook';

export const nbParse: Plugin = function () {
  const parser = (doc: string) => {
    return fromNotebook(doc);
  };

  Object.assign(this, { Parser: parser });
}