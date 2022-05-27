import { join, relative, sep } from "path";
import { readFile } from "fs/promises"

import { extractToc } from "@/lib/pipeline/toc";
import { createPipeline } from "@/lib/pipeline";
import { workshopsConfig } from "@/lib/pipeline/configs/workshops";
import { slugToHref } from "@/utils/slugToHref";
import { bundle } from "@/lib/bundle";

import CategoryPage from "@/layout/pages/CategoryPage";
import DocPage from "@/layout/pages/DocPage";

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { CategoryIndexPageProps, CategoryPageProps, CategoryReadmePageProps, CommonPageProps, DocPageProps, PageProps } from "@/layout/pages/types";
import remarkResolveRelativeLinks from "@/lib/unified/remark-resolve-relative-links";
import { getGithubSlug } from "@/layout/components/OpenElsewhereLinks/utils/github";
import { validateConfig } from "@/lib/pipeline/validate-config";

const Workshop: NextPage<PageProps> = ({ type, ...props }) => {
  switch (type) {
    case 'doc':
      return <DocPage {...props as DocPageProps} />
    case 'category':
      return <CategoryPage {...props as CategoryPageProps} />
  }
};

export default Workshop;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string[] };

  const config = validateConfig(workshopsConfig)
  const { entry, sidebar, fileToMd, dirToMd } = await createPipeline(workshopsConfig).getStaticProps(...slug);
  
  const uniqueProps = await (async () => {
    switch (entry.type) {
      // category page
      case 'directory': {
        const commonCategoryProps = { type: 'category', fsPath: entry.fsPath } as const
        // no README -> will render a grid of its children
        if (entry.fullPathToFile === undefined) {
          const flattenedItems = Object.values(entry.items)
            .map(({ type, slug, title, description, fsPath }) => {
              const href = slugToHref(slug, workshopsConfig.baseUrl);
              const commonChildObject = { title, description, fsPath, href }
              switch (type) {
                case 'file':
                  return { type: 'doc', ...commonChildObject }
                case 'directory':
                  return { type: 'category', ...commonChildObject }
              }
            })
          ;
          return {
            ...commonCategoryProps,
            subtype: 'index',
            items: flattenedItems,
          } as Omit<CategoryIndexPageProps, keyof CommonPageProps>;
        
        // otherwise render the README markdown
        } else {
          const dirFileFsPath = relative(config.basePath, entry.fullPathToFile).split(sep)
          const contents = await readFile(entry.fullPathToFile, 'utf-8'); // `entry.fullPathToFile` should be the result of `dir.dirFileResolver()`
          const md = await dirToMd(contents)
          const toc = await extractToc(md)
          const { code } = await bundle({
            source: md,
            cwd: join(workshopsConfig.root_filepath, ...entry.fsPath),
            baseUrl: workshopsConfig.baseUrl ?? '/',
            slug: entry.slug,
            type: 'readme',
            remarkPlugins: [
              [remarkResolveRelativeLinks, {
                resolver: (url: string) => new URL(url, `https://github.com/${getGithubSlug(dirFileFsPath)}`).href,
              }],
            ],
          })

          return {
            ...commonCategoryProps,
            subtype: 'readme',
            source: code,
            toc,
          } as Omit<CategoryReadmePageProps, keyof CommonPageProps>;
        }
      }
      // notebook page
      case 'file': {
        const contents = await readFile(entry.fullPath, 'utf-8');
        const md = await fileToMd(contents);
        const toc = await extractToc(md)
        const { code } = await bundle({
          source: md,
          cwd: join(workshopsConfig.root_filepath, ...entry.fsPath),
          baseUrl: workshopsConfig.baseUrl ?? '/',
          slug: entry.slug,
          remarkPlugins: [
            [remarkResolveRelativeLinks, {
              resolver: (url: string) => `https://github.com/${join(getGithubSlug(entry.fsPath), url)}`,
            }],
          ],
        })
        return {
          type: 'doc',
          title: entry.title,
          source: code,
          toc,
          fsPath: entry.fsPath,
        } as Omit<DocPageProps, keyof CommonPageProps>
      }
    }
  })();

  const props = {
    slug,
    sidebar,
    ...uniqueProps,
  }
  
  return { props }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { paths } = await createPipeline(workshopsConfig).getStaticPaths()

  return {
    paths,
    fallback: false,
  }
}