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

export const notebookToMd = async (contents: string) => {
  const md = await unified()
    .use(nbParse)
    .use(remarkStringify)
    .process(contents);
  return md;
}