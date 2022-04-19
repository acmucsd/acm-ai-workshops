import s from "./styles.module.scss";

import type { ReactNode } from "react";

interface ContentWrapperProps {
  children: ReactNode
}

export default function ContentWrapper ({ children }: ContentWrapperProps) {
  return (
    <div className={s.contentWrapper}>
      {children}
    </div>
  )
}