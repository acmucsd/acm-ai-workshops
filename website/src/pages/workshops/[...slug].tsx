import { createPipeline } from "@/lib/pipeline";
import { workshopsConfig } from "@/lib/pipeline/workshops";
import { serializeMdx } from "@/lib/unified/serializeMdx";
import { slugToHref } from "@/utils/slugToHref";

import { useRouter } from "next/router";

import CategoryPage from "@/layouts/pages/CategoryPage";
import DocPage from "@/layouts/pages/DocPage";
import Layout from "@/layouts/Layout";

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { Category, CategoryPageProps, CommonPageProps, Doc, DocPageProps, PageProps } from "@/layouts/pages/types";

const Workshop: NextPage<PageProps> = ({ type, sidebar, ...props }) => {
  const router = useRouter();

  switch (type) {
    case 'doc':
      return (
        <Layout sidebar={sidebar} path={router.asPath}>
          <DocPage {...props as DocPageProps} />
        </Layout>
      );
    case 'category':
      return (
        <Layout sidebar={sidebar} path={router.asPath}>
          <CategoryPage {...props as CategoryPageProps} />
        </Layout>
      );
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
            const { type, title, description } = (() => {
              switch (entry.type) {
                case 'file':
                  return {
                    type: 'doc',
                    title: entry.title,
                    description: entry.description,
                  } as Doc
                case 'directory':
                  const numItems = Object.keys(entry.items).length;
                  return {
                    type: 'category',
                    title: entry.fsPath[entry.fsPath.length - 1],
                    description: numItems === 1
                      ? `${numItems} item`
                      : `${numItems} items`,
                  } as Category
              }
            })();
            const href = slugToHref(entry.slug, workshopsConfig.baseUrl);

            return {
              type,
              href,
              title,
              description,
            }
          })
        ;
        return {
          type: 'category',
          items: flattenedItems,
        } as Omit<CategoryPageProps, keyof CommonPageProps>;
      
      case 'file':
        const mdx = await serializeMdx(entry.md);
        return {
          type: 'doc',
          title: entry.title,
          source: mdx,
        } as Omit<DocPageProps, keyof CommonPageProps>
    }
  })();

  const props = {
    breadcrumb: slug,
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