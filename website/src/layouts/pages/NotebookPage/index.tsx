import { MDXRemote } from "next-mdx-remote";
import MDXComponents from "@/mdx/components";
import type { NotebookPageProps } from "@/pages/workshops/[...slug]";

const NotebookPage = ({ breadcrumb, source }: NotebookPageProps) => {
  return (
    <div style={{
      minHeight: "100vh",
      padding: "2rem",
    }}>
      <main>
        <MDXRemote {...source} components={MDXComponents} />
      </main>
    </div>
  );
}

export default NotebookPage;