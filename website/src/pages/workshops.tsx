import type { GetStaticProps, NextPage } from "next";
import { getSidebar } from "@/lib/helpers/sidebar";
import { workshopsConfig } from "@/lib/pipelines/workshops";
import { slugToHref } from "@/lib/utils/slugToHref";

import { useRouter } from "next/router";

import WorkshopIndexPage from "@/layouts/pages/WorkshopIndexPage";
import Layout from "@/layouts/Layout";
import { getFsTree } from "@/lib/helpers/fs-tree";
import type { IndexPageProps, WorkshopsPageProps } from "./workshops/[...slug]";

import styles from "@/sections/workshops/styles.module.scss"

const WorkshopsRootPage: NextPage<WorkshopsPageProps> = ({ type, sidebar, ...props }) => {
  const router = useRouter();

  return (
    <Layout sidebar={sidebar} path={router.asPath}>
      <h1 className={styles.title}>ACM AI Workshops</h1>
      <WorkshopIndexPage {...props as IndexPageProps} />
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
    getTitle,
    stripExtensionFromSlug,
  } = workshopsConfig

  const entry = await getFsTree({ basePath, globMatch, toMd, getTitle, stripExtensionFromSlug })
  
  const sidebar = await getSidebar({ baseUrl, basePath });

  const flattenedItems = Object.values(entry.items).map((entry) => (() => {
    const href = slugToHref(entry.slug, workshopsConfig.baseUrl);
    switch (entry.type) {
      case 'file':
        return {
          type: 'notebook',
          title: entry.title,
          description: '', // TODO
          href,
        }
      case 'directory':
        const numItems = Object.keys(entry.items).length;
        return {
          type: 'index',
          title: entry.fsPath[entry.fsPath.length - 1],
          description: numItems === 1
            ? `${numItems} item`
            : `${numItems} items`,
          href,
        }
      }
    })())

  const props = {
    breadcrumb: [],
    sidebar,
    type: 'index',
    items: flattenedItems,
  }
  
  return { props }
}