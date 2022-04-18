import { fromNotebook } from './nbast-util-from-notebook';

import type { Plugin } from 'unified';

/**
 * unified plugin to convert ipynb files into an mdx syntax tree
 */
export const nbParse: Plugin = function () {
  const parser = (doc: string) => {
    return fromNotebook(doc);
  };

  Object.assign(this, { Parser: parser });
}