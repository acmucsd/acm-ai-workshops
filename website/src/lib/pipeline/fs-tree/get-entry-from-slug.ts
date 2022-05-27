import type { FsDir, FsEntry } from "./types";

/**
 * given a tree and a slug array, gets the entry in the tree associated with the slug
 * @todo maybe abstract this? because it's basically just a deep get
 * 
 * @param tree the tree to get the entry from
 * @param slug the slug to get the entry for
 * @returns the entry associated with the given slug
 */
 export const getEntryFromSlug = (tree: FsDir, ...slug: string[]) => {
  let cur = tree;
  for (const s of slug) {
    cur = cur.items[s] as FsDir;
  }
  return cur as FsEntry;
}