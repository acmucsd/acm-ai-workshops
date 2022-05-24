import { useMemo, useCallback } from "react";
import { ComponentMap, getMDXExport } from "mdx-bundler/client";

import defaultComponents from "@/mdx/components";

import type { FC } from "react";

interface UseMDXProps {
  source: string
}

export interface MDXComponentProps {
  components?: ComponentMap
}

export function useMDX ({ source }: UseMDXProps) {
  const { default: BaseComponent } = useMemo(() => getMDXExport(source), [source])

  const MDXComponent: FC<MDXComponentProps> = useCallback(({ components, ...props}) => (
    <BaseComponent components={{...defaultComponents, ...components}} {...props} />
  ), [BaseComponent])

  return { MDXComponent }
}