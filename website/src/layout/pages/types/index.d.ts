import type { MDXRemoteSerializeResult } from "next-mdx-remote";

import type { SidebarItem as SidebarItemType } from "@/lib/pipeline/sidebar";
import { TocItem } from "@/lib/pipeline/toc/types";

export type Doc = {
  type: 'doc';
  title: string;
  description?: string;
  href: string;
  fsPath: string[];
}

export type Category = {
  type: 'category';
  title: string;
  description?: string;
  href: string;
  fsPath: string[];
}

export type Item = Doc | Category;

export interface WithSidebar {
  sidebar: SidebarItemType[];
}

export interface WithSlug {
  slug: string[];
}

export interface WithPath {
  path: string;
}

export interface WithFsPath {
  fsPath: string[];
}

export interface WithToc {
  toc: TocItem[];
}

export interface CommonPageProps extends WithSidebar, WithSlug, WithFsPath, WithToc { }

export interface DocPageProps extends CommonPageProps {
  type: Doc['type'];
  title: string;
  source: string;
}

export interface CommonCategoryPageProps extends WithSidebar, WithSlug, WithFsPath {
  type: Category['type'];
}
export interface CategoryIndexPageProps extends CommonCategoryPageProps {
  subtype: 'index';
  items: Item[];
}
export interface CategoryReadmePageProps extends CommonCategoryPageProps, WithToc {
  subtype: 'readme';
  source: string;
}
export type CategoryPageProps =
  | CategoryIndexPageProps
  | CategoryReadmePageProps

export type PageProps = DocPageProps | CategoryPageProps;