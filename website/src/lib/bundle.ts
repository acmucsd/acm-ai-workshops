import path from "path";
import { bundleMDX } from "mdx-bundler";

import remarkHeadingIds from "@/lib/unified/remark-heading-ids";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxGhImages from "./unified/remark-mdx-gh-images";
import rehypeKatex from "rehype-katex";

import astDebug from "./unified/ast-debug";

// kinda hacky
import type { BundleMDX } from "mdx-bundler/dist/types";
import remarkFrontmatter from "remark-frontmatter";
import { PluggableList } from "unified";

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
  type?: 'notebook' | 'readme'
  remarkPlugins?: PluggableList
  rehypePlugins?: PluggableList
}
export const bundle = async <Frontmatter>({ source, cwd, baseUrl, slug, type = 'notebook', remarkPlugins = [], rehypePlugins = [] }: Options<Frontmatter>) => {
  fixEsbuildPath();
  const res = await bundleMDX({
    source,
    cwd,
    mdxOptions: (options) => {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkFrontmatter,
        remarkHeadingIds,
        remarkGfm,
        remarkMath,
        ...(type === 'readme'
          ? [remarkMdxGhImages]
          : []
        ),
        ...remarkPlugins,
      ]
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeKatex,
        ...rehypePlugins,
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
      // write assets locally to `~/public/static/content/[baseUrl]/[...slug]`,
      // and they will correspondingly be served at /static/content/[baseUrl]/[...slug]
      options.outdir = slug ? path.join(process.cwd(), 'public', 'static', 'content', baseUrl, ...slug) : undefined
      options.publicPath = slug ? `/static/content${baseUrl}/${slug.join('/')}` : undefined
      options.write = true

      return options
    },
  });

  if (res.errors.length > 0) { console.error(res.errors.map(({ detail }) => detail)); }

  return res;
}