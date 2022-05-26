import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TocDesktop from "@/components/Toc/Desktop";
import BeforeMarkdown from "@/layout/components/BeforeMarkdown";
import ContentContainer from "@/layout/components/ContentContainer";
import ContentWrapper from "@/layout/components/ContentWrapper";
import MainWrapper from "@/layout/components/MainWrapper";
import MarkdownWrapper from "@/layout/components/MarkdownWrapper";
import { useMDX } from "@/layout/components/MDX/useMDX";
import OpenInGithub from "@/layout/components/OpenElsewhereLinks/OpenInGithub";
import SidebarContainer from "@/layout/components/SidebarContainer";
import TocContainer from "@/layout/components/TocContainer";
import PageProvider from "@/layout/context/Page";
import { useRouter } from "next/router";
import { CategoryReadmePageProps } from "../../types";

export default function CategoryReadmePage ({ source, slug, fsPath, sidebar, toc }: CategoryReadmePageProps) {
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
              <OpenInGithub fsPath={fsPath} />
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