import s from "./styles.module.scss";

import type { ReactNode } from "react";

interface MainWrapperProps {
  children: ReactNode;
}

export default function MainWrapper ({ children }: MainWrapperProps)  {
  return (
    <div className={s.wrapper}>
      {children}
    </div>
  )
}