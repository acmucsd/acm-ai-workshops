import { useEffect, useState } from "react";
import Link from "next/link"

import { useWindowSize } from "@/hooks/useWindowSize";
import MobileSidebar from "@/components/Sidebar/Mobile";
import MobileMenuButton from "./MobileMenuButton";
import MobileDrawer from "./MobileDrawer";

import s from "./styles.module.scss"

import type { WindowSize } from "@/hooks/useWindowSize";
import type { SidebarItem } from "@/lib/helpers/sidebar";

const navLinks: SidebarItem[] = [
  { type: 'doc', href: '/workshops', label: 'Workshops' },
  { type: 'doc', href: 'https://ai.acmucsd.com', label: 'Home' },
]

const useMobileMenu = (size: WindowSize) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (size !== 'mobile') {
      setIsOpen(false);
    }
  }, [size])

  return { isOpen, setIsOpen }
}

interface NavbarProps {
  sidebar?: SidebarItem[]
  path: string
}

const Navbar = ({ sidebar, path }: NavbarProps): JSX.Element => {
  const size = useWindowSize()
  const { isOpen, setIsOpen } = useMobileMenu(size);
  
  return (
    <nav className={s.navbar}>

      {/* the actual navbar row */}
      <div className={s.row}>
        {/* logo */}
        <div className={s.left}>
          <Link href="/">
            <a className={s.logo}>
              <img src="/static/logo.svg" alt="ACM AI Logo" />
              <p>ACM AI Wiki</p>
            </a>
          </Link>
        </div>

        {/* desktop nav items */}
        <div className={s.right}>
          {navLinks.map(({ href, label }) => (
            <Link key={label} href={href}>
              <a className={s.navItem}>{label}</a>
            </Link>
          ))}
          <Link href={"https://github.com/acmucsd/acm-ai-workshops"}><a>
            <img src="/static/github.svg" alt="GitHub" />
          </a></Link>
        </div>

        {/* mobile hamburger menu button */}
        <MobileMenuButton
          className={s.mobileMenuButton}
          isOpen={isOpen}
          onClick={() => { setIsOpen((x) => !x) }}
        />
      </div>

      {/* mobile navbar + sidebar */}
      {size !== 'mobile' ? null : (
        <MobileDrawer
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          // this goes in the "secondary" menu of the mobile navbar menu
          secondaryMenu={sidebar === undefined
            ? undefined
            : <MobileSidebar items={sidebar} activePath={path} />
          }
        >
          {/* all of these go in the "primary" menu of the mobile navbar menu */}

          {/* navbar items */}
          <MobileSidebar items={navLinks} activePath="" />
          
          {/* row of icons at the bottom */}
          <div className={s.mobileNavbarIcons}>
            <Link href={"https://github.com/acmucsd/acm-ai-workshops"}><a>
              <img src="/static/github.svg" alt="GitHub" />
            </a></Link>
          </div>
        </MobileDrawer>
      )}
    </nav>
  );
}

export default Navbar;