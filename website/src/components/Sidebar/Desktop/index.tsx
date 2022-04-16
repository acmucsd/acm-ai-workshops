/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-docusaurus file in the root directory of the website source tree.
 */

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