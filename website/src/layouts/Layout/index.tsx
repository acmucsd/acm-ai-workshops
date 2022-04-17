import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import styles from "./styles.module.scss";
import type { SidebarItem as SidebarItemType } from "@/lib/helpers/sidebar";

interface LayoutProps {
  sidebar: SidebarItemType[];
  path: string;
  children?: ReactNode;
}

const Layout = ({ sidebar, path, children }: LayoutProps): JSX.Element => {
  
  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebarContainer}>
        <Sidebar items={sidebar} activePath={path} />
      </aside>
      <main className={styles.contentWrapper}>
        <div className={styles.contentContainer}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout;