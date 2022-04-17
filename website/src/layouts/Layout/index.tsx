import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import styles from "./styles.module.scss";
import type { SidebarItem as SidebarItemType } from "@/lib/helpers/sidebar";
import Navbar from "@/components/Navbar";
import clsx from "clsx";

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
    <div className={styles.wrapper}>
      <aside className={styles.sidebarContainer}>
        <Sidebar items={sidebar} activePath={path} />
      </aside>
      <main className={styles.contentWrapper}>
        <div className={clsx(styles.contentContainer, className)}>
          {children}
        </div>
      </main>
    </div>
    </>
  )
}

export default Layout;