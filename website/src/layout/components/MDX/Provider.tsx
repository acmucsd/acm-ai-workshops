import { createContext, useContext } from "react";

import { useMDX } from "./useMDX";

import type { FC, ReactNode } from "react";
import type { DocPageProps } from "@/layout/pages/types";
import type { TocItem } from "@/lib/unified/toc/types";

type MDXData = {
  MDXComponent: FC<MDXProviderProps>
  toc: TocItem[]
}

const MDXContext = createContext<MDXData | undefined>(undefined);

export const useMdxContext = () => {
  const context = useContext(MDXContext)
  if (context === undefined) {
    throw new Error('useMDXContext must be used in a MDXProvider')
  }
  return context
}

interface MDXProviderProps extends Pick<DocPageProps, 'code'> {
  children: ReactNode
}

export default function MDXProvider ({ children, ...props }: MDXProviderProps) {
  const { MDXComponent, toc } = useMDX(props)

  return (
    <MDXContext.Provider value={{ MDXComponent, toc }}>
      {children}
    </MDXContext.Provider>
  )
}