import { ArrowLeftRight, ArrowUpRight, Clock3, RefreshCw, Wallet } from 'lucide-react'
import { formatMoney, shortDate } from '../lib/formatters'

interface DashboardSummaryProps {
  firstName: string
  accountCount: number
  totalBalance: number
  transactionCount: number
  loading: boolean
  onRefresh: () => void
  onOpenTransfer: () => void
}

export default function DashboardSummary({
  firstName,
  accountCount,
  totalBalance,
  transactionCount,
  loading,
  onRefresh,
  onOpenTransfer,
}: DashboardSummaryProps) {
  return (
    <section className="hero" aria-label="Resumen financiero">
      <div className="hero-main">
        <div className="hero-top">
          <div>
            <span className="hero-eyebrow">TU ESPACIO FINANCIERO</span>
            <h1>Hola, {firstName}<span className="wave-mark">.</span></h1>
          </div>
          <span className="hero-date"><Clock3 size={15} />{shortDate.format(new Date())}</span>
        </div>

        <div className="hero-balance">
          <span className="hero-balance-label">Saldo total disponible · USD</span>
          <div className="balance-value">
            {loading ? <span className="balance-skeleton" /> : formatMoney(totalBalance)}
          </div>
          <span className="hero-balance-note">
            Consolidado de {accountCount} {accountCount === 1 ? 'cuenta' : 'cuentas'}
          </span>
        </div>

        <div className="hero-actions">
          <button className="hero-button hero-button-primary" onClick={onOpenTransfer} disabled={accountCount === 0}>
            <ArrowUpRight size={18} />Transferir dinero
          </button>
          <button className="hero-button" onClick={onRefresh}>
            <RefreshCw size={16} />Actualizar saldos
          </button>
        </div>
      </div>

      <div className="hero-stats">
        <article className="hero-stat">
          <span className="hero-stat-icon hero-stat-blue"><Wallet size={19} /></span>
          <span className="hero-stat-label">Cuentas activas</span>
          <strong>{loading ? '—' : accountCount}</strong>
        </article>
        <article className="hero-stat">
          <span className="hero-stat-icon hero-stat-pink"><ArrowLeftRight size={19} /></span>
          <span className="hero-stat-label">Movimientos registrados</span>
          <strong>{loading ? '—' : transactionCount}</strong>
        </article>
      </div>
    </section>
  )
}
