import { getFsTree } from "@/lib/helpers/fs-tree";
import { getSidebar } from "@/lib/helpers/sidebar";
import { workshopsConfig } from "@/lib/pipeline/workshops";
import { slugToHref } from "@/utils/slugToHref";

import { useRouter } from "next/router";

import Layout from "@/layouts/Layout";
import CategoryPage from "@/layouts/pages/CategoryPage";

import s from "@/sections/workshops/styles.module.scss"

import type { GetStaticProps, NextPage } from "next";
import type { Category, CategoryPageProps, Doc, PageProps } from "@/layouts/pages/types";

const WorkshopsRootPage: NextPage<PageProps> = ({ sidebar, ...props }) => {
  const router = useRouter();

  return (
    <Layout sidebar={sidebar} path={router.asPath}>
      <h1 className={s.title}>ACM AI Workshops</h1>
      <CategoryPage {...props as CategoryPageProps} />
    </Layout>
  );
};

export default WorkshopsRootPage;

export const getStaticProps: GetStaticProps = async () => {

  const {
    root_filepath: basePath,
    baseUrl,
    globMatch,
    toMd,
    getTitleAndDescription,
    stripExtensionFromSlug,
  } = workshopsConfig

  const entry = await getFsTree({ basePath, globMatch, toMd, getTitleAndDescription, stripExtensionFromSlug })
  
  const sidebar = await getSidebar({ baseUrl, basePath });

  const flattenedItems = Object.values(entry.items).map((entry) => (() => {
    const href = slugToHref(entry.slug, workshopsConfig.baseUrl);
    switch (entry.type) {
      case 'file':
        return {
          type: 'doc',
          title: entry.title,
          description: entry.description,
          href,
        } as Doc
      case 'directory':
        const numItems = Object.keys(entry.items).length;
        return {
          type: 'category',
          title: entry.fsPath[entry.fsPath.length - 1],
          description: numItems === 1
            ? `${numItems} item`
            : `${numItems} items`,
          href,
        } as Category
      }
    })())

  const props = {
    breadcrumb: [],
    sidebar,
    type: 'category',
    items: flattenedItems,
  }
  
  return { props }
}