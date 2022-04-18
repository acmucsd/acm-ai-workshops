import { getSidebar } from '@/lib/helpers/sidebar'
import { workshopsConfig } from '@/lib/pipelines/workshops'
import type { SidebarItem as SidebarItemType } from '@/lib/helpers/sidebar'

import Layout from '@/layouts/Layout'

import s from '@/sections/index/styles.module.scss'

import type { GetStaticProps, NextPage } from 'next'

interface HomePageProps {
  sidebar: SidebarItemType[]
}

const Home: NextPage<HomePageProps> = ({ sidebar }) => {

  return (
    <>
      {/* use dummy path of empty string, so nothing is the active path */}
      <Layout sidebar={sidebar} path="" className={s.content} >
        <h1>ACM AI Wiki</h1>
        <p>Welcome to the ACM AI Wiki!</p>
        <p>The ACM AI wiki serves as a central repository for various resources produced by ACM AI.</p>
      </Layout>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {

  const {
    root_filepath: workshopsBasePath,
    ...restWorkshopsConfig
  } = workshopsConfig

  // we can add other sidebars here as well if we want to have stuff other than just the workshops here
  const workshopsSidebar = await getSidebar({ basePath: workshopsBasePath, ...restWorkshopsConfig });

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