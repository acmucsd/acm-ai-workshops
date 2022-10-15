import { getSidebar } from '@/lib/pipeline/sidebar'
import { workshopsConfig } from '@/lib/pipeline/configs/workshops'
import { validateConfig } from '@/lib/pipeline/validate-config'
import type { SidebarItem as SidebarItemType } from '@/lib/pipeline/sidebar/types'

import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import MainWrapper from '@/layout/components/MainWrapper'
import SidebarContainer from '@/layout/components/SidebarContainer'
import ContentWrapper from '@/layout/components/ContentWrapper'
import ContentContainer from '@/layout/components/ContentContainer'
import PageProvider from '@/layout/context/Page'

import s from '@/sections/index/styles.module.scss'

import type { GetStaticProps, NextPage } from 'next'
import type { WithSidebar } from '@/layout/pages/types'
import MarkdownWrapper from '@/layout/components/MarkdownWrapper'

interface HomePageProps extends WithSidebar {}

const Home: NextPage<HomePageProps> = ({ sidebar }) => {

  return (
    <PageProvider sidebar={sidebar}>
      <Navbar sidebar={sidebar} path="" />
      <MainWrapper>
        {/* use dummy path of empty string, so nothing is the active path */}
        <SidebarContainer><Sidebar items={sidebar} activePath="" /></SidebarContainer>
        <ContentWrapper>
          <ContentContainer>
            <MarkdownWrapper>
              <h1>ACM AI Wiki</h1>
              <p>Welcome to the ACM AI Wiki!</p>
              <p>The ACM AI wiki serves as a central repository for various resources produced by ACM AI.</p>
            </MarkdownWrapper>
          </ContentContainer>
        </ContentWrapper>
      </MainWrapper>
    </PageProvider>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {

  const config = validateConfig(workshopsConfig)

  // we can add other sidebars here as well if we want to have stuff other than just the workshops here
  const workshopsSidebar = await getSidebar(config);

  // populate the list of sidebars we want to render on the main page
  const sidebar: SidebarItemType[] = [
    {
      type: 'category',
      href: '/workshops',
      label: 'Workshops',
      items: workshopsSidebar as SidebarItemType[],
    }
  ]

  const props = {
    sidebar,
  }
  
  return { props }
}