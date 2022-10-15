import { unified } from "unified";
import nbParse from "@/lib/unified/nb-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeHtmlToJsx from "./rehype-html-to-jsx";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";

import { passThrough } from "./utils/pass-through"
import astDebug from "./ast-debug";

/**
 * converts a jupyter notebook string into a markdown string
 * @param contents jupyter notebook string
 * @returns converted markdown string
 */
export const notebookToMd = async (contents: string) => (
  (await unified()
    .use(nbParse)
    .use(remarkGfm)                                   // recognize strikethroughs and stuff
    .use(remarkMath)                                  // recognize math
    .use(remarkRehype, {                              // convert to html ast - this makes it easier to manipulate the html nodes
      allowDangerousHtml: true,                       // preserve raw html from the markdown
      passThrough: ['math','inlineMath'],             // don't transform latex
    })
    .use(rehypeRaw, {                                 // parse the raw html into the tree
      passThrough: ['math','inlineMath'],             // don't transform latex
    })
    .use(rehypeKatex)                                 // recognize math
    .use(rehypeHtmlToJsx)                             // updates properties from html properties to react ("jsx") properties
    .use(rehypeRemark, {                              // convert back to markdown ast
      handlers: {
        math: passThrough, inlineMath: passThrough,           // don't do anything with latex
        raw: (h, n) => h(n, 'html', n.value),                 // restore html nodes made from `rehype-html-to-jsx`
        comment: (h, n) => h(n, 'html', `{/*${n.value}*/}`),  // convert html comments to jsx ones
      },
    })
    .use(remarkStringify, {                           // stringify the markdown ast
      resourceLink: true                              // convert autolink syntax `<https://google.com>` to regular links `[https://google.com](https://google.com)`
    })
    .process(contents)
  ).toString()
)