import s from "./styles.module.scss";

import type { ReactNode } from "react";

interface ContentContainerProps {
  children: ReactNode
}

export default function ContentContainer ({ children }: ContentContainerProps) {
  return (
    <div className={s.contentContainer}>
      {children}
    </div>
  )
}