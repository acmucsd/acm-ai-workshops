import type { MDXRemoteSerializeResult } from "next-mdx-remote";

import type { SidebarItem as SidebarItemType } from "@/lib/helpers/sidebar";

export type Doc = {
  type: 'doc';
  title: string;
  description?: string;
  href: string;
}

export type Category = {
  type: Doc['category'];
  title: string;
  description?: string;
  href: string;
}

export type Item = Doc | Category;

export interface WithSidebar {
  sidebar: SidebarItemType[];
}

export interface WithBreadcrumbs {
  breadcrumb: string[];
  sidebar: SidebarItemType[];
}

export interface WithPath {
  path: string;
}

export interface CommonPageProps extends WithSidebar, WithBreadcrumbs {}

export interface DocPageProps extends CommonPageProps {
  type: Doc['type'];
  title: string;
  code: string;
}

export interface CategoryPageProps extends CommonPageProps {
  type: 'category';
  items: Array<Item>
}

export type PageProps = DocPageProps | CategoryPageProps;