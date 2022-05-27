import { slugToHref } from "@/utils/slugToHref";
import { getFsTree } from "@/lib/pipeline/fs-tree";

import type {
  Options as FsTreeOptions,
} from "@/lib/pipeline/fs-tree";

import type { FsEntry } from "@/lib/pipeline/fs-tree/types"
import type { SidebarCategory, SidebarDoc, SidebarItem } from "./types";

type SidebarsCacheKey = `${string}$$${string}`
const sidebars: Map<SidebarsCacheKey, SidebarItem[]> = new Map();

type Options = FsTreeOptions & {
  basePath: FsTreeOptions['basePath']
  baseUrl?: `/${string}`
}

/**
 * constructs the sidebar for a given FS tree
 * @param opts options for constructing the sidebar
 * @param opts.baseUrl the base url for all links in the constructed sidebar
 * @see {@link getFsTree} for details on the other options
 * @returns an array of possibly nested sidebar items
 */
export const getSidebar = async ({ baseUrl, ...opts }: Options) => {
  const key: SidebarsCacheKey = `${baseUrl}$$${opts.basePath}`
  if (sidebars.has(key)) { return sidebars.get(key) }
  
  const tree = await getFsTree(opts);

  const buildSidebar = (obj: FsEntry): SidebarItem => {
    const { slug, title } = obj
    const href = slugToHref(slug, baseUrl)

    const commonFields = { href, label: title }

    switch (obj.type) {
      // base case - a "leaf" (ie a file)
      case 'file': {
        const doc: SidebarDoc = { type: 'doc', ...commonFields };
        return doc;
      }
      // internal node (ie a directory/category). extract the slug, derive a labels
      case 'directory': {
        const items = Object.values(obj.items).map(buildSidebar)
        const category: SidebarCategory = { type: 'category', items, ...commonFields }
        return category;
      }
    }
  }
  const sidebar = Object.values(tree.items).map(buildSidebar);

  // cache the sidebar
  sidebars.set(key, sidebar);

  return sidebar;
}