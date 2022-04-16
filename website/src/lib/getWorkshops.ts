import fs from 'fs/promises';
import path from 'path';
import glob from 'glob';
import { promisify } from 'util';
import { notebookToMd } from './unified/processor';
import { des } from './serde';

const WORKSHOPS_ROOT_DIR = path.join(process.cwd(), '..');

interface VFile extends VEntryCommon {
  type: 'file';
  title: string;
  md: string;
}
interface VDir extends VEntryCommon {
  type: 'directory';
  items: Record<string, VEntry>;
}
interface VEntryCommon {
  slug: string[];
  fsPath: string[];
}
interface VRoot {
  type: 'root';
  items: Record<string, VEntry>;
}
type VEntry = VFile | VDir;

const ipynbExtensionRegex = /\.ipynb$/i

const slugifyFsPath = (fsPath: string | string[]) => {
  if (!Array.isArray(fsPath)) {
    fsPath = fsPath.split(path.sep);
  }
  return fsPath.map(slugify);
}

const slugify = (str: string) => str
  .toLowerCase()
  .replace(ipynbExtensionRegex, '')
  .replace(/(\s|_)+/g, '-')
  .replace(/-+/g, '-')
  .replace(/[^0-9a-zA-Z-]/g, '')
;

let tree: VRoot | null = null
export const getFsTree = async () => {
  if (tree !== null) {
    return tree;
  }

  tree = { type: 'root', items: {} };
  const createVDir = (fsPath: string[], slug?: string[]): VDir => ({
    type: 'directory',
    fsPath,
    slug: slug ?? slugifyFsPath(fsPath),
    items: {},
  });
  const createVFile = async (fsPath: string[], slug?: string[]) => {
    const md = await getWorkshopMd(fsPath);
    const title = getMdTitle(md) ?? fsPath[fsPath.length - 1].replace(ipynbExtensionRegex, '');
    return {
      type: 'file',
      fsPath,
      slug: slug ?? slugifyFsPath(fsPath),
      title,
      md,
    } as VFile
  }

  const notebookPaths = await promisify(glob)('**/*.ipynb', { cwd: WORKSHOPS_ROOT_DIR, ignore: 'website/*' })
  await notebookPaths.reduce(async (promise, filepath) => {
    const relPath = path.relative(WORKSHOPS_ROOT_DIR, filepath);
    const dirs = relPath.split(path.sep).slice(1); // skip the first index, which is always "."
    
    await promise;
    
    let m = tree as unknown as VDir;
    const fsPath = [], slugPath = [];
    for (let i=0; i < dirs.length; ++i) {
      const d = dirs[i];
      const slug = slugify(d);
      fsPath.push(d);
      slugPath.push(slug);

      if (i === dirs.length - 1) {
        m.items[slug] = await createVFile([...fsPath], [...slugPath])
      } else {
        if (!m.items.hasOwnProperty(slug)) {
          m.items[slug] = createVDir([...fsPath], [...slugPath]);
        }
        m = m.items[slug] as VDir;
      }
    }
  }, Promise.resolve());

  return tree;
}
export const setTree = (t: typeof tree) => {
  tree = t;
}

export type SidebarDoc = {
  type: 'doc';
  href: string;
  title: string;
}
export type SidebarCategory = {
  type: 'category';
  href: string;
  label: string;
  items: (SidebarDoc | SidebarCategory)[];
}
export type SidebarItem = SidebarDoc | SidebarCategory
export type Sidebar = SidebarItem[]

let sidebar: Sidebar | null = null;
export const getSidebar = async (baseUrl = '/workshops') => {
  if (tree === null) {
    await getFsTree();
  }

  if (sidebar !== null) {
    return sidebar;
  }

  const isVFile = (obj: VEntry): obj is VFile => obj.type === 'file';
  const buildSidebar = (obj: VEntry): SidebarItem => {
    // base case - a "leaf" (aka a file). directly extract the slug and title
    if (isVFile(obj)) {
      const { slug, title } = obj as VFile;
      const href = `${baseUrl}/${slug.map(encodeURIComponent).join('/')}`;

      const doc: SidebarDoc = { type: 'doc', href, title };
      return doc;
    }

    const { slug, fsPath } = obj as VDir;
    const href = `${baseUrl}/${slug.map(encodeURIComponent).join('/')}`;
    // TODO: abstract logic for getting sidebar label of category
    // in this manner we could e.g. have a `.category.yml` file or something that allows
    // defining a custom label
    const label = fsPath[fsPath.length - 1];

    const category: SidebarCategory = {
      type: 'category',
      href,
      label,
      items: Object.values(obj.items).map(buildSidebar),
    }
    return category;
  }

  sidebar = Object.values((tree as VRoot).items).map(buildSidebar);
  return sidebar;
}

export const flattenTreeToPathsArray = async (tree: VRoot) => {
  const paths: Array<VEntry> = [];

  const walk = (obj: VRoot | VDir, fn: (o: VEntry) => void): void => {
    Object.values(obj.items).forEach((entry) => {
      
      fn(entry);

      // continue recursing
      const hasItems = (entry: VEntry): entry is VDir => typeof (entry as VDir).items !== 'undefined';
      if(hasItems(entry)) {
        walk(entry, fn);
      }
    });
  }
  walk(tree, (entry) => {
    paths.push(entry);
  });

  return paths;
}

export const getFilepathFromFsPath = (filepathArray: string[]) => {
  return path.join(WORKSHOPS_ROOT_DIR, ...filepathArray);
}

export const getWorkshopMd = async (filepath: string | string[]) => {
  filepath = Array.isArray(filepath)
    ? getFilepathFromFsPath(filepath)
    : filepath
  ;
  
  const fileContents = await fs.readFile(filepath, 'utf8');
  const md = (await notebookToMd(fileContents)).toString();
  return md;
}

// TODO: work directly with the ast to grab the first h1 heading.
//  can also look into grabbing description from paragraph below as well
//  would likely have to enforce workshops have first cell be text in the form
//
//      # Workshop Title
//      description
//  
//      (actual content, e.g. cells, etc)
const getMdTitle = (md: string) => {
  return md.match(/^\s*# (?<title>.*)$/m)?.groups?.title;
}

// layer of indirection, i.e. in case we no longer want to make
// __props.json the file to use for storing the tree,
// we can just update the deserializeTree definition
export const deserializeTree = des;

export const getEntryFromSlug = (tree: VRoot, slug: string[]) => {
  let cur = tree as unknown as VDir;
  for (const s of slug) {
    cur = cur.items[s] as VDir;
  }
  return cur as VEntry;
}

export const slugToHref = (slug: string[], basepath: string) => {
  return [basepath, ...slug].join('/');
}