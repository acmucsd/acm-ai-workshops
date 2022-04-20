import c from "clsx";

import { markdown, content } from "@/mdx/markdown.module.scss";

import type { ReactNode } from "react";

interface MarkdownWrapperProps {
  children: ReactNode
}

export default function MarkdownWrapper ({ children }: MarkdownWrapperProps) {
  return (
    <article className={c(markdown, content)}>
      {children}
    </article>
  )
}