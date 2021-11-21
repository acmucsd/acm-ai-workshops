import React from "react";
import rehypeReact from "rehype-react/lib";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify/lib";
import { unified } from "unified";
import { nbParse } from "./nbParse";

export const processor = unified()
  .use(nbParse)
  .use(remarkStringify)
  .use(remarkRehype)
  .use(rehypeReact, { createElement: React.createElement })


export const notebookToMd = (notebook: string) => {
  const md = unified()
    .use(nbParse)
    .use(remarkStringify)
    .processSync(notebook);
  return md;
}