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
import PageProvider from "@/layout/context/Page";

import type { DocPageProps } from "@/layout/pages/types";
import { useMDX } from "@/layout/components/MDX/useMDX";

export default function DocPage ({ source, slug, fsPath, sidebar, toc }: DocPageProps) {
  const { asPath } = useRouter();

  const { MDXComponent } = useMDX({ source })

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
              <MDXComponent />
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