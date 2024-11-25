import { createContext, useContext } from "react";

import type { ReactNode } from "react";
import type { TocItem } from "@/lib/pipeline/toc/types";
import type { SidebarItem as SidebarItemType } from "@/lib/pipeline/sidebar/types";

type PageData = {
  sidebar?: SidebarItemType[]
  toc?: TocItem[]
}

const PageContext = createContext<PageData | undefined>(undefined);

export const usePageContext = () => {
  const context = useContext(PageContext)
  if (context === undefined) {
    throw new Error('usePageContext must be used in a PageProvider')
  }
  return context
}

interface PageProviderProps {
  toc?: TocItem[]
  sidebar?: SidebarItemType[]
  children: ReactNode
}

export default function PageProvider ({ sidebar, toc, children }: PageProviderProps) {
  return (
    <PageContext.Provider value={{ sidebar, toc }}>
      {children}
    </PageContext.Provider>
  )
}