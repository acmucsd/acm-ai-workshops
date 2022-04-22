import { useRouter } from "next/router";

import Navbar from "@/components/Navbar";
import MainWrapper from "@/layout/components/MainWrapper";
import Sidebar from "@/components/Sidebar";

import type { CategoryPageProps } from "@/layout/pages/types";
import SidebarContainer from "@/layout/components/SidebarContainer";
import ContentWrapper from "@/layout/components/ContentWrapper";
import ContentContainer from "@/layout/components/ContentContainer";
import CategoryItemsGrid from "@/layout/components/CategoryItemsGrid";

export default function CategoryPage ({ breadcrumb, sidebar, items }: CategoryPageProps) {
  const { asPath } = useRouter()

  return (
    <>
      <Navbar sidebar={sidebar} path={asPath} />
      <MainWrapper>
        <SidebarContainer><Sidebar items={sidebar} activePath={asPath} /></SidebarContainer>
        <ContentWrapper>
          <ContentContainer>
            <CategoryItemsGrid items={items} />
          </ContentContainer>
        </ContentWrapper>
      </MainWrapper>
    </>
  )
}