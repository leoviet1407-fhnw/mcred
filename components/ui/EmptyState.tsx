interface Props {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>📭</div>
      <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>{title}</h3>
      {description && <p style={{ fontSize: 14, color: 'var(--mute)', marginBottom: 24 }}>{description}</p>}
      {action}
    </div>
  )
}
