import Link from "next/link"
import c from "clsx";

import s from "./styles.module.scss";

import type { Item } from "@/layout/pages/types"

const itemEmojis: Record<Item['type'], string> = {
  doc: '📄️',
  category: '📁',
}

interface CategoryGridProps {
  items: Item[]
}

export default function CategoryGrid ({ items }: CategoryGridProps) {
  return (
    <div className={s.grid}>
      {items.map(({ type, href, title, description }) => (
        <Link key={href} href={href}><a className={s.card}>
          {/* we construct the label from our locally sourced files so we can assume it's safe */}
          <h3 className={c(s.title, s.truncate)} dangerouslySetInnerHTML={{ __html: `${itemEmojis[type]} ${title}` }} />
          <p className={c(s.description, s.truncate)} dangerouslySetInnerHTML={{ __html: description ?? '' }} />
        </a></Link>
      ))}
    </div>
  )
}