import { useMemo, useCallback } from "react"
import { getMDXExport } from "mdx-bundler/client";

import defaultComponents from "@/mdx/components"

import type { DocPageProps } from "@/layout/pages/types"

interface UseMDXProps extends Pick<DocPageProps, 'code'> {}

export const useMDX = ({ code }: UseMDXProps) => {
  const { default: BaseComponent, toc } = useMemo(() => getMDXExport(code), [code])

  const MDXComponent = useCallback(({ components, ...props}) => (
    <BaseComponent components={{...defaultComponents, ...components}} {...props} />
  ), [BaseComponent])

  return { MDXComponent, toc }
}