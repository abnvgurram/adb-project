import { LogOut, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

function SiteHeader({ actionLabel, actionTo }) {
  const ActionIcon = actionLabel === 'Exit Admin' ? LogOut : Shield

  return (
    <div className="site-header-wrap">
      <header className="site-header">
        <Link className="site-brand" to="/">
          Siris Realty Group
        </Link>

        <Link className="button button--primary site-header__action" to={actionTo}>
          <ActionIcon size={18} />
          <span>{actionLabel}</span>
        </Link>
      </header>
    </div>
  )
}

export default SiteHeader
