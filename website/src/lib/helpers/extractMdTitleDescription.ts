import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

export const extractTitleDescriptionFromMdString = async (md: string) => {

  // expect the first two children to be an h1 heading (the title), and a paragraph (the description)
  const mdast = fromMarkdown(md);
  const { children } = mdast;
  const titleNode = children?.[0]
  const descriptionNode = children?.[1];

  // converts a markdown string into html
  const asHtml = async (contents: string) => (await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(contents)
  ).toString()

  // converts the wrapping tag of html into a span
  const asSpan = (html: string) => html.replace(/^<(.*)>(.*?)<\/\1>$/, '<span>$2</span>')
  
  // get title
  const title = (titleNode.type === 'heading' && titleNode.depth === 1)
    ? asSpan(await asHtml(toMarkdown(titleNode)))
    : undefined
  ;

  // get description
  const description = (descriptionNode.type === 'paragraph')
    ? asSpan(await asHtml(toMarkdown(descriptionNode)))
    : undefined
  ;

  return { title, description }
}