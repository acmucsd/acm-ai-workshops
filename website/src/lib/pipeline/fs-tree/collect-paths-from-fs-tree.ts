import { walk } from "./walk";

import type { FsDir, FsEntry } from "./types";

/**
 * collects all paths along an fs tree into an array
 * @param tree the tree to collect paths from
 * @returns the array of all possible paths in the fs tree
 */
 export const collectPathsFromFsTree = async (tree: FsDir) => {
  const paths: FsEntry[] = [];

  await walk(tree, async (entry) => { paths.push(entry); });

  return paths;
}