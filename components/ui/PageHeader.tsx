interface Props {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, subtitle, actions }: Props) {
  return (
    <div className="page-head">
      <div>
        <h1 style={{
          fontFamily: 'var(--sans)', fontWeight: 400, fontSize: 48,
          letterSpacing: '-0.02em', margin: '0 0 6px', lineHeight: 1,
        }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: 'var(--mute)', margin: 0 }}>{subtitle}</p>}
      </div>
      {actions && <div className="right">{actions}</div>}
    </div>
  )
}
