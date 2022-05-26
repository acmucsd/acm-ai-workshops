import { readFile } from "fs/promises";
import path from 'path';

import { glob } from "@/utils/glob";
import { slugify } from '@/utils/slugify';
import { walk } from "./walk";

import { dirFallbackTitleAndDescription, fileFallbackTitleAndDescription } from "@/lib/pipeline/defaults/title-and-description";

import type { FsDir, FsFile } from "./types";
import type { DirFileResolver, GlobMatch, TitleAndDescriptionExtractor, ToMdConverter } from "@/lib/pipeline/types";

const trees: Map<string, FsDir> = new Map();

export type Options = {
  basePath: string
  globMatch: GlobMatch
  file: {
    toMd: ToMdConverter
    getTitleAndDescription: TitleAndDescriptionExtractor
  }
  dir: {
    dirFileResolver: DirFileResolver
    toMd: ToMdConverter
    getTitleAndDescription: TitleAndDescriptionExtractor<'entry' | 'basePath' | 'fsPath' | 'fullPath'>
    dirFileGetTitleAndDescription: TitleAndDescriptionExtractor
  }
  stripExtensionFromSlug?: boolean
}

/**
 * constructs the FS tree rooted at `basePath` and filtered by files that match the glob `globMatch.
 * @returns the resultant fs tree
 */
export const getFsTree = async ({
  basePath,
  globMatch,
  file,
  dir,
  stripExtensionFromSlug,
}: Options) => {
  if (trees.has(basePath)) {
    return trees.get(basePath) as FsDir;
  }

  const root: FsDir = { type: 'directory', items: {}, slug: [], fsPath: [], fullPath: '', title: '', description: '', numLeaves: 0 };

  const createVirtualFsDir = async (fsPath: string[], slug: string[]): Promise<FsDir> => {
    const fullPath = path.join(basePath, ...fsPath)
    const commonDirObject = {
      type: 'directory',
      fsPath, slug, fullPath,
      title: '', description: '',   // we handle title/description for each entry after creating the full fs tree
      items: {},
      numLeaves: 0,
    } as const

    const fullPathToFile = await dir.dirFileResolver({ basePath, fsPath, fullPath })
    return fullPathToFile === null
      ? commonDirObject
      : { ...commonDirObject, fullPathToFile }
  }

  const createVirtualFsFile = async (fsPath: string[], slug: string[]): Promise<FsFile> => {
    const fullPath = path.join(basePath, ...fsPath)
    return { type: 'file',
      fsPath, slug, fullPath,
      title: '', description: '',   // we handle title/description for each entry after creating the full fs tree
    }
  }

  // collect all notebook paths
  const [globInclude, globExclude] = typeof globMatch === 'string'
    ? [globMatch, []]
    : [globMatch.include, Array.isArray(globMatch.exclude) ? globMatch.exclude : [globMatch.exclude]]
  
  const notebookPaths = await glob(globInclude, { cwd: basePath, ignore: ['website/*', 'internal/*', ...globExclude] })

  // for each filepath...
  for (const filepath of notebookPaths) {
    const relPath = path.relative(basePath, filepath);
    const dirs = relPath.split(path.sep).slice(1); // skip the first index, which is always "."
    
    // start at tree root
    let m = root;
    const fsPath = [], slugPath = [];

    // and construct the branch to the filepath
    for (let i=0; i < dirs.length; ++i) {
      const d = dirs[i];
      // strip extension from slug as necessary
      const slug = (i === dirs.length - 1 && stripExtensionFromSlug)
        ? slugify(path.parse(d).name)
        : slugify(d);

      // build the path so far
      fsPath.push(d); slugPath.push(slug);

      // create the virtual item

      if (i === dirs.length - 1) {
        // we don't need to check if it already exists, since files can't have the same name
        m.items[slug] = await createVirtualFsFile([...fsPath], [...slugPath])
      } else {
        if (!m.items.hasOwnProperty(slug)) {
          m.items[slug] = await createVirtualFsDir([...fsPath], [...slugPath])
        }
        ;(m.items[slug] as FsDir).numLeaves += 1;
        m = m.items[slug] as FsDir;
      }
    }
  }

  // bind titles/descriptions to each entry
  await walk(root, async (entry, k, parent) => {
    switch (entry.type) {
      case 'file': {
        const contents = await readFile(entry.fullPath, 'utf-8');
        const md = await file.toMd(contents);
        const { title, description } = await file.getTitleAndDescription({ entry, contents, md, basePath, fsPath: entry.fsPath, fullPath: entry.fullPath })
          ?? fileFallbackTitleAndDescription({ fullPath: entry.fullPath })
        parent.items[k].title = title
        parent.items[k].description = description
        return
      }
      case 'directory': {
        if ((entry as FsDir).fullPathToFile !== undefined) {
          const contents = await readFile((entry as FsDir).fullPathToFile!, 'utf-8')
          const md = await dir.toMd(contents)
          const { title, description } = await dir.dirFileGetTitleAndDescription({ entry, contents, md, basePath, fsPath: entry.fsPath, fullPath: entry.fullPath })
            ?? fileFallbackTitleAndDescription({ fullPath: entry.fullPath })
          parent.items[k].title = title
          parent.items[k].description = description
        } else {
          const { title, description } = await dir.getTitleAndDescription({ entry, basePath, fsPath: entry.fsPath, fullPath: entry.fullPath })
            ?? dirFallbackTitleAndDescription({ entry })
          parent.items[k].title = title
          parent.items[k].description = description
          return
        }
      }
    }
  })

  // cache the tree
  trees.set(basePath, root);

  return root;
}

/**
 * associate a tree with a given basepath
 * @param basePath the basepath to bind the tree to
 * @param tree the tree to bind
 */
export const setTree = (basePath: string, tree: FsDir) => {
  trees.set(basePath, tree);
}