import { useMemo } from "react"
import Link from "next/link"

import { getGithubSlug } from "@/helpers/github"

import s from "../styles.module.scss"

const getColabUrl = (fsPath: string[]) => `https://colab.research.google.com/github/${getGithubSlug(fsPath)}`

interface OpenInColabProps {
  fsPath: string[]
}

export default function OpenInColab ({ fsPath }: OpenInColabProps) {
  const colabUrl = useMemo(() => getColabUrl(fsPath), [fsPath])

  return (
    <Link href={colabUrl}><a className={s.link}>
      <span className={s.label}>Open in Colab</span>
      {ExternalLinkSvg}
    </a></Link>
  )
}

const ExternalLinkSvg = (
  <svg className={s.svg} width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor">
    <path d="M36 24c-1.2 0-2 0.8-2 2v12c0 1.2-0.8 2-2 2h-22c-1.2
    0-2-0.8-2-2v-22c0-1.2 0.8-2 2-2h12c1.2 0 2-0.8 2-2s-0.8-2-2-2h-12c-3.4
    0-6 2.6-6 6v22c0 3.4 2.6 6 6 6h22c3.4 0 6-2.6
    6-6v-12c0-1.2-0.8-2-2-2z" />
    <path d="M43.8 5.2c-0.2-0.4-0.6-0.8-1-1-0.2-0.2-0.6-0.2-0.8-0.2h-12c-1.2
    0-2 0.8-2 2s0.8 2 2 2h7.2l-18.6 18.6c-0.8 0.8-0.8 2 0 2.8 0.4 0.4 0.8
    0.6 1.4 0.6s1-0.2 1.4-0.6l18.6-18.6v7.2c0 1.2 0.8 2 2 2s2-0.8
    2-2v-12c0-0.2 0-0.6-0.2-0.8z" />
  </svg>
)