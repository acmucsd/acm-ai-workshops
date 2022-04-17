/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-docusaurus file in the root directory of the website source tree.
 */

import React from "react";
import Link from "next/link";
import clsx from "clsx";

import Collapsible, { useCollapsible } from "@/components/Collapsible";
import SidebarItems from "./SidebarItems";

import styles from "./styles.module.scss";

import type { SidebarCategory as SidebarCategoryType, SidebarDoc as SidebarDocType, SidebarItem as SidebarItemType } from "@/lib/helpers/sidebar";
import { SidebarProps } from ".";

interface SidebarItemProps extends Omit<SidebarProps, 'items'>, React.AnchorHTMLAttributes<HTMLAnchorElement> {
  item: SidebarItemType
}

// given the current path `activePath` and sidebar item `item`,
// determines whether that sidebar item should be active
const isActiveSidebarItem = (item: SidebarItemType, activePath: string) => {
  // TODO
  return activePath.startsWith(item.href);
}

const SidebarCategory = ({ item, activePath, ...props }: SidebarItemProps): JSX.Element => {
  const { items, label, href } = item as SidebarCategoryType;

  const isActive = isActiveSidebarItem(item, activePath);
  const { collapsed, toggleCollapsed } = useCollapsible(!isActive);

  return (
    <li>
      <div className={styles.category}>
        {/* given we have sidebar, could instead just make these buttons that collapse the category maybe? */}
        <Link href={href}><a
          className={clsx(
            styles.link,
            isActive && styles.active,
          )}
          aria-expanded={!collapsed}
        >
          {label}
        </a></Link>
        <button
          className={clsx(
            styles.arrow,
            collapsed && styles.collapsed,
          )}
          aria-label={`toggle the sidebar category '${label}'`}
          onClick={(e) => {
            e.preventDefault();
            toggleCollapsed();
          }}
        />
      </div>
      <Collapsible
        className={styles.items}
        as="ul"
        collapsed={collapsed}
        lazy
      >
        <SidebarItems
          items={items}
          activePath={activePath}
          tabIndex={collapsed ? -1 : 0}
          {...props}
        />
      </Collapsible>
    </li>
  )
}

const SidebarDoc = ({ item, activePath, ...props }: SidebarItemProps) => {
  const { href, title } = item as SidebarDocType;
  const isActive = isActiveSidebarItem(item, activePath);

  return (
    <li>
      <Link href={href}><a
        className={clsx(
          styles.link,
          isActive && styles.active,
        )}
        {...props}
      >
        {title}
      </a></Link>
    </li>
  )
}

const SidebarItem = ({ item, ...props }: SidebarItemProps): JSX.Element => {
  switch (item.type) {
    case 'category':
      return <SidebarCategory item={item} {...props} />
    case 'doc':
      return <SidebarDoc item={item} {...props} />
  }
}

export default SidebarItem;