import Link from "next/link"
import { useWindowSize } from "@/hooks/useWindowSize";

import styles from "./styles.module.scss"
import clsx from "clsx";

const navLinks = [
  { href: '/workshops', label: 'Workshops' },
  { href: 'https://ai.acmucsd.com', label: 'Home' },
]

const Navbar = (): JSX.Element => {

  const size = useWindowSize()
  
  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.left}>
        <Link href="/">
          <a className={styles.logo}>
            <img src="/static/logo.svg" alt="ACM AI Logo" />
            <p>ACM AI Wiki</p>
          </a>
        </Link>
      </div>

      {/* Desktop Nav Links */}
      <div className={clsx(
        styles.right,
        size === 'mobile' && styles.hidden,
      )}>
        {navLinks.map(({ href, label }) => (
          <Link key={label} href={href}>
            <a className={styles.navItem}>{label}</a>
          </Link>
        ))}
        <Link href={"https://github.com/acmucsd/acm-ai-workshops"}>
          <a className={styles.githubButton}>
            <img src="/static/github.svg" alt="GitHub" />
          </a>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;