import { createContext, useContext } from "react";

import { useMDX } from "./useMDX";

import type { FC, ReactNode } from "react";
import type { MDXComponentProps } from "./useMDX";

type MDXData = {
  MDXComponent: FC<MDXComponentProps>
}

const MDXContext = createContext<MDXData | undefined>(undefined);

export const useMDXContext = () => {
  const context = useContext(MDXContext)
  if (context === undefined) {
    throw new Error('useMDXContext must be used in a MDXProvider')
  }
  return context
}

interface MDXProviderProps {
  source: string
  children: ReactNode
}

export default function MDXProvider ({ children, ...props }: MDXProviderProps) {
  const { MDXComponent } = useMDX(props)

  return (
    <MDXContext.Provider value={{ MDXComponent }}>
      {children}
    </MDXContext.Provider>
  )
}