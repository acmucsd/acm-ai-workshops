import { getFsTree, setTree } from "@/lib/pipeline/fs-tree"
import { collectPathsFromFsTree } from "@/lib/pipeline/fs-tree/collect-paths-from-fs-tree"
import { getEntryFromSlug } from "@/lib/pipeline/fs-tree/get-entry-from-slug"
import { getSidebar } from "@/lib/pipeline/sidebar"

import { des, ser } from "@/lib/helpers/serde";

import type { PipelineConfig } from "./types"
import { validateConfig } from "./validate-config";

/**
 * Creates functions to run in `getStaticPaths` and `getStaticProps` given a pipeline config
 * @param cfg the pipeline config
 * @returns two pipeline functions, one to run in `getStaticPaths` and one in `getStaticProps`
 */
export const createPipeline = (config: PipelineConfig) => {
  const { serde_file, basePath, baseUrl, globMatch, file, dir, stripExtensionFromSlug } = validateConfig(config)

  return {
    getStaticProps: async (...slug: string[]) => {
      const tree = des(serde_file)
      setTree(basePath, tree);
      const entry = getEntryFromSlug(tree, ...slug);
      
      const sidebar = await getSidebar({ baseUrl, basePath, globMatch, file, dir, stripExtensionFromSlug });

      return { entry, sidebar, fileToMd: file.toMd, dirToMd: dir.toMd }
    },
    getStaticPaths: async () => {
      const tree = await getFsTree({ basePath, globMatch, file, dir, stripExtensionFromSlug });
      const entries = await collectPathsFromFsTree(tree);

      const paths = entries.map(({ slug }) => ({ params: { slug } }));

      // because next doesnt support passing props from getstaticpaths to getstaticprops:
      // workaround by creating temp file, writing necessary data there,
      // and reading it back in getStaticProps
      ser(tree, serde_file);

      return { paths }
    }
  } as const
}