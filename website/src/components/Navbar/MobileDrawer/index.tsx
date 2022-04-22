import c from "clsx"

import s from "./styles.module.scss"

import { Dispatch, ReactNode, SetStateAction, useState } from "react"

interface MobileDrawerProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  secondaryMenu?: ReactNode
  children: ReactNode
}

const MobileDrawer = ({ isOpen, setIsOpen, secondaryMenu, children }: MobileDrawerProps) => {
  const [menu, setMenu] = useState<'primary' | 'secondary'>(secondaryMenu ? 'secondary' : 'primary')

  return (
    <>
      <div
        className={c(s.backdrop, isOpen && s.backdropVisible)}
        role="presentation"
        onClick={() => { setIsOpen(false); }}
      />
      <div className={c(s.drawer, isOpen && s.show)}>
        <div className={c(s.panes, menu === 'secondary' && s.showSecondaryPane)}>
          <div className={s.pane}>
            <button
              className={s.switchPaneButton}
              onClick={() => { setMenu('secondary') }}
            >
                Go to secondary menu →
            </button>
            {children}
          </div>
          <div className={s.pane}>
            <button
              className={s.switchPaneButton}
              onClick={() => { setMenu('primary') }}
            >
              ← Back to primary menu
            </button>
            {secondaryMenu}
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileDrawer