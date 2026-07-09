'use client'

import { useState, useMemo, useCallback } from 'react'
import type { Lead } from '@/lib/types'
import { STATUS_COLORS, ORIGEM_COLORS, fmtDate, STATUS_OPTIONS } from '@/lib/constants'
import { useToast } from '@/components/toast'

interface LeadsViewProps {
  leads: Lead[]
  onEdit: (l: Lead) => void
  onDelete: (id: string) => void
  onConvert: (id: string) => void
  onNew: () => void
}

const INP_STYLE: React.CSSProperties = {
  background: 'var(--bg-input)', border: '1px solid var(--border-line)', color: 'var(--text-primary)',
  padding: '9px 12px', borderRadius: 9, fontSize: 13.5, outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.12s',
}

const SEARCH_INP_STYLE: React.CSSProperties = {
  background: 'var(--bg-input)', border: '1px solid var(--border-line)', color: 'var(--text-primary)',
  padding: '9px 12px 9px 36px', borderRadius: 9, fontSize: 13.5, outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.12s', width: '100%',
}

const COPY_BTN_STYLE: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 3,
  padding: '2px 6px', borderRadius: 5, border: '1px solid var(--border-line)',
  background: 'var(--bg-elevated)', color: 'var(--text-muted)',
  fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
  transition: 'all 0.15s', lineHeight: 1.4,
}

export function LeadsView({ leads, onEdit, onDelete, onConvert, onNew }: LeadsViewProps) {
  const [q, setQ] = useState('')
  const [origem, setOrigem] = useState('')
  const [status, setStatus] = useState('')
  const [de, setDe] = useState('')
  const [ate, setAte] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [copiedBtn, setCopiedBtn] = useState<string | null>(null)
  const toast = useToast()

  const copyText = useCallback((text: string, label: string, key: string) => {
    if (!text || text === '—') return
    navigator.clipboard.writeText(text).then(() => {
      toast(`${label} copiado!`)
      setCopiedBtn(key)
      setTimeout(() => setCopiedBtn(null), 1200)
    }).catch(() => { toast('Não foi possível copiar.', true) })
  }, [toast])

  const copyTudo = useCallback((l: Lead) => {
    const lines = [
      `Nome: ${l.nome || '—'}`,
      `Telefone: ${l.telefone || '—'}`,
      `Email: ${l.email || '—'}`,
      `CPF: ${l.cpf || '—'}`,
      `Modelo: ${l.modelo || '—'}`,
      `OS: ${l.os || '—'}`,
    ].join('\n')
    navigator.clipboard.writeText(lines).then(() => {
      toast('Dados completos copiados!')
    }).catch(() => { toast('Não foi possível copiar.', true) })
  }, [toast])

  const filtered = useMemo(() => leads.filter((l) => {
    const text = q.toLowerCase()
    if (text && !l.nome.toLowerCase().includes(text) &&
      !(l.telefone || '').includes(text) &&
      !(l.os || '').toLowerCase().includes(text) &&
      !(l.nf || '').includes(text) &&
      !(l.email || '').toLowerCase().includes(text) &&
      !(l.cpf || '').includes(text) &&
      !(l.modelo || '').toLowerCase().includes(text)) return false
    if (origem && l.origem !== origem) return false
    if (status && l.status !== status) return false
    if (de && l.data && l.data < de) return false
    if (ate && l.data && l.data > ate) return false
    return true
  }), [leads, q, origem, status, de, ate])

  return (
    <div className="view-enter flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2.5 items-end">
        <div className="relative flex-1 min-w-[220px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome, telefone, OS, NF, email ou CPF..."
            style={SEARCH_INP_STYLE} />
        </div>
        <select value={origem} onChange={(e) => setOrigem(e.target.value)} style={{ ...INP_STYLE, minWidth: 145 }}>
          <option value="">Todas origens</option>
          <option>Bot WhatsApp</option>
          <option>Website</option>
          <option>MicroWork OS</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ ...INP_STYLE, minWidth: 145 }}>
          <option value="">Todos status</option>
          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <div className="flex items-center gap-1.5">
          <input type="date" value={de} onChange={(e) => setDe(e.target.value)} style={INP_STYLE} title="De" />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>até</span>
          <input type="date" value={ate} onChange={(e) => setAte(e.target.value)} style={INP_STYLE} title="Até" />
        </div>
      </div>

      {/* Table — igual ao HTML de referência */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-line-soft)' }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16" style={{ color: 'var(--text-muted)' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2.5 opacity-35"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
            <p className="text-sm">Nenhum lead encontrado com esses filtros.</p>
            <button onClick={onNew} className="mt-3 flex items-center gap-1.5 text-xs text-[#ff4b2b] hover:underline cursor-pointer">
              Cadastrar primeiro lead
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13.5px]">
              <thead>
                <tr>
                  {['Cliente · Copiar', 'Origem', 'O.S.', 'NF', 'Data · Modelo · Email · CPF', 'Status', ''].map((h) => (
                    <th key={h} className="text-left px-3.5 py-3 text-[10.5px] uppercase tracking-widest font-bold last:text-right whitespace-nowrap"
                      style={{ background: 'var(--bg-panel-2)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-line-soft)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => {
                  const sc = STATUS_COLORS[l.status]
                  const oc = ORIGEM_COLORS[l.origem]
                  const bk = `cb-${l.id}`
                  return (
                    <tr key={l.id} className="transition-colors last:border-0"
                      style={{ borderBottom: '1px solid var(--border-line-soft)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-panel-2)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                      {/* Cliente · Copiar */}
                      <td className="px-3.5 py-3" style={{ maxWidth: 280 }}>
                        <b className="block font-semibold" style={{ color: 'var(--text-primary)' }}>{l.nome}</b>
                        {l.telefone && (
                          <span
                            className="text-[11.5px] cursor-pointer hover:underline"
                            style={{ color: 'var(--text-muted)' }}
                            onClick={() => copyText(l.telefone!, 'Telefone', `${l.id}-tel`)}
                            title="Clique para copiar telefone"
                          >{l.telefone}</span>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          <button onClick={() => copyText(l.nome, 'Nome', `${l.id}-nome`)} style={COPY_BTN_STYLE}>Nome</button>
                          {l.telefone && <button onClick={() => copyText(l.telefone, 'Telefone', `${l.id}-tel2`)} style={COPY_BTN_STYLE}>Tel</button>}
                          {l.email && <button onClick={() => copyText(l.email, 'E-mail', `${l.id}-email`)} style={COPY_BTN_STYLE}>Email</button>}
                          {l.cpf && <button onClick={() => copyText(l.cpf, 'CPF', `${l.id}-cpf`)} style={COPY_BTN_STYLE}>CPF</button>}
                          {l.modelo && <button onClick={() => copyText(l.modelo, 'Modelo', `${l.id}-modelo`)} style={COPY_BTN_STYLE}>Modelo</button>}
                          {l.os && <button onClick={() => copyText(l.os, 'O.S.', `${l.id}-os`)} style={COPY_BTN_STYLE}>O.S.</button>}
                          <button onClick={() => copyTudo(l)} style={COPY_BTN_STYLE}>Tudo</button>
                        </div>
                      </td>
                      {/* Origem */}
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11.5px] font-semibold" style={{ background: oc.bg, color: oc.text }}>{l.origem}</span>
                      </td>
                      {/* O.S. */}
                      <td className="px-3.5 py-3 font-mono text-xs whitespace-nowrap" style={{ color: 'var(--text-dim)' }}>{l.os || '—'}</td>
                      {/* NF */}
                      <td className="px-3.5 py-3 font-mono text-xs whitespace-nowrap" style={{ color: 'var(--text-dim)' }}>{l.nf || '—'}</td>
                      {/* Data · Modelo · Email · CPF */}
                      <td className="px-3.5 py-3">
                        <div style={{ color: 'var(--text-dim)' }}>{fmtDate(l.data)}</div>
                        {l.modelo && <div className="text-[11.5px]" style={{ color: 'var(--text-muted)' }}>{l.modelo}</div>}
                        {l.email && (
                          <div
                            className="text-[11px] cursor-pointer hover:underline"
                            style={{ color: 'var(--text-muted)' }}
                            onClick={() => copyText(l.email, 'E-mail', `${l.id}-email2`)}
                            title="Clique para copiar e-mail"
                          >{l.email}</div>
                        )}
                        {l.cpf && (
                          <div className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>{l.cpf}</div>
                        )}
                      </td>
                      {/* Status */}
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11.5px] font-semibold" style={{ background: sc.bg, color: sc.text }}>{l.status}</span>
                      </td>
                      {/* Ações */}
                      <td className="px-3.5 py-3">
                        <div className="flex gap-1.5 justify-end">
                          {l.status !== 'Convertido' && (
                            <IconBtn title="Converter" onClick={() => onConvert(l.id)} green>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            </IconBtn>
                          )}
                          <IconBtn title="Editar" onClick={() => onEdit(l)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </IconBtn>
                          {confirmDelete === l.id ? (
                            <div className="flex gap-1">
                              <IconBtn title="Confirmar" onClick={() => { onDelete(l.id); setConfirmDelete(null) }} danger>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                              </IconBtn>
                              <IconBtn title="Cancelar" onClick={() => setConfirmDelete(null)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                              </IconBtn>
                            </div>
                          ) : (
                            <IconBtn title="Excluir" onClick={() => setConfirmDelete(l.id)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                            </IconBtn>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {/* Footer count */}
        <div className="px-3.5 py-2.5 text-[12px]" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-line-soft)' }}>
          {filtered.length} lead(s) encontrados de {leads.length} no total.
        </div>
      </div>
    </div>
  )
}

function IconBtn({ children, onClick, title, danger, green }: { children: React.ReactNode; onClick: () => void; title?: string; danger?: boolean; green?: boolean }) {
  const baseColor = green ? '#2fd675' : danger ? '#ff5a5f' : 'var(--text-dim)'
  const hoverColor = green ? '#2fd675' : danger ? '#ff5a5f' : 'var(--text-primary)'
  return (
    <button onClick={onClick} title={title}
      className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors"
      style={{
        border: `1px solid ${green ? '#2fd67544' : danger ? '#ff5a5f44' : 'var(--border-line)'}`,
        background: green ? '#2fd67518' : danger ? '#ff5a5f26' : 'var(--bg-elevated)',
        color: baseColor,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = hoverColor }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = baseColor }}
    >
      {children}
    </button>
  )
}