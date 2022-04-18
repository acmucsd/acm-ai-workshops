import { unified } from "unified";
import remarkMath from "remark-math";
import remarkStringify from "remark-stringify/lib";

import { nbParse } from "./nbParse";

/**
 * converts a jupyter notebook string into a markdown string
 * @param contents jupyter notebook string
 * @returns converted markdown string
 */
export const notebookToMd = async (contents: string) => {
  const md = await unified()
    .use(nbParse)
    .use(remarkMath)
    .use(remarkStringify)
    .process(contents);
  return md;
}