import { useState, type FormEvent } from 'react'
import { ArrowRight, ArrowUpRight, Check, LoaderCircle, ShieldCheck } from 'lucide-react'
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
    <main className="new-auth-page">
      {/* Esferas decorativas de luz de fondo (Glow Effects) */}
      <div className="glow-sphere sphere-one" aria-hidden="true" />
      <div className="glow-sphere sphere-two" aria-hidden="true" />

      {/* Marca de la app en la parte superior izquierda */}
      <header className="new-auth-header">
        <a className="brand brand-on-dark" href="#login">
          <BrandMark /><span className="brand-name">bckd<span>bank</span></span>
        </a>
      </header>

      <div className="new-auth-container">
        {/* LADO IZQUIERDO: TEXTO DESTACADO Y ELEMENTO VISUAL */}
        <section className="new-auth-hero">
          <div className="hero-content">
            <span className="new-eyebrow">TU BANCA, A TU RITMO</span>
            <h1>Lo importante<br />es avanzar<span className="dot">.</span></h1>
            <p>Un espacio claro para cuidar, mover y entender tu dinero.</p>
          </div>

          {/* Tarjeta de crédito interactiva en perspectiva refinada */}
          <div className="new-auth-visual" aria-hidden="true">
            <div className="perspective-card">
              <span className="card-tag">VISTA DE EJEMPLO</span>
              <strong className="card-amount">$ 8.420,50</strong>
              <div className="card-footer">
                <span>•••• 2846</span>
                <span className="circles"><i /><i /></span>
              </div>
            </div>
            <div className="floating-badge badge-ok"><Check size={16} /></div>
            <div className="floating-badge badge-trend"><ArrowUpRight size={18} /></div>
          </div>
        </section>

        {/* LADO DERECHO: FORMULARIO FLOTANTE (Efecto Cristal) */}
        <section className="new-auth-glass-side">
          <div className="glass-card">
            <div className="auth-intro">
              <span className="form-eyebrow">ÁREA PERSONAL</span>
              <h2>{mode === 'login' ? 'Qué bueno verte.' : 'Empecemos.'}</h2>
            </div>

            <div className="new-auth-tabs" role="tablist">
              <button
                className={mode === 'login' ? 'tab-btn active' : 'tab-btn'}
                onClick={() => { setMode('login'); setFormError('') }}
                role="tab"
              >
                Iniciar sesión
              </button>
              <button
                className={mode === 'register' ? 'tab-btn active' : 'tab-btn'}
                onClick={() => { setMode('register'); setFormError('') }}
                role="tab"
              >
                Crear cuenta
              </button>
            </div>

            <form className="new-auth-form" onSubmit={submit}>
              {mode === 'register' && (
                <div className="form-row-names">
                  <label>Nombre<input name="firstName" required placeholder="Tu nombre" /></label>
                  <label>Apellido<input name="lastName" required placeholder="Tu apellido" /></label>
                </div>
              )}
              <label>Correo electrónico<input name="email" type="email" required placeholder="nombre@correo.com" /></label>
              <label>Contraseña<input name="password" type="password" minLength={6} required placeholder="••••••••" /></label>
              
              {(formError || message) && <div className="form-alert">{formError || message}</div>}
              
              <button className="new-submit-btn" type="submit" disabled={busy}>
                {busy ? <LoaderCircle className="spin" size={18} /> : <>{mode === 'login' ? 'Entrar a mi cuenta' : 'Crear mi cuenta'}<ArrowRight size={17} /></>}
              </button>
            </form>

            <div className="new-assurance"><ShieldCheck size={16} /><span>Datos cifrados de extremo a extremo.</span></div>
          </div>
        </section>
      </div>

      <footer className="new-auth-footer">
        <span>FINANZAS MÁS HUMANAS · 01 — 03</span>
        <span>© 2026 Bckd Bank · Entorno de demostración</span>
      </footer>
    </main>
  )
}
