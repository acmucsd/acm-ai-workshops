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

export interface DocPageProps extends WithSidebar, WithBreadcrumbs {
  type: Doc['type'];
  title: string;
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
}

export interface CategoryPageProps extends WithSidebar, WithBreadcrumbs {
  type: 'category';
  items: Array<Item>
}

export type PageProps = DocPageProps | CategoryPageProps;