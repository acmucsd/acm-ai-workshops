import {
  collectPathsFromFsTree,
  getEntryFromSlug,
  getFsTree,
  setTree,
} from "@/lib/helpers/fs-tree";
import { des, ser } from "@/lib/helpers/serde";
import { getSidebar } from "@/lib/helpers/sidebar";

import type { Options as FsTreeOptions } from "@/lib/helpers/fs-tree";

export type PipelineConfig = {
  serde_file: string,
  root_filepath: FsTreeOptions['basePath'],
  baseUrl?: string,
  globMatch?: FsTreeOptions['globMatch'],
  toMd?: FsTreeOptions['toMd'],
  getTitleAndDescription?: FsTreeOptions['getTitleAndDescription'],
  stripExtensionFromSlug?: FsTreeOptions['stripExtensionFromSlug'],
}

/**
 * Creates functions to run in `getStaticPaths` and `getStaticProps` given a pipeline config
 * @param cfg the pipeline config
 * @returns two pipeline functions, one to run in `getStaticPaths` and one in `getStaticProps`
 */
export const createPipeline = ({
  serde_file,
  root_filepath: basePath,
  baseUrl = '',
  globMatch,
  toMd,
  getTitleAndDescription,
  stripExtensionFromSlug,
}: PipelineConfig) => ({
  getStaticProps: async (...slug: string[]) => {
    const tree = des(serde_file)
    setTree(basePath, tree);
    const entry = getEntryFromSlug(tree, ...slug);
    
    const sidebar = await getSidebar({ baseUrl, basePath });

    return { entry, sidebar }
  },
  getStaticPaths: async () => {
    const tree = await getFsTree({ basePath, globMatch, toMd, getTitleAndDescription, stripExtensionFromSlug });
    const entries = await collectPathsFromFsTree(tree);

    const paths = entries.map(({ slug }) => ({ params: { slug } }));

    // because next doesnt support passing props from getstaticpaths to getstaticprops:
    // workaround by creating temp file, writing necessary data there,
    // and reading it back in getStaticProps
    ser(tree, serde_file);

    return { paths }
  }
}) as const