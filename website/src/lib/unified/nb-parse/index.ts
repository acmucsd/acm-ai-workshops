import { fromIpynb } from '@/lib/unified/nbast-util-from-ipynb';

import type { Plugin } from 'unified';

/**
 * unified plugin to convert ipynb files into an mdx syntax tree
 */
const nbParse: Plugin = function () {
  const parser = (doc: string) => {
    return fromIpynb(doc);
  };

  Object.assign(this, { Parser: parser });
}

export default nbParse;