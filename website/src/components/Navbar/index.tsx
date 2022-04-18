import Link from "next/link"
import c from "clsx";

import { useWindowSize } from "@/hooks/useWindowSize";

import s from "./styles.module.scss"

const navLinks = [
  { href: '/workshops', label: 'Workshops' },
  { href: 'https://ai.acmucsd.com', label: 'Home' },
]

const Navbar = (): JSX.Element => {

  const size = useWindowSize()
  
  return (
    <nav className={s.navbar}>
      {/* logo */}
      <div className={s.left}>
        <Link href="/">
          <a className={s.logo}>
            <img src="/static/logo.svg" alt="ACM AI Logo" />
            <p>ACM AI Wiki</p>
          </a>
        </Link>
      </div>

      {/* desktop nav links */}
      <div className={c(
        s.right,
        size === 'mobile' && s.hidden,
      )}>
        {navLinks.map(({ href, label }) => (
          <Link key={label} href={href}>
            <a className={s.navItem}>{label}</a>
          </Link>
        ))}
        <Link href={"https://github.com/acmucsd/acm-ai-workshops"}>
          <a className={s.githubButton}>
            <img src="/static/github.svg" alt="GitHub" />
          </a>
        </Link>
      </div>

      {/* TODO - mobile nav links */}
    </nav>
  );
}

export default Navbar;