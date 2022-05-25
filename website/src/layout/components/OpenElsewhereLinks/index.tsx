import s from "./styles.module.scss"
import OpenInColab from "./OpenInColab"
import OpenInGithub from "./OpenInGithub"

interface OpenElsewhereLinksProps {
  fsPath: string[]
}

export default function OpenElsewhereLinks ({ fsPath }: OpenElsewhereLinksProps) {
  return (
    <div className={s.links}>
      <OpenInColab fsPath={fsPath} />
      <OpenInGithub fsPath={fsPath} />
    </div>
  )
}