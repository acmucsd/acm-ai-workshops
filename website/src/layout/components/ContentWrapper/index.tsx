import c from "clsx";

import { usePageContext } from "@/layout/context/Page";

import s from "./styles.module.scss";

import type { ReactNode } from "react";

interface ContentWrapperProps {
  children: ReactNode
}

export default function ContentWrapper ({ children }: ContentWrapperProps) {
  const { sidebar } = usePageContext();

  return (
    <div className={c(s.contentWrapper, !!sidebar && s.hasSidebar)}>
      {children}
    </div>
  )
}