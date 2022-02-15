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

export const getFsTree = async () => {
  const tree: VRoot = { type: 'root', items: {} };
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

  const notebookPaths = await promisify(glob)('**/*.ipynb', { cwd: WORKSHOPS_ROOT_DIR })
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

let deserializedTree: VRoot | undefined = undefined;
export const deserializeTree = () => {
  return deserializedTree ?? des();
}

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