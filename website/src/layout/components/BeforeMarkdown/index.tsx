import s from "./styles.module.scss";

import type { ReactNode } from "react"

interface BeforeMarkdownProps {
  children: ReactNode
}

const BeforeMarkdown = ({ children }: BeforeMarkdownProps) => {
  return (
    <div className={s.wrapper}>
      {children}
    </div>
  )
}

export default BeforeMarkdown