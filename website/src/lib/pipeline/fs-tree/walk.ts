import type { FsDir, FsEntry } from "./types"

/**
 * "walks" along the fs tree, calling the function on each entry
 * @param node root of tree to walk along
 * @param fn function to call on each entry
 */
export async function walk (node: FsDir, fn: (o: FsEntry, k: string, p: FsDir) => Promise<void>): Promise<void> {
  for (const k in node.items) {
    const entry = node.items[k]
    await fn(entry, k, node)

    // continue recursing
    const hasItems = (entry: FsEntry): entry is FsDir => (entry as FsDir).items !== undefined
    if(hasItems(entry)) { await walk(entry, fn) }
  }
}

export function walkSync (node: FsDir, fn: (o: FsEntry, k: string, p: FsDir) => void): void {
  for (const k in node.items) {
    const entry = node.items[k]
    fn(entry, k, node)

    // continue recursing
    const hasItems = (entry: FsEntry): entry is FsDir => (entry as FsDir).items !== undefined
    if(hasItems(entry)) { walkSync(entry, fn) }
  }
}