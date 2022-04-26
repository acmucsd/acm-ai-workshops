import { column, tocContainer } from "./styles.module.scss";

import type { ReactNode } from "react";

interface TocContainerProps {
  children: ReactNode
}

export default function TocContainer ({ children }: TocContainerProps) {
  return (
    <aside className={column}>
      <div className={tocContainer}>{children}</div>
    </aside>
  )
}