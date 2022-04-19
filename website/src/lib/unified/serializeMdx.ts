import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/**
 * serializes md string contents into a MDX component string to be loaded in MDXRemote
 * @param contents the md string to serialize
 */
export const serializeMdx = async (contents: string) => {
  return await serialize(contents, {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeKatex],
    },
  });
}