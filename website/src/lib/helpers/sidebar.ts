import { slugToHref } from "@/lib/utils/slugToHref";
import { getFsTree } from "./fs-tree";

import type {
  Options as FsTreeOptions,
  VDir,
  VEntry,
  VFile,
} from "./fs-tree";

export type SidebarDoc = {
  type: 'doc';
  href: string;
  title: string;
}
export type SidebarCategory = {
  type: 'category';
  href: string;
  label: string;
  items: SidebarItem[];
}
export type SidebarItem = SidebarDoc | SidebarCategory

type SidebarsCacheKey = `${string}$$${string}`
const sidebars: Map<SidebarsCacheKey, SidebarItem[]> = new Map();

type Options = FsTreeOptions & {
  baseUrl?: string
}
export const getSidebar = async ({ baseUrl = '', ...opts }: Options) => {
  const key: SidebarsCacheKey = `${baseUrl}$$${opts.basePath}`
  if (sidebars.has(key)) {
    return sidebars.get(key);
  }
  
  const tree = await getFsTree(opts);

  const buildSidebar = (obj: VEntry): SidebarItem => {
    // base case - a "leaf" (ie a file). directly extract the slug and title
    if (isVFile(obj)) {
      const { slug, title } = obj as VFile;
      const href = slugToHref(slug, baseUrl);
      const label = getSidebarDocLabel({ slug, title })

      const doc: SidebarDoc = { type: 'doc', href, title };
      return doc;
    }

    // internal node (ie a directory/category). extract the slug, derive a labels

    const { slug, fsPath } = obj as VDir;
    const href = slugToHref(slug, baseUrl);
    const label = getSidebarCategoryLabel({ slug, fsPath });

    const category: SidebarCategory = {
      type: 'category',
      href,
      label,
      items: Object.values(obj.items).map(buildSidebar),
    }
    return category;
  }

  const sidebar = Object.values((tree as VDir).items).map(buildSidebar);

  // cache the sidebar
  sidebars.set(key, sidebar);

  return sidebar;
}

const isVFile = (obj: VEntry): obj is VFile => obj.type === 'file';

/**
 * gets the label for a sidebar doc
 * @param args TODO
 * @param args.slug TODO
 * @param args.title TODO
 * @returns TODO
 */
const getSidebarDocLabel = ({ slug, title }: { slug: string[], title: string }) => {
  // currently very basic - just takes the file title.
  return title;
}

/**
 * gets the label for a sidebar category
 * @param args TODO
 * @param args.slug TODO
 * @param args.fsPath TODO
 * @returns TODO
 */
const getSidebarCategoryLabel = ({ slug, fsPath }: { slug: string[], fsPath: string[] }) => {
  // currently very basic - just takes the directory name.
  return fsPath[fsPath.length - 1];
}