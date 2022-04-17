import path from 'path';

import { notebookToMd } from '@/lib/unified/processor';
import type { PipelineConfig } from '.';

export const workshopsConfig: PipelineConfig = {
  serde_file: '__props.json',
  root_filepath: path.join(process.cwd(), '..'),
  baseUrl: '/workshops',
  globMatch: '**/*.ipynb',
  toMd: async (contents: string) => (await notebookToMd(contents)).toString(),
}