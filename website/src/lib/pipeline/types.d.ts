import type { TitleAndDescription } from "@/lib/helpers/extract-title-and-description/types"
import { FsEntry } from "./fs-tree/types"

export type PipelineConfig = {
  // the filename to serialize data to. this should be unique between configs
  serde_file: string

  // the root filepath to glob for files
  root_filepath: string

  // the base url for data obtaiend with this config. this should be unique between configs
  baseUrl?: BaseUrl
  
  // glob string for testing files to include. this glob is called from `root_filepath`
  globMatch?: string
  
  file?: {
    // how to transform file contents into md format
    toMd?: ToMdConverter
    
    // how to extract title and description for the file
    getTitleAndDescription?: TitleAndDescriptionExtractor
  }

  dir?: {
    // how to try to get the file to use the represent the intermediate directory, given any of:
    //  - basePath    the base path of all files for the config, i.e. `PipelineConfig.root_filepath`
    //  - fsPath      the filepath parts to the directory from the base path
    //  - fullPath    the full filepath to the intermediate directory
    dirFileResolver?: DirFileResolver

    // how to transform file contents into md format
    toMd?: ToMdConverter
    
    // how to extract title and description for the directory
    getTitleAndDescription?: TitleAndDescriptionExtractor<'entry' | 'basePath' | 'fsPath' | 'fullPath'>

    // how to extract title and description for the file associated with the directory
    dirFileGetTitleAndDescription?: TitleAndDescriptionExtractor
  }


  // whether to strip the file extension of the file from the slug
  stripExtensionFromSlug?: boolean
}

export type BaseUrl = `/${string}`

// function describing how to convert some file contents into a Markdown string
export type ToMdConverter = (contents: string) => Promise<string>

export type TitleAndDescriptionExtractorArgs = {
  entry: FsEntry    // the object corresponding to the entry
  contents: string  // the actual file contents of the entry
  md: string        // the markdown contents of the entry
  basePath: string  // the base path of all files for the given config, i.e. `PipelineConfig.root_filepath`
  fsPath: string[]  // the filepath parts to the entry from the base path
  fullPath: string  // the full filepath to the file
}
// function describing how to extract the title and description out of an entry
export type TitleAndDescriptionExtractor<
  T extends keyof TitleAndDescriptionExtractorArgs
    = keyof TitleAndDescriptionExtractorArgs,
> =
  (arg: Pick<TitleAndDescriptionExtractorArgs, T>) => Promise<TitleAndDescription | null>

// how to try to get the file to use the represent the intermediate directory, given any of:
    //  - basePath    the base path of all files for the config, i.e. `PipelineConfig.root_filepath`
    //  - fsPath      the filepath parts to the directory from the base path
    //  - fullPath    the full filepath to the intermediate directory

export type DirFileResolverArgs = {
  basePath: string  // the base path of all files for the given config, i.e. `PipelineConfig.root_filepath`
  fsPath: string[]  // the filepath parts to the directory from the base path
  fullPath: string  // the full filepath to the directory
}
// function describing how to get the file to use the represent the intermediate directory
export type DirFileResolver<
  T extends keyof DirFileResolverARgs
    = keyof DirFileResolverArgs,
> = (arg: Pick<DirFileResolverArgs, T>) => Promise<string | null>