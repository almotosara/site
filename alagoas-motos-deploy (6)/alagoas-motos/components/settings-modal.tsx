'use client'

import { useState } from 'react'
import { useTheme } from './theme-provider'
import { TSI_META, TSI_META_PESQ } from '@/lib/constants'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  userName: string
  userEmail: string
  goal: number
  onGoalChange: (g: number) => void
  onSignOut: () => void
}

type Tab = 'perfil' | 'meta' | 'aparencia' | 'sobre'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'perfil', label: 'Perfil', icon: <IconUser /> },
  { id: 'meta', label: 'Meta mensal', icon: <IconTarget /> },
  { id: 'aparencia', label: 'Aparência', icon: <IconPalette /> },
  { id: 'sobre', label: 'Sobre', icon: <IconInfo /> },
]

export function SettingsModal({ open, onClose, userName, userEmail, goal, onGoalChange, onSignOut }: SettingsModalProps) {
  const [tab, setTab] = useState<Tab>('perfil')
  const [goalDraft, setGoalDraft] = useState(goal)
  const [saved, setSaved] = useState(false)
  const { theme, toggle } = useTheme()

  if (!open) return null

  function saveGoal() {
    onGoalChange(Math.max(1, goalDraft))
    setSaved(true)
    setTimeout(() => setSaved(false), 1600)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto"
      style={{ background: 'var(--overlay-bg)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', padding: '4vh 16px' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-[680px] rounded-2xl modal-anim overflow-hidden"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border-line-soft)', boxShadow: '0 20px 50px -12px var(--shadow-heavy)' }}
      >
        {/* Head */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border-line-soft)' }}>
          <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Configurações
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors"
            style={{ border: '1px solid var(--border-line)', background: 'var(--bg-elevated)', color: 'var(--text-dim)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex" style={{ minHeight: 380 }}>
          {/* Tabs (side nav) */}
          <div className="flex flex-col gap-1 px-3 py-4" style={{ width: 168, borderRight: '1px solid var(--border-line-soft)', flexShrink: 0 }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-[13.5px] font-semibold cursor-pointer transition-colors text-left"
                style={{
                  background: tab === t.id ? '#ff4b2b1f' : 'transparent',
                  color: tab === t.id ? '#ff4b2b' : 'var(--text-dim)',
                }}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="flex-1 px-6 py-5 overflow-y-auto">
            {tab === 'perfil' && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3.5">
                  <div className="rounded-full flex items-center justify-center font-bold text-white"
                    style={{ width: 52, height: 52, fontSize: 20, background: 'linear-gradient(135deg, #ff4b2b, #d63a1e)' }}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>{userName}</div>
                    <div className="text-[12.5px]" style={{ color: 'var(--text-muted)' }}>{userEmail}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>Nome</label>
                  <input value={userName} disabled className="settings-inp" style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>E-mail</label>
                  <input value={userEmail} disabled className="settings-inp" style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                </div>
                <p className="text-[11.5px]" style={{ color: 'var(--text-muted)' }}>
                  Nome e e-mail são definidos pela conta de acesso e não podem ser editados por aqui.
                </p>

                <div className="pt-3" style={{ borderTop: '1px solid var(--border-line-soft)' }}>
                  <button onClick={onSignOut} className="flex items-center gap-1.5 text-[13.5px] font-semibold cursor-pointer"
                    style={{ color: '#ff5a5f' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sair da conta
                  </button>
                </div>
              </div>
            )}

            {tab === 'meta' && (
              <div className="flex flex-col gap-5">
                <div>
                  <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                    Meta mensal de leads convertidos
                  </h4>
                  <p className="text-[12.5px]" style={{ color: 'var(--text-muted)' }}>
                    Usada no velocímetro do Painel para acompanhar quantos leads foram convertidos no mês.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number" min={1} value={goalDraft}
                    onChange={(e) => setGoalDraft(Number(e.target.value))}
                    className="settings-inp" style={{ maxWidth: 140, fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 700, textAlign: 'center' }}
                  />
                  <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>leads convertidos / mês</span>
                </div>
                <button onClick={saveGoal} className="settings-btn-primary self-start">
                  {saved ? 'Meta salva ✓' : 'Salvar meta'}
                </button>

                <div className="pt-4 mt-1" style={{ borderTop: '1px solid var(--border-line-soft)' }}>
                  <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 15, fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                    Metas TSI (referência)
                  </h4>
                  <div className="flex flex-col gap-1.5 text-[12.5px]" style={{ color: 'var(--text-muted)' }}>
                    <span>Top2Box mínimo: <b style={{ color: 'var(--text-primary)' }}>{TSI_META.toFixed(1)}%</b></span>
                    <span>Pesquisas por loja: <b style={{ color: 'var(--text-primary)' }}>{TSI_META_PESQ}</b></span>
                  </div>
                  <p className="text-[11.5px] mt-2" style={{ color: 'var(--text-muted)' }}>
                    Essas metas do TSI são fixas no sistema e usadas nos indicadores da tela de Metas.
                  </p>
                </div>
              </div>
            )}

            {tab === 'aparencia' && (
              <div className="flex flex-col gap-5">
                <div>
                  <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                    Tema da interface
                  </h4>
                  <p className="text-[12.5px]" style={{ color: 'var(--text-muted)' }}>Escolha entre o modo escuro ou claro.</p>
                </div>
                <div className="flex gap-3">
                  {(['dark', 'light'] as const).map((t) => {
                    const sel = theme === t
                    return (
                      <button
                        key={t}
                        onClick={() => { if (theme !== t) toggle() }}
                        className="flex-1 flex flex-col items-center gap-2 rounded-[12px] border py-4 cursor-pointer transition-all"
                        style={{
                          borderColor: sel ? '#ff4b2b' : 'var(--border-line)',
                          background: sel ? '#ff4b2b14' : 'var(--bg-input)',
                        }}
                      >
                        <div style={{ color: sel ? '#ff4b2b' : 'var(--text-dim)' }}>
                          {t === 'dark' ? <IconMoonLg /> : <IconSunLg />}
                        </div>
                        <span className="text-[13px] font-semibold" style={{ color: sel ? '#ff4b2b' : 'var(--text-dim)' }}>
                          {t === 'dark' ? 'Escuro' : 'Claro'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {tab === 'sobre' && (
              <div className="flex flex-col gap-4">
                <div>
                  <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                    Alagoas Motos — Painel de Leads
                  </h4>
                  <p className="text-[12.5px]" style={{ color: 'var(--text-muted)' }}>Versão 1.0</p>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                  Sistema interno de gestão de leads, relatórios e acompanhamento de pesquisas TSI / Top2Box,
                  com dados armazenados de forma segura na nuvem (Supabase).
                </p>
                <div className="flex flex-col gap-1 text-[12px] pt-2" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-line-soft)' }}>
                  <span>Desenvolvido para uso interno da equipe Alagoas Motos.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-inp {
          background: var(--bg-input); border: 1px solid var(--border-line); color: var(--text-primary);
          padding: 9px 12px; border-radius: 9px; font-size: 13.5px; outline: none; width: 100%;
          font-family: inherit; transition: border-color 0.12s, box-shadow 0.12s;
        }
        .settings-inp:focus { border-color: #ff4b2b; box-shadow: 0 0 0 3px #ff4b2b33; }
        .settings-btn-primary {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 16px; border-radius: 9px; border: 1px solid #ff4b2b;
          background: linear-gradient(135deg, #ff4b2b, #d63a1e); color: #fff;
          font-size: 13.5px; font-weight: 600; cursor: pointer; transition: 0.12s;
          box-shadow: 0 6px 16px -6px #ff4b2b70; font-family: inherit;
        }
        .settings-btn-primary:hover { filter: brightness(1.08); }
      `}</style>
    </div>
  )
}

function IconUser() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
function IconTarget() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
}
function IconPalette() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.2-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16c3.3 0 6-2.7 6-6 0-4.4-4.5-8-10-8Z"/></svg>
}
function IconInfo() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
}
function IconMoonLg() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
}
function IconSunLg() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
}
