import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from 'next-mdx-remote/serialize';
import Link from "next/link";
import React from "react";
import { deserializeTree, flattenTreeToPathsArray, getEntryFromSlug, getFsTree } from "../../lib/getWorkshops";
import MDXComponents from "../../mdx/components";
import { ser } from "../../utils/serializeProps";

interface CommonWorkshopPageProps {
  breadcrumb: string[]
}

interface NotebookPageProps extends CommonWorkshopPageProps {
  type: 'notebook';
  title: string;
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
}

interface IndexPageProps extends CommonWorkshopPageProps {
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
  if (type === 'notebook') {
    const { breadcrumb, source } = props as NotebookPageProps;
    return (
      <div style={{
        minHeight: "100vh",
        padding: "2rem",
      }}>
        <main>
          <MDXRemote {...source} components={MDXComponents} />
          {source.compiledSource}
        </main>
      </div>
    );
  } else {
    const { breadcrumb, items } = props as IndexPageProps

    return (
      <div style={{
        minHeight: "100vh",
        padding: "2rem",
      }}>
        <main>
          {items.map(({ type, href, title, description }) => (
            <Link key={href} href={href}>
              <a>
                <h3>{title}</h3>
                <p>{description}</p>
              </a>
            </Link>
          ))}
        </main>
      </div>
    )
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
                  return {
                    type: 'index',
                    title: entry.fsPath[entry.fsPath.length - 1],
                    description: `${Object.keys(entry.items).length} items`,
                  }
              }
            })();
            const href = entry.slug.join('/');

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