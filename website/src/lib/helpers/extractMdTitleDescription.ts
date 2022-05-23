import { fromMarkdown } from "mdast-util-from-markdown";
import { math } from "micromark-extension-math";
import { gfm } from "micromark-extension-gfm";
import { mathFromMarkdown } from "mdast-util-math";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { toValue } from "@/lib/helpers/toc/utils";

export const extractTitleDescriptionFromMdString = async (md: string) => {

  // expect the first two children to be an h1 heading (the title), and a paragraph (the description)
  const mdast = fromMarkdown(md, 'utf-8', {
    extensions: [math(), gfm()],
    mdastExtensions: [mathFromMarkdown(), gfmFromMarkdown()],
  });
  const { children } = mdast;
  const titleNode = children?.[0]
  const descriptionNode = children?.[1];
  
  const wrapSpan = (html: string) => `<span>${html}</span>`

  // get title
  const title = (titleNode.type === 'heading' && titleNode.depth === 1)
    ? wrapSpan(toValue(titleNode))
    : undefined
  ;

  // get description
  const description = (descriptionNode.type === 'paragraph')
    ? wrapSpan(toValue(descriptionNode))
    : undefined
  ;

  return { title, description }
}