/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-docusaurus file in the root directory of the website source tree.
 */

import SidebarItems from "./SidebarItems";

import s from "./styles.module.scss";

import type { SidebarProps } from ".";

const DesktopSidebar = ({ items, activePath }: SidebarProps): JSX.Element => {
  return (
    <nav className={s.desktop}>
      <ul className={s.items}>
        <SidebarItems items={items} activePath={activePath} />
      </ul>
    </nav>
  );
}

export default DesktopSidebar;