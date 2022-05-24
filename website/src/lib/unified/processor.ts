import { unified } from "unified";
import { nbParse } from "./nbParse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkHtmlToJsx from "./remark-html-to-jsx";
import remarkStringify from "remark-stringify/lib";

import astDebug from "./ast-debug";

/**
 * converts a jupyter notebook string into a markdown string
 * @param contents jupyter notebook string
 * @returns converted markdown string
 */
export const notebookToMd = async (contents: string) => {
  const md = await unified()
    .use(nbParse)           // parse notebook as md
    .use(remarkGfm)         // recognize strikethroughs and stuff
    .use(remarkMath)        // recognize math
    .use(remarkHtmlToJsx)   // reformat html to JSX html
    .use(remarkStringify, { // stringify to markdown string
      resourceLink: true,   // use resource links `[https://google.com](https://google.com)` vs autolinked literals `<https://google.com>`
    })
    .process(contents);
  return md;
}