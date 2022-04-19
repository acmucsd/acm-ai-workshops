import { useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { getMDXExport } from "mdx-bundler/client"

import MainWrapper from "@/layout/components/MainWrapper";
import SidebarContainer from "@/layout/components/SidebarContainer";
import ContentWrapper from "@/layout/components/ContentWrapper";
import ContentContainer from "@/layout/components/ContentContainer";
import TocContainer from "@/layout/components/TocContainer";
import MarkdownWrapper from "@/layout/components/MarkdownWrapper";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TocDesktop from "@/components/Toc/Desktop";
import components from "@/mdx/components";

import { toc as tocClassName } from "@/layout/components/TocContainer/styles.module.scss";

import type { DocPageProps } from "@/layout/pages/types";

export default function DocPage ({ breadcrumb, sidebar, code  }: DocPageProps) {
  const { asPath } = useRouter();
  const { default: Component, toc } = useMemo(() => getMDXExport(code), [code])

  const MDXContent = useCallback((props) => (
    <Component components={components} {...props} />
  ), [Component])

  return (
    <>
      <Navbar />
      <MainWrapper>
        <SidebarContainer><Sidebar items={sidebar} activePath={asPath} /></SidebarContainer>
        <ContentWrapper>
          <ContentContainer>
            <MarkdownWrapper>
              <MDXContent />
            </MarkdownWrapper>
          </ContentContainer>
          <TocContainer>
            <TocDesktop toc={toc} className={tocClassName} />
          </TocContainer>
        </ContentWrapper>
      </MainWrapper>
    </>
  )
}