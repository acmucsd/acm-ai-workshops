/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * license/docusaurus file in the root directory of the website source tree.
 */

import { memo } from "react";

import { useWindowSize } from "@/hooks/useWindowSize";
import DesktopSidebar from "./Desktop";
import MobileSidebar from "./Mobile";

import type { SidebarItem as SidebarItemType } from "@/lib/pipeline/sidebar/types";

export interface SidebarProps {
  items: SidebarItemType[];
  activePath: string;
}

const Sidebar = (props: SidebarProps): JSX.Element => {

  const windowSize = useWindowSize();  

  switch (windowSize) {
    case 'desktop': return <DesktopSidebar {...props} />
    case 'mobile': return <MobileSidebar {...props} />
    case 'ssr': return <DesktopSidebar {...props} />
  };
}

export default memo(Sidebar);
