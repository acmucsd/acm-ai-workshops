import { extractToc } from "@/lib/helpers/toc";
import { createPipeline } from "@/lib/pipeline";
import { workshopsConfig } from "@/lib/pipeline/workshops";
import { slugToHref } from "@/utils/slugToHref";

import CategoryPage from "@/layout/pages/CategoryPage";
import DocPage from "@/layout/pages/DocPage";

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { Category, CategoryPageProps, CommonPageProps, Doc, DocPageProps, PageProps } from "@/layout/pages/types";

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

  const { entry, sidebar } = await createPipeline(workshopsConfig).getStaticProps(...slug);
  
  const uniqueProps = await (async () => {
    switch (entry.type) {
      case 'directory':
        const flattenedItems = Object.values(entry.items)
          .map((entry) => {
            const { type, title, description, fsPath } = (() => {
              switch (entry.type) {
                case 'file':
                  return {
                    type: 'doc',
                    title: entry.title,
                    description: entry.description,
                    fsPath: entry.fsPath
                  } as Doc
                case 'directory':
                  const numItems = entry.numLeaves;
                  return {
                    type: 'category',
                    title: entry.fsPath[entry.fsPath.length - 1],
                    description: numItems === 1
                      ? `${numItems} item`
                      : `${numItems} items`,
                    fsPath: entry.fsPath,
                  } as Category
              }
            })();
            const href = slugToHref(entry.slug, workshopsConfig.baseUrl);

            return {
              type,
              title,
              description,
              href,
              fsPath,
            }
          })
        ;
        return {
          type: 'category',
          items: flattenedItems,
        } as Omit<CategoryPageProps, keyof CommonPageProps>;
      
      case 'file':
        const toc = await extractToc(entry.md)
        return {
          type: 'doc',
          title: entry.title,
          source: entry.md,
          toc,
          fsPath: entry.fsPath,
        } as Omit<DocPageProps, keyof CommonPageProps>
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