import { getFsTree } from "@/lib/pipeline/fs-tree";
import { getSidebar } from "@/lib/pipeline/sidebar";
import { workshopsConfig } from "@/lib/pipeline/configs/workshops";
import { slugToHref } from "@/utils/slugToHref";

import { useRouter } from "next/router";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CategoryItemsGrid from "@/layout/components/CategoryItemsGrid";
import ContentContainer from "@/layout/components/ContentContainer";
import ContentWrapper from "@/layout/components/ContentWrapper";
import MainWrapper from "@/layout/components/MainWrapper";
import SidebarContainer from "@/layout/components/SidebarContainer";
import PageProvider from "@/layout/context/Page";

import s from "@/sections/workshops/styles.module.scss"

import type { GetStaticProps, NextPage } from "next";
import type { Category, CategoryIndexPageProps, Doc } from "@/layout/pages/types";
import { validateConfig } from "@/lib/pipeline/validate-config";

const WorkshopsRootPage: NextPage<Exclude<CategoryIndexPageProps, 'path'>> = ({ sidebar, items, ...props }) => {
  const router = useRouter();

  return (
    <PageProvider sidebar={sidebar}>
      <Navbar sidebar={sidebar} path={router.asPath} />
      <MainWrapper>
        <SidebarContainer><Sidebar items={sidebar} activePath={router.asPath} /></SidebarContainer>
        <ContentWrapper>
          <ContentContainer>
            <h1 className={s.title}>ACM AI Workshops</h1>
            <CategoryItemsGrid items={items} />
          </ContentContainer>
        </ContentWrapper>
      </MainWrapper>
    </PageProvider>
  );
};

export default WorkshopsRootPage;

export const getStaticProps: GetStaticProps = async () => {

  const config = validateConfig(workshopsConfig)

  const entry = await getFsTree(config)
  const sidebar = await getSidebar(config);

  const flattenedItems = Object.values(entry.items).map(({ type, slug, title, description }) => (() => {
    const href = slugToHref(slug, workshopsConfig.baseUrl);
    const commonChildObject = { title, description, href }
      switch (type) {
      case 'file':
        return { type: 'doc', ...commonChildObject } as Doc
      case 'directory':
        return { type: 'category', ...commonChildObject } as Category
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