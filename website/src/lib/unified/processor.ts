import { unified } from "unified";
import remarkGfm from "remark-gfm";
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
    .use(nbParse)         // parse notebook as md
    .use(remarkGfm)       // recognize strikethroughs and stuff
    .use(remarkMath)      // recognize math
    .use(remarkStringify) // stringify to markdown string
    .process(contents);
  return md;
}