import { readFile } from "fs/promises";
import path from 'path';
import { promisify } from 'util';
import globCb from 'glob';

import { slugify } from '@/lib/utils/slugify';
import { extractTitleFromMdString } from "./extractMdTitle";

const glob = promisify(globCb);

interface VEntryCommon {
  slug: string[];
  fsPath: string[];
}
export interface VFile extends VEntryCommon {
  type: 'file';
  title: string;
  md: string;
}
export interface VDir extends VEntryCommon {
  type: 'directory';
  items: Record<string, VEntry>;
}
export type VEntry = VFile | VDir;

const trees: Map<string, VDir> = new Map();

export type ToMdFunction = (contents: string) => Promise<string>
export type GetTitleFunction = ({ contents, md, filepath }: { contents: string, md: string, filepath: string[] }) => string

export type Options = {
  basePath: string
  globMatch?: string
  // transform file contents into md format
  toMd?: ToMdFunction
  // extract title from the document, whether it's from the original file contents or converted markdown
  getTitle?: GetTitleFunction
  stripExtensionFromSlug?: boolean
}

/**
 * constructs the FS tree rooted at `basePath` and filtered by files that match the glob `globMatch.
 * @param opts options
 * @param opts.basePath the root of the fs tree to construct
 * @param opts.globMatch the glob pattern to filter the files by to construct the fs tree
 * @param opts.toMd optional function to transform file contents to markdown/mdx, if the file is not already
 * @param opts.getTitle function to extract the file's "title"
 * @param opts.stripExtensionFromSlug whether to exclude the file extension from slugs 
 * @returns the resultant fs tree
 */
export const getFsTree = async ({
  basePath,
  globMatch = '**/*.(md|mdx)',
  toMd = async (contents: string) => contents,
  getTitle = ({ md, filepath }) => extractTitleFromMdString(md) ?? path.parse(filepath[filepath.length - 1]).name,
  stripExtensionFromSlug = true,
}: Options) => {
  if (trees.has(basePath)) {
    return trees.get(basePath) as VDir;
  }

  const root: VDir = { type: 'directory', items: {}, slug: [], fsPath: [] };

  const createVDir = (fsPath: string[], slug: string[]): VDir => ({
    type: 'directory',
    fsPath,
    slug,
    items: {},
  });

  const createVFile = async (fsPath: string[], slug: string[]) => {
    const contents = await readFile(path.join(basePath, ...fsPath), 'utf-8');
    const md = await toMd(contents);
    const title = getTitle({ contents, md, filepath: fsPath });
    return {
      type: 'file',
      fsPath,
      slug,
      title,
      md,
    } as VFile;
  }

  // collect all notebook paths
  const notebookPaths = await glob(globMatch, { cwd: basePath, ignore: 'website/*' })

  // this await reduce is to basically sequentially construct all the subpaths 
  //  despite calling async functions inside
  // for each filepath...
  await notebookPaths.reduce(async (promise, filepath) => {
    const relPath = path.relative(basePath, filepath);
    const dirs = relPath.split(path.sep).slice(1); // skip the first index, which is always "."
    
    await promise;
    
    // start at root
    let m = root;
    const fsPath = [], slugPath = [];
    for (let i=0; i < dirs.length; ++i) {
      const d = dirs[i];
      const slug = (stripExtensionFromSlug && i === dirs.length - 1)
        ? slugify(path.parse(d).name)
        : slugify(d);

      // build the path so far
      fsPath.push(d);
      slugPath.push(slug);

      // create the virtual item
      if (i === dirs.length - 1) {
        // we don't need to check if it already exists,
        // because we can guarantee it doesn't since files can't have the same name
        m.items[slug] = await createVFile([...fsPath], [...slugPath])
      } else {
        if (!m.items.hasOwnProperty(slug)) {
          m.items[slug] = createVDir([...fsPath], [...slugPath]);
        }
        m = m.items[slug] as VDir;
      }
    }
  }, Promise.resolve());

  // cache the tree
  trees.set(basePath, root);

  return root;
}

/**
 * associate a tree with a given basepath
 * @param basePath the basepath to bind the tree to
 * @param tree the tree to bind
 */
export const setTree = (basePath: string, tree: VDir) => {
  trees.set(basePath, tree);
}

/**
 * collects all paths along an fs tree into an array
 * @param tree the tree to collect paths from
 * @returns the array of all possible paths in the fs tree
 */
export const collectPathsFromFsTree = async (tree: VDir) => {
  const paths: VEntry[] = [];

  // "walks" along an object, calling a function on each entry
  // TODO: abstract this into a separate util function
  const walk = (obj: VDir, fn: (o: VEntry) => void): void => {
    Object.values(obj.items).forEach((entry) => {
      
      fn(entry);

      // continue recursing
      const hasItems = (entry: VEntry): entry is VDir => (entry as VDir).items !== undefined;
      if(hasItems(entry)) { walk(entry, fn); }
    });
  }
  walk(tree, (entry) => { paths.push(entry); });

  return paths;
}

// TODO: could maybe abstract this? because it's basically just a deep get
/**
 * given a tree and a slug array, gets the entry in the tree associated with the slug
 * @param tree the tree to get the entry from
 * @param slug the slug to get the entry for
 * @returns the entry associated with the given slug
 */
export const getEntryFromSlug = (tree: VDir, ...slug: string[]) => {
  let cur = tree;
  for (const s of slug) {
    cur = cur.items[s] as VDir;
  }
  return cur as VEntry;
}