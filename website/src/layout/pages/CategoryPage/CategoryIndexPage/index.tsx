import { useRouter } from "next/router";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MainWrapper from "@/layout/components/MainWrapper";
import SidebarContainer from "@/layout/components/SidebarContainer";
import ContentWrapper from "@/layout/components/ContentWrapper";
import ContentContainer from "@/layout/components/ContentContainer";
import CategoryItemsGrid from "@/layout/components/CategoryItemsGrid";
import PageProvider from "@/layout/context/Page";

import type { CategoryIndexPageProps } from "@/layout/pages/types";
import BeforeMarkdown from "@/layout/components/BeforeMarkdown";
import OpenInGithub from "@/layout/components/OpenElsewhereLinks/OpenInGithub";

export default function CategoryIndexPage ({ slug, sidebar, items, fsPath }: CategoryIndexPageProps) {
  const { asPath } = useRouter()

  return (
    <PageProvider sidebar={sidebar}>
      <Navbar sidebar={sidebar} path={asPath} />
      <MainWrapper>
        <SidebarContainer><Sidebar items={sidebar} activePath={asPath} /></SidebarContainer>
        <ContentWrapper>
          <ContentContainer>
            <BeforeMarkdown>
              <OpenInGithub fsPath={fsPath} />
            </BeforeMarkdown>
            <CategoryItemsGrid items={items} />
          </ContentContainer>
        </ContentWrapper>
      </MainWrapper>
    </PageProvider>
  )
}