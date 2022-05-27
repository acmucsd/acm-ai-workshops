import { defaultToMdConverter } from "./to-md"
import { dirDefaultGetTitleAndDescription, fileDefaultGetTitleAndDescription } from "./title-and-description"
import { defaultDirFileResolver } from "./dir-file-resolver"

import type { UndefinableFields } from "@/types"
import type { PipelineConfig } from "@/lib/pipeline/types"

export const defaultPipelineOptions: UndefinableFields<PipelineConfig> = {
  baseUrl: '/',
  globMatch: '**/*.(md|mdx)',
  file: {
    toMd: defaultToMdConverter,
    getTitleAndDescription: fileDefaultGetTitleAndDescription,
  },
  dir: {
    dirFileResolver: defaultDirFileResolver,
    toMd: defaultToMdConverter,
    getTitleAndDescription: dirDefaultGetTitleAndDescription,
    dirFileGetTitleAndDescription: fileDefaultGetTitleAndDescription,
  },
  stripExtensionFromSlug: true,
}