import Link from "next/link";

import styles from "./styles.module.scss";

import type { IndexPageProps } from "@/pages/workshops/[...slug]";

const WorkshopIndexPage = ({
  breadcrumb,
  items,
}: IndexPageProps): JSX.Element => {
  
  return (
    <div style={{
      height: "100%",
      padding: "2rem",
    }}>
      <main>
        <div className={styles.grid}>
          {items.map(({ type, href, title, description }) => (
            <Link key={href} href={href}>
              <a className={styles.card}>
                <h3>{title}</h3>
                <p>{description}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default WorkshopIndexPage;