/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * license/docusaurus file in the root directory of the website source tree.
 */

import SidebarItem from "./SidebarItem";

import type { SidebarItem as SidebarItemType } from "@/lib/pipeline/sidebar/types";
import type { SidebarProps } from ".";

const SidebarItems = ({ items, ...props }: SidebarProps): JSX.Element => {
  return (
    <>
      {items.map((item: SidebarItemType, i: number) => (
        <SidebarItem
          key={i} // sidebar is static, the index does not change
          item={item}
          {...props}
        />
      ))}
    </>
  );
}

export default SidebarItems;