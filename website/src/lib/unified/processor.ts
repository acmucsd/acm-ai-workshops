import { unified } from "unified";
import remarkStringify from "remark-stringify/lib";
import { nbParse } from "./nbParse";
import remarkMath from "remark-math";

export const notebookToMd = async (contents: string) => {
  const md = await unified()
    .use(nbParse)
    .use(remarkMath)
    .use(remarkStringify)
    .process(contents);
  return md;
}