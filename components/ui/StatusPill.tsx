type Status = 'issued' | 'revoked' | 'expired' | 'active' | 'pending' | 'completed'
  | 'in_progress' | 'not_completed' | 'not_registered' | 'draft' | 'success' | 'failed'
  | string

const CONFIG: Record<string, { cls: string; dot: string; label?: string }> = {
  issued:        { cls: 'pill-issued',    dot: '#3C6E47' },
  active:        { cls: 'pill-active',    dot: '#3C6E47' },
  success:       { cls: 'pill-active',    dot: '#3C6E47' },
  completed:     { cls: 'pill-completed', dot: '#fff' },
  pending:       { cls: 'pill-pending',   dot: '#2563EB' },
  revoked:       { cls: 'pill-revoked',   dot: '#C8421E' },
  failed:        { cls: 'pill-revoked',   dot: '#C8421E' },
  expired:       { cls: 'pill-expired',   dot: '#B88A2B' },
  in_progress:   { cls: 'pill-pending',   dot: '#2563EB', label: 'In Progress' },
  not_completed: { cls: 'pill-revoked',   dot: '#C8421E', label: 'Not Completed' },
  not_registered:{ cls: 'pill-draft',     dot: '#9AA0AA', label: 'Not Registered' },
  draft:         { cls: 'pill-draft',     dot: '#9AA0AA' },
}

export function StatusPill({ status }: { status: Status }) {
  const cfg = CONFIG[status] ?? { cls: 'pill-draft', dot: '#9AA0AA' }
  const label = cfg.label ?? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')
  return (
    <span className={`pill ${cfg.cls}`}>
      <span className="pill-dot" style={{ background: cfg.dot }} />
      {label}
    </span>
  )
}
