import { SidebarProps } from "..";
import SidebarItems from "../SidebarItems";
import styles from "./styles.module.scss";
import sidebarItemsStyles from "../styles.module.scss";

const DesktopSidebar = ({ items, activePath }: SidebarProps): JSX.Element => {
  return (
    <nav className={styles.sidebar}>
      <ul className={sidebarItemsStyles.items}>
        <SidebarItems items={items} activePath={activePath} />
      </ul>
    </nav>
  );
}

export default DesktopSidebar;