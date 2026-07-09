'use client'

import { useMemo } from 'react'
import type { TsiRow } from '@/lib/types'
import { TSI_META, TSI_YELLOW, TSI_META_PESQ, TSI_STORE_MAP, tsiColor, tsiPesqColor } from '@/lib/constants'

interface TsiViewProps {
  tsiData: TsiRow[]
  tsiUpdatedAt: string | null
  onImport: () => void
}

interface StoreSummary {
  loja: string
  pesquisas: number
  t2bSum: number
  t2bCount: number
  tsiSum: number
  tsiCount: number
}

export function TsiView({ tsiData, tsiUpdatedAt, onImport }: TsiViewProps) {
  const storeMap: Record<string, StoreSummary> = useMemo(() => {
    const m: Record<string, StoreSummary> = {}
    tsiData.forEach((r) => {
      const raw = r.loja || ''
      const name = TSI_STORE_MAP[raw] || raw || 'Outros'
      if (!m[name]) m[name] = { loja: name, pesquisas: 0, t2bSum: 0, t2bCount: 0, tsiSum: 0, tsiCount: 0 }
      m[name].pesquisas++
      if (r.t2b !== null) { m[name].t2bSum += Number(r.t2b); m[name].t2bCount++ }
      if (r.tsi !== null) { m[name].tsiSum += Number(r.tsi); m[name].tsiCount++ }
    })
    return m
  }, [tsiData])

  const stores = Object.values(storeMap).sort((a, b) => b.pesquisas - a.pesquisas)

  const globalT2b = useMemo(() => {
    let sum = 0, count = 0
    tsiData.forEach((r) => { if (r.t2b !== null) { sum += Number(r.t2b); count++ } })
    return count > 0 ? sum / count : null
  }, [tsiData])

  const globalTsi = useMemo(() => {
    let sum = 0, count = 0
    tsiData.forEach((r) => { if (r.tsi !== null) { sum += Number(r.tsi); count++ } })
    return count > 0 ? sum / count : null
  }, [tsiData])

  const totalPesquisas = tsiData.length

  const pct = globalT2b != null ? Math.min(100, (globalT2b / 100) * 100) : 0
  const R = 70
  const ARC = Math.PI * R
  const filled = (pct / 100) * ARC
  const gColor = globalT2b == null ? '#868c94' : globalT2b >= TSI_META ? '#2fd675' : globalT2b >= TSI_YELLOW ? '#ffc400' : '#ff5a5f'

  return (
    <div className="view-enter flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>TSI — Top2Box</h2>
          <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Meta Top2Box: <b style={{ color: 'var(--text-primary)' }}>{TSI_META}%</b> · Meta pesquisas/loja: <b style={{ color: 'var(--text-primary)' }}>{TSI_META_PESQ}</b>
            {tsiUpdatedAt && <> · Atualizado: <b style={{ color: 'var(--text-primary)' }}>{tsiUpdatedAt}</b></>}
          </p>
        </div>
        <button onClick={onImport}
          className="flex items-center gap-1.5 px-4 py-2 rounded-[9px] text-white font-semibold text-[13.5px] cursor-pointer hover:brightness-110 transition-all"
          style={{ background: 'linear-gradient(135deg, #ff4b2b, #d63a1e)', border: '1px solid #ff4b2b', boxShadow: '0 6px 16px -6px #ff4b2b70' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/></svg>
          Anexar planilha TSI
        </button>
      </div>

      {tsiData.length === 0 ? (
        <div className="rounded-2xl p-12 text-center cursor-pointer transition-colors" style={{ border: '2px dashed var(--border-line)', color: 'var(--text-muted)' }}
          onClick={onImport} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#ff4b2b'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-line)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-50"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/></svg>
          <p className="font-semibold mb-1">Nenhuma planilha TSI importada</p>
          <p className="text-sm">Clique aqui ou no botão acima para importar um arquivo .xlsx ou .csv</p>
        </div>
      ) : (
        <>
          {/* KPI row */}
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="rounded-2xl px-5 py-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-line-soft)' }}>
              <p className="text-[11.5px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Top2Box Geral</p>
              <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 38, fontWeight: 800, lineHeight: 1, color: gColor }}>
                {globalT2b != null ? `${globalT2b.toFixed(1)}%` : '—'}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Meta: {TSI_META}%</p>
            </div>
            <div className="rounded-2xl px-5 py-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-line-soft)' }}>
              <p className="text-[11.5px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Nota TSI Geral</p>
              <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 38, fontWeight: 800, lineHeight: 1, color: '#4c8dff' }}>
                {globalTsi != null ? globalTsi.toFixed(2) : '—'}
              </p>
            </div>
            <div className="rounded-2xl px-5 py-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-line-soft)' }}>
              <p className="text-[11.5px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Total de pesquisas</p>
              <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 38, fontWeight: 800, lineHeight: 1, color: '#ffc400' }}>{totalPesquisas}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stores.length} lojas</p>
            </div>
          </div>

          {/* Gauge + table row */}
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
            {/* Gauge */}
            <div className="rounded-2xl p-5 flex flex-col items-center justify-center" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-line-soft)' }}>
              <p className="text-[11.5px] uppercase tracking-widest font-semibold mb-2 self-start" style={{ color: 'var(--text-muted)' }}>Top2Box Gauge</p>
              <svg width="180" height="100" viewBox="0 0 180 100">
                <path d="M 20 90 A 70 70 0 0 1 160 90" fill="none" stroke="var(--bg-elevated)" strokeWidth="14" strokeLinecap="round" />
                <path d="M 20 90 A 70 70 0 0 1 160 90" fill="none" stroke={gColor} strokeWidth="14" strokeLinecap="round"
                  strokeDasharray={`${filled} ${ARC}`} style={{ transition: 'stroke-dasharray 0.6s' }} />
              </svg>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 36, fontWeight: 700, marginTop: -30, color: gColor, lineHeight: 1 }}>
                {globalT2b != null ? `${globalT2b.toFixed(1)}%` : '—'}
              </div>
              <div className="text-xs uppercase tracking-widest mt-2" style={{ color: 'var(--text-muted)' }}>
                {globalT2b == null ? 'Sem dados' : globalT2b >= TSI_META ? 'Acima da meta' : globalT2b >= TSI_YELLOW ? 'Atenção' : 'Abaixo da meta'}
              </div>
              <div className="flex gap-3 mt-4 text-[10.5px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#2fd675]" />≥{TSI_META}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#ffc400]" />≥{TSI_YELLOW}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#ff5a5f]" />Abaixo</span>
              </div>
            </div>

            {/* Store table */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-line-soft)' }}>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 18, fontWeight: 700, margin: 0, padding: '16px 20px', borderBottom: '1px solid var(--border-line-soft)', color: 'var(--text-primary)', borderLeft: '3px solid #ff4b2b', paddingLeft: 14 }}>
                Por loja
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr>
                      {['Loja', 'Pesquisas', 'Top2Box', 'Nota TSI'].map((h) => (
                        <th key={h} className="text-left px-4 py-2.5 text-[10.5px] uppercase tracking-widest font-bold" style={{ background: 'var(--bg-panel-2)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-line-soft)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stores.map((s) => {
                      const t2b = s.t2bCount > 0 ? s.t2bSum / s.t2bCount : null
                      const tsi = s.tsiCount > 0 ? s.tsiSum / s.tsiCount : null
                      const tc = t2b != null ? tsiColor(t2b) : 'dim'
                      const pc = tsiPesqColor(s.pesquisas)
                      const colors = { green: '#2fd675', yellow: '#ffc400', red: '#ff5a5f', dim: '#868c94' }
                      return (
                        <tr key={s.loja} className="transition-colors last:border-0" style={{ borderBottom: '1px solid var(--border-line-soft)' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-panel-2)' }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                          <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{s.loja}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
                              style={{ background: colors[pc] + '26', color: colors[pc] }}>
                              {s.pesquisas}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {t2b != null ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
                                style={{ background: colors[tc] + '26', color: colors[tc] }}>
                                {t2b.toFixed(1)}%
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-dim)' }}>{tsi != null ? tsi.toFixed(2) : '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}