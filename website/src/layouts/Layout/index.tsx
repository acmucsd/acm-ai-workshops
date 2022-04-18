import { ReactNode } from "react";
import c from "clsx";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import s from "./styles.module.scss";

import type { SidebarItem as SidebarItemType } from "@/lib/helpers/sidebar";

interface LayoutProps {
  sidebar: SidebarItemType[];
  path: string;
  className?: string;
  children?: ReactNode;
}

const Layout = ({ sidebar, path, className, children }: LayoutProps): JSX.Element => {
  
  return (
    <>
      <Navbar />
      <div className={s.wrapper}>
        <aside className={s.sidebarContainer}>
          <Sidebar items={sidebar} activePath={path} />
        </aside>
        <main className={s.contentWrapper}>
          <div className={c(s.contentContainer, className)}>
            {children}
          </div>
        </main>
      </div>
    </>
  )
}

export default Layout;