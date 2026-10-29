import { useState, type FormEvent } from 'react'
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  LoaderCircle,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import type { AuthMode } from '../types/auth'
import BrandMark from './BrandMark'

interface AuthScreenProps {
  onAuthenticate: (mode: AuthMode, values: Record<string, string>) => Promise<void>
  message: string
}

export default function AuthScreen({ onAuthenticate, message }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setFormError('')
    const values = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, string>

    try {
      await onAuthenticate(mode, values)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No fue posible completar la solicitud.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow-pink" aria-hidden="true" />
      <div className="auth-glow auth-glow-blue" aria-hidden="true" />

      <header className="auth-header">
        <a className="brand" href="#login">
          <BrandMark /><span className="brand-name">bckd<span>bank</span></span>
        </a>
        <span className="badge badge-primary"><span className="status-dot" />Entorno de demostración</span>
      </header>

      <div className="auth-layout">
        <section className="auth-hero" aria-label="Bckd Bank">
          <span className="eyebrow-pill">Tu banca, a tu ritmo</span>
          <h1>Lo importante<br /><em>es avanzar</em><span className="auth-dot">.</span></h1>
          <p>Un espacio claro para cuidar, mover y entender tu dinero.</p>

          <ul className="auth-features">
            <li><span className="feature-icon feature-purple"><Wallet size={18} /></span>Cuentas en dólares</li>
            <li><span className="feature-icon feature-pink"><ArrowLeftRight size={18} /></span>Transferencias simples</li>
            <li><span className="feature-icon feature-blue"><ShieldCheck size={18} /></span>Datos protegidos</li>
          </ul>

          <div className="auth-preview" aria-hidden="true">
            <div className="preview-balance">
              <div className="preview-top">
                <span>Saldo total disponible · USD</span>
                <span className="balance-chip">Vista de ejemplo</span>
              </div>
              <strong>US$ 8.420,50</strong>
              <div className="preview-bottom">
                <span>•••• 2846</span>
                <span className="card-circles"><i /><i /></span>
              </div>
            </div>
            <ul className="preview-list">
              <li>
                <span className="transaction-icon transaction-in"><ArrowDownLeft size={17} /></span>
                <span className="preview-text"><strong>Depósito recibido</strong><small>Hoy</small></span>
                <b className="amount-in">+US$ 1.200,00</b>
              </li>
              <li>
                <span className="transaction-icon transaction-out"><ArrowUpRight size={17} /></span>
                <span className="preview-text"><strong>Transferencia enviada</strong><small>Ayer</small></span>
                <b className="amount-out">−US$ 340,00</b>
              </li>
            </ul>
          </div>
        </section>

        <section className="auth-side" id="login">
          <div className="auth-card">
            <div className="auth-intro">
              <span className="eyebrow">ÁREA PERSONAL</span>
              <h2>{mode === 'login' ? 'Qué bueno verte.' : 'Empecemos.'}</h2>
              <p>{mode === 'login' ? 'Ingresa a tu espacio financiero.' : 'Crea tu acceso y abre tu primera cuenta.'}</p>
            </div>

            <div className="auth-tabs" role="tablist" aria-label="Acceso a la cuenta">
              <button
                type="button"
                className={mode === 'login' ? 'auth-tab active' : 'auth-tab'}
                onClick={() => { setMode('login'); setFormError('') }}
                role="tab"
                aria-selected={mode === 'login'}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                className={mode === 'register' ? 'auth-tab active' : 'auth-tab'}
                onClick={() => { setMode('register'); setFormError('') }}
                role="tab"
                aria-selected={mode === 'register'}
              >
                Crear cuenta
              </button>
            </div>

            <form className="auth-form" onSubmit={submit}>
              {mode === 'register' && (
                <div className="name-fields">
                  <label>Nombre<input name="firstName" autoComplete="given-name" required placeholder="Tu nombre" /></label>
                  <label>Apellido<input name="lastName" autoComplete="family-name" required placeholder="Tu apellido" /></label>
                </div>
              )}
              <label>Correo electrónico<input name="email" type="email" autoComplete="email" required placeholder="nombre@correo.com" /></label>
              <label>
                Contraseña
                <input
                  name="password"
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={6}
                  required
                  placeholder={mode === 'login' ? 'Tu contraseña' : 'Mínimo 6 caracteres'}
                />
              </label>
              {(formError || message) && <div className="alert alert-error" role="alert">{formError || message}</div>}
              <button className="primary-button auth-submit" type="submit" disabled={busy}>
                {busy
                  ? <LoaderCircle className="spin" size={18} />
                  : <>{mode === 'login' ? 'Entrar a mi cuenta' : 'Crear mi cuenta'}<ArrowRight size={17} /></>}
              </button>
            </form>

            <div className="auth-assurance"><ShieldCheck size={17} /><span>Tus datos viajan protegidos y cifrados.</span></div>
          </div>
        </section>
      </div>

      <footer className="auth-footer"><span>© 2026 Bckd Bank</span><span>Entorno de demostración</span></footer>
    </main>
  )
}
