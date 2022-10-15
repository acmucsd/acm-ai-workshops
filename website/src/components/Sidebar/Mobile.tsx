/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * license/docusaurus file in the root directory of the website source tree.
 */

 import c from "clsx";

 import SidebarItems from "./SidebarItems";
 
 import { markdown } from "@/mdx/markdown.module.scss";
 import s from "./styles.module.scss";
 
 import type { SidebarProps } from ".";
 
 const MobileSidebar = ({ items, activePath }: SidebarProps): JSX.Element => {
  return (
    <ul className={c(s.items, markdown)}>
      <SidebarItems items={items} activePath={activePath} />
    </ul>
  );
 }
 
 export default MobileSidebar;