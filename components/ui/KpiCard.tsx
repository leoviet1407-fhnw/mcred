interface Props {
  label: string
  value: string | number
  delta?: string
  negative?: boolean
}

export function KpiCard({ label, value, delta, negative }: Props) {
  return (
    <div className="kpi">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {delta && <div className={`delta${negative ? ' neg' : ''}`}>{delta}</div>}
    </div>
  )
}
