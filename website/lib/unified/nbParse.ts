import type { Plugin } from 'unified';
import { fromNotebook } from './nbast-util-from-notebook';

export const nbParse: Plugin = function () {
  const parser = (doc: string) => {
    return fromNotebook(doc);
  };

  Object.assign(this, { Parser: parser });
}