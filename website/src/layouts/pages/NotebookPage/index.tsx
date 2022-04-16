import { MDXRemote } from "next-mdx-remote";
import MDXComponents from "@/mdx/components";
import type { NotebookPageProps } from "@/pages/workshops/[...slug]";

const NotebookPage = ({ breadcrumb, source }: NotebookPageProps) => {
  return (
    <article>
      <MDXRemote {...source} components={MDXComponents} />
    </article>
  );
}

export default NotebookPage;