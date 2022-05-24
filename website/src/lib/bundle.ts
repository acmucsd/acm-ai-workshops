import path from "path";
import { bundleMDX } from "mdx-bundler";

import remarkHeadingIds from "@/lib/unified/remark-heading-ids";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import astDebug from "./unified/ast-debug";

// kinda hacky
import type { BundleMDX } from "mdx-bundler/dist/types";

// https://www.alaycock.co.uk/2021/03/mdx-bundler#esbuild-executable
const fixEsbuildPath = () => {
  if (process.platform === 'win32') {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      'node_modules',
      'esbuild-windows-64',
      'esbuild.exe',
    )
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      'node_modules',
      'esbuild',
      'bin',
      'esbuild',
    )
  }
}

type Options<Frontmatter> = Required<Pick<BundleMDX<Frontmatter>, 'source' | 'cwd'>> & {
  baseUrl: `/${string}`
  slug: string[]
}
export const bundle = async <Frontmatter>({ source, cwd, baseUrl, slug }: Options<Frontmatter>) => {
  fixEsbuildPath();
  const res = await bundleMDX({
    source,
    cwd,
    mdxOptions: (options) => {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkHeadingIds,
        remarkGfm,
        remarkMath,
      ]
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeKatex,
      ]

      return options
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...(options.loader ?? {}),
        ".png": 'file',
        ".jpg": 'file',
        ".gif": 'file',
      }
      // write assets locally to `~/public/static/content/[...slug]`,
      // and they will correspondingly be served at /static/content/[...slug]
      options.outdir = slug ? path.join(process.cwd(), 'public', 'static', 'content', ...slug) : undefined
      options.publicPath = slug ? `/static/content${baseUrl}/${slug.join('/')}` : undefined
      options.write = true

      return options
    },
  });

  if (res.errors.length > 0) { console.error(res.errors.map(({ detail }) => detail)); }

  return res;
}