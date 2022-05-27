type SidebarItemCommon = {
  href: string;
  label: string;
}
export type SidebarDoc = SidebarItemCommon & {
  type: 'doc';
}
export type SidebarCategory = SidebarItemCommon & {
  type: 'category';
  items: SidebarItem[];
}
export type SidebarItem = SidebarDoc | SidebarCategory