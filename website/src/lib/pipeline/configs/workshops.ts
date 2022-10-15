import path from 'path';

import { notebookToMd } from '@/lib/unified/notebook-to-md';
import { extractTitleAndDescriptionFromIpynb } from '@/lib/helpers/extract-title-and-description/from-ipynb';
import { extractTitleAndDescriptionFromMetadataFile } from '@/lib/helpers/extract-title-and-description/from-metadata';
import { fileFallbackTitleAndDescription } from '../defaults/title-and-description';

import type { PipelineConfig } from '@/lib/pipeline/types';

export const workshopsConfig: PipelineConfig = {
  serde_file: '__props.json',
  root_filepath: path.join(process.cwd(), '..'),
  baseUrl: '/workshops',
  globMatch: '**/*.ipynb',
  file: {
    toMd: async (contents: string) => await notebookToMd(contents),
    getTitleAndDescription: async ({ contents, fullPath }) =>
      await extractTitleAndDescriptionFromMetadataFile(fullPath)
      ?? await extractTitleAndDescriptionFromIpynb(contents)
      ?? await fileFallbackTitleAndDescription({ fullPath }),
  },
}