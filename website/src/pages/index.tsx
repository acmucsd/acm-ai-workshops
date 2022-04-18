import type { GetStaticProps, NextPage } from 'next'

import Navbar from '@/components/Navbar'
import Layout from '@/layouts/Layout'
import { workshopsConfig } from '@/lib/pipelines/workshops'
import { getSidebar, SidebarItem } from '@/lib/helpers/sidebar'
import type { SidebarItem as SidebarItemType } from '@/lib/helpers/sidebar'

import styles from '@/sections/index/styles.module.scss'

interface HomePageProps {
  sidebar: SidebarItemType[]
}

const Home: NextPage<HomePageProps> = ({ sidebar }) => {
  
  return (
    <>
      <Layout sidebar={sidebar} path="" className={styles.content} >
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

  const workshopsSidebar = await getSidebar({ basePath: workshopsBasePath, ...restWorkshopsConfig });

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