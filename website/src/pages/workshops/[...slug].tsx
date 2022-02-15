import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from 'next-mdx-remote/serialize';
import { deserializeTree, flattenTreeToPathsArray, getEntryFromSlug, getFsTree, slugToHref } from "@/lib/getWorkshops";
import { ser } from "@/lib/serde";
import WorkshopIndexPage from "@/layouts/pages/WorkshopIndexPage";
import NotebookPage from "@/layouts/pages/NotebookPage";

interface CommonWorkshopPageProps {
  breadcrumb: string[]
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

type WorkshopsPageProps = NotebookPageProps | IndexPageProps
type WorkshopsPageType = WorkshopsPageProps['type']

const Workshop: NextPage<WorkshopsPageProps> = ({ type, ...props }) => {
  switch (type) {
    case 'notebook':
      return <NotebookPage {...props as NotebookPageProps} />
    case 'index':
      return <WorkshopIndexPage {...props as IndexPageProps} />
  }
};

export default Workshop;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string[] };

  const tree = await deserializeTree();
  const entry = getEntryFromSlug(tree, slug);

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
            const href = slugToHref(entry.slug, '/workshops');

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
        const mdx = await serialize(entry.md);
        return {
          type: 'notebook',
          title: entry.title,
          source: mdx,
        } as Omit<NotebookPageProps, keyof CommonWorkshopPageProps>
    }
  })();

  const props = {
    breadcrumb: slug,
    ...uniqueProps,
  }
  
  return { props }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tree = await getFsTree();
  const entries = await flattenTreeToPathsArray(tree);

  const paths = entries.map(({ slug }) => ({ params: { slug } }));

  // because next doesnt support passing props from getstaticpaths to getstaticprops:
  // workaround by creating temp file, writing necessary data there,
  // and reading it back in getStaticProps
  ser(tree);

  return {
    paths,
    fallback: false,
  }
}