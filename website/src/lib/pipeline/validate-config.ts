import { defaultPipelineOptions } from "./defaults";
import { fileFallbackTitleAndDescription, dirFallbackTitleAndDescription } from "./defaults/title-and-description";

import type { TitleAndDescription } from "@/lib/helpers/extract-title-and-description/types";
import type { FsDir } from "./fs-tree/types";
import type { PipelineConfig } from "./types";

export function validateConfig({
  serde_file,
  root_filepath: basePath,
  baseUrl = defaultPipelineOptions.baseUrl,
  globMatch = defaultPipelineOptions.globMatch,
  file: {
    toMd: fileToMd = defaultPipelineOptions.file.toMd,
    getTitleAndDescription: fileGetTitleAndDescription = defaultPipelineOptions.file.getTitleAndDescription,
  } = defaultPipelineOptions.file,
  dir: {
    dirFileResolver = defaultPipelineOptions.dir.dirFileResolver,
    toMd: dirToMd = defaultPipelineOptions.dir.toMd,
    getTitleAndDescription: dirGetTitleAndDescription = defaultPipelineOptions.dir.getTitleAndDescription,
    dirFileGetTitleAndDescription = defaultPipelineOptions.dir.dirFileGetTitleAndDescription,
  } = defaultPipelineOptions.dir,
  stripExtensionFromSlug = defaultPipelineOptions.stripExtensionFromSlug,
}: PipelineConfig) {
  const file = {
    toMd: fileToMd,
    getTitleAndDescription: async (...args: Parameters<typeof fileGetTitleAndDescription>): Promise<TitleAndDescription> =>
      (await fileGetTitleAndDescription(...args))
        ?? fileFallbackTitleAndDescription(...args),
  }
  const dir = {
    dirFileResolver,
    toMd: dirToMd,
    getTitleAndDescription: async (...args: Parameters<typeof dirGetTitleAndDescription>): Promise<TitleAndDescription> =>
      (await dirGetTitleAndDescription(...args))
        ?? dirFallbackTitleAndDescription(...args),
    dirFileGetTitleAndDescription: async (...[arg0, ...args]: Parameters<typeof dirFileGetTitleAndDescription>): Promise<TitleAndDescription> => 
      (await dirFileGetTitleAndDescription(arg0, ...args))
        ?? fileFallbackTitleAndDescription({ ...arg0, fullPath: (arg0.entry as FsDir).fullPathToFile! }, ...args)
        ?? dirFallbackTitleAndDescription(arg0, ...args),
  }

  return {
    serde_file,
    basePath,
    baseUrl,
    globMatch,
    file,
    dir,
    stripExtensionFromSlug
  }
}