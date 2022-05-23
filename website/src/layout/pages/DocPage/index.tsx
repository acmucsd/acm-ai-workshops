import { useRouter } from "next/router";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TocDesktop from "@/components/Toc/Desktop";
import MainWrapper from "@/layout/components/MainWrapper";
import SidebarContainer from "@/layout/components/SidebarContainer";
import ContentWrapper from "@/layout/components/ContentWrapper";
import ContentContainer from "@/layout/components/ContentContainer";
import TocContainer from "@/layout/components/TocContainer";
import BeforeMarkdown from "@/layout/components/BeforeMarkdown";
import OpenInColab from "@/layout/components/OpenInColab";
import MarkdownWrapper from "@/layout/components/MarkdownWrapper";
import { useMarkdown } from "@/layout/components/Markdown/useMarkdown";
import PageProvider from "@/layout/context/Page";

import type { DocPageProps } from "@/layout/pages/types";

export default function DocPage ({ source, slug, fsPath, sidebar, toc }: DocPageProps) {
  const { asPath } = useRouter();

  const { markdownReactElement, MarkdownComponent } = useMarkdown(source)

  return (
    <PageProvider sidebar={sidebar} toc={toc}>
      <Navbar sidebar={sidebar} path={asPath} />
      <MainWrapper>
        <SidebarContainer>
          <Sidebar items={sidebar} activePath={asPath} />
        </SidebarContainer>
        <ContentWrapper>
          <ContentContainer>
            <BeforeMarkdown>
              <OpenInColab fsPath={fsPath} />
            </BeforeMarkdown>
            <MarkdownWrapper>
              <MarkdownComponent fallback={<h1>Loading...</h1>} />
            </MarkdownWrapper>
          </ContentContainer>
          <TocContainer>
            <TocDesktop toc={toc} />
          </TocContainer>
        </ContentWrapper>
      </MainWrapper>
    </PageProvider>
  )
}