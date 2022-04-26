import c from "clsx";
import type { MouseEventHandler } from "react";

import { iconSize as iconSizeString } from "./_exports.module.scss";
import s from "./styles.module.scss"


interface MobileMenuButtonProps {
  isOpen?: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
  className?: string
}

const MobileMenuButton = ({ isOpen, onClick, className }: MobileMenuButtonProps) => {
  return (
    <button
      type="button"
      title={isOpen ? 'Close menu' : 'Open menu'}
      className={c(s.button, className)}
      onClick={onClick}
    >
      <span className={s.icon} aria-hidden="true">
        <svg
          className={c(s.hamburgerIcon, isOpen ? s.closed : s.open)}
          width={iconSizeString}
          height={iconSizeString}
          viewBox="0 0 32 32"
        >
          <path d="M4 24V22H28V24ZM4 17V15H28V17ZM4 10V8H28V10Z" />
        </svg>
      </span>
      <span className={s.icon} aria-hidden="true">
        <svg
          className={c(s.closeIcon, isOpen ? s.open : s.closed)}
          width={iconSizeString}
          height={iconSizeString}
          viewBox="0 0 32 32"
        >
          <path d="M8.3 25.1 6.9 23.7 14.6 16 6.9 8.3 8.3 6.9 16 14.6 23.7 6.9 25.1 8.3 17.4 16 25.1 23.7 23.7 25.1 16 17.4Z"/>
        </svg>
      </span>
    </button>
  )
}

export default MobileMenuButton