import Link from "next/link";

import s from "./styles.module.scss";

import type { IndexPageProps } from "@/pages/workshops/[...slug]";

const WorkshopIndexPage = ({ breadcrumb, items }: IndexPageProps): JSX.Element => {

  return (
    <div className={s.grid}>
      {items.map(({ type, href, title, description }) => (
        <Link key={href} href={href}>
          <a className={s.card}>
            <h3>{title}</h3>
            <p>{description}</p>
          </a>
        </Link>
      ))}
    </div>
  )
}

export default WorkshopIndexPage;