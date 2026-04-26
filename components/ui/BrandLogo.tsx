interface Props {
  size?: number
  textColor?: string
  textSize?: number
}

export function BrandLogo({ size = 30, textColor = '#fff', textSize = 17 }: Props) {
  const h = Math.round(size * 0.78)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
      <svg width={size} height={h} viewBox="0 0 40 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 31 L13 4 L20.5 17 L28 4 L40 31 Z" fill="#C8421E" />
        <path d="M13 4 L20.5 17 L28 4 L22 13 L20.5 10 L19 13 Z" fill="white" />
      </svg>
      <span style={{ color: textColor, fontSize: textSize, fontWeight: 600, letterSpacing: '-0.01em' }}>
        M-CRED
      </span>
    </div>
  )
}
