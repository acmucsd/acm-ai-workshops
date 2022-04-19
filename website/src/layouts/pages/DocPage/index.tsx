import { MDXRemote } from "next-mdx-remote";
import c from "clsx";

import MDXComponents from "@/mdx/components";

import { markdown, content } from "@/mdx/markdown.module.scss";

import type { DocPageProps } from "../types";

const DocPage = ({ breadcrumb, source }: DocPageProps) => {
  return (
    <article className={c(markdown, content)}>
      <MDXRemote {...source} components={MDXComponents} />
    </article>
  );
}

export default DocPage;