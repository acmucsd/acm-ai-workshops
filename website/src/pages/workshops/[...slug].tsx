import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import type { SidebarItem as SidebarItemType } from "@/lib/helpers/sidebar"
import { serializeMdx } from "@/lib/unified/serializeMdx";
import { createPipeline } from "@/lib/pipelines";
import { workshopsConfig } from "@/lib/pipelines/workshops";
import { slugToHref } from "@/lib/utils/slugToHref";

import { useRouter } from "next/router";

import WorkshopIndexPage from "@/layouts/pages/WorkshopIndexPage";
import NotebookPage from "@/layouts/pages/NotebookPage";
import Layout from "@/layouts/Layout";

interface CommonWorkshopPageProps {
  breadcrumb: string[];
}

export interface NotebookPageProps extends CommonWorkshopPageProps {
  type: 'notebook';
  title: string;
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
}

export interface IndexPageProps extends CommonWorkshopPageProps {
  type: 'index';
  items: Array<{
    type: WorkshopsPageType;
    title: string;
    href: string;
    description: string;
  }>
}

export type WorkshopsPageProps = (NotebookPageProps | IndexPageProps) & {
  sidebar: SidebarItemType[]
}
type WorkshopsPageType = WorkshopsPageProps['type']

const Workshop: NextPage<WorkshopsPageProps> = ({ type, sidebar, ...props }) => {
  const router = useRouter();

  switch (type) {
    case 'notebook':
      return (
        <Layout sidebar={sidebar} path={router.asPath}>
          <NotebookPage {...props as NotebookPageProps} />
        </Layout>
      );
    case 'index':
      return (
        <Layout sidebar={sidebar} path={router.asPath}>
          <WorkshopIndexPage {...props as IndexPageProps} />
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
                    type: 'notebook',
                    title: entry.title,
                    description: '', // TODO
                  }
                case 'directory':
                  const numItems = Object.keys(entry.items).length;
                  return {
                    type: 'index',
                    title: entry.fsPath[entry.fsPath.length - 1],
                    description: numItems === 1
                      ? `${numItems} item`
                      : `${numItems} items`,
                  }
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
          type: 'index',
          items: flattenedItems,
        } as Omit<IndexPageProps, keyof CommonWorkshopPageProps>;
      
      case 'file':
        const mdx = await serializeMdx(entry.md);
        return {
          type: 'notebook',
          title: entry.title,
          source: mdx,
        } as Omit<NotebookPageProps, keyof CommonWorkshopPageProps>
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