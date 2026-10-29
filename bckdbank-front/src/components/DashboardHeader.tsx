import { ArrowLeftRight, LayoutDashboard, LogOut, Wallet } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import BrandMark from './BrandMark'

interface DashboardHeaderProps {
  email: string
  onLogout: () => void
}

export default function DashboardHeader({ email, onLogout }: DashboardHeaderProps) {
  const linkClass = ({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'is-active' : ''}`

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="brand" to="/" aria-label="Bckd Bank, inicio">
          <BrandMark /><span className="brand-name">bckd<span>bank</span></span>
        </Link>

        <nav className="top-nav" aria-label="Navegación principal">
          <NavLink to="/" end className={linkClass}>
            <LayoutDashboard size={17} /><span>Resumen</span>
          </NavLink>
          <NavLink to="/accounts" className={linkClass}>
            <Wallet size={17} /><span>Mis cuentas</span>
          </NavLink>
          <NavLink to="/activity" className={linkClass}>
            <ArrowLeftRight size={17} /><span>Movimientos</span>
          </NavLink>
        </nav>

        <div className="topbar-actions">
          <div className="status-pill"><span className="status-dot" />Sesión segura</div>
          <div className="profile-chip">
            <span className="avatar">{email.slice(0, 1).toUpperCase()}</span>
            <span className="profile-email">{email}</span>
          </div>
          <button className="icon-button" onClick={onLogout} aria-label="Cerrar sesión" title="Cerrar sesión">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
