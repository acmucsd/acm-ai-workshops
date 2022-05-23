import { useCallback, createElement, Fragment, useState, useEffect } from "react"

import defaultComponents from "@/markdown/components";

import { unified } from "unified";
import remarkParse from "remark-parse/lib";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeReact from "rehype-react";
import remarkHeadingIds from "@/lib/unified/heading-ids";

import type { FC, ReactElement, ReactNode } from "react";
import astDebug from "@/lib/unified/ast-debug";

interface MarkdownComponentProps {
  fallback?: ReactNode
}

export const useMarkdown = (source: string) => {
  const [markdownReactElement, setMarkdownReactElement] = useState<ReactElement | null>(null)

  // @ts-ignore TODO: dunno what's going on here with typescript
  const MarkdownComponent: FC<MarkdownComponentProps> = useCallback(({ fallback = null }) => markdownReactElement ?? fallback, [markdownReactElement])

  const setSource = useCallback((source: string) => {
    unified()
      .use(remarkParse)
      .use(remarkHeadingIds)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeKatex)
      .use(rehypeReact, { createElement, Fragment, components: defaultComponents })
      .process(source)
      .then((vfile) => setMarkdownReactElement(vfile.result as ReactElement))
      .catch(console.error)
  }, [])

  // in this case, we know our source never changes, so we can just directly return the generated component
  // in practice, would return both the component and a function to set the source (i.e. the above return statement) and not have the below effect here
  //  if we were building e.g. a WYSIWYG editor: we don't always want the component to directly update (e.g. someone is in the middle of typing),
  //  and in that case being able to decide when to actually update the "source" is useful
  useEffect(() => {
    setSource(source)
  }, [source])

  return {
    setSource,
    markdownReactElement,
    MarkdownComponent,
  }
}
