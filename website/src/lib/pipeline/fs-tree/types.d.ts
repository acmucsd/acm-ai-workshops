/* types for fs tree entries */

// common fs entry fields
interface FsEntryCommon {
  // the url slug parts corresponding with the entry
  slug: string[];

  // the filesystem path parts corresponding with the entry, relative to some base path
  fsPath: string[];

  // the full path to the entry
  fullPath: string

  // the title of the entry
  title: string;

  // the description of the entry
  description: string;
}

// fs file specific fields
export interface FsFile extends FsEntryCommon {
  type: 'file';
}

// fs directory specific fields
export interface FsDir extends FsEntryCommon {
  type: 'directory';

  // the children of the directory
  items: Record<string, FsEntry>;

  // the number of leaves of the tree rooted at the directory
  numLeaves: number;
  
  // the absolute path to the README file corresponding with the directory
  fullPathToFile?: string;
}

export type FsEntry = FsFile | FsDir;