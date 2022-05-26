import { useRouter } from "next/router";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MainWrapper from "@/layout/components/MainWrapper";
import SidebarContainer from "@/layout/components/SidebarContainer";
import ContentWrapper from "@/layout/components/ContentWrapper";
import ContentContainer from "@/layout/components/ContentContainer";
import CategoryItemsGrid from "@/layout/components/CategoryItemsGrid";
import PageProvider from "@/layout/context/Page";

import type { CategoryIndexPageProps, CategoryPageProps, CategoryReadmePageProps } from "@/layout/pages/types";
import CategoryIndexPage from "./CategoryIndexPage";
import CategoryReadmePage from "./CategoryReadmePage";

export default function CategoryPage ({ subtype, ...props }: CategoryPageProps) {
  switch (subtype) {
    case 'index':
      return <CategoryIndexPage {...props as CategoryIndexPageProps} />
    case 'readme':
      return <CategoryReadmePage {...props as CategoryReadmePageProps} />
  }
}