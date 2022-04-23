import c from "clsx";

import { usePageContext } from "@/layout/context/Page";

import s from "./styles.module.scss";

import type { ReactNode } from "react";

interface ContentContainerProps {
  children: ReactNode
}

export default function ContentContainer ({ children }: ContentContainerProps) {
  const { toc } = usePageContext()

  return (
    <div className={c(s.contentContainer, !!toc && s.tocExists)}>
      {children}
    </div>
  )
}