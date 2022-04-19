import { column, container } from "./styles.module.scss";

import type { ReactNode } from "react";

interface SidebarContainerProps {
  children: ReactNode
}

export default function SidebarContainer ({ children }: SidebarContainerProps) {
  return (
    <aside className={column}>
      <div className={container}>
        {children}
      </div>
    </aside>
  )
}