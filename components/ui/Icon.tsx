const icons: Record<string, (p: number) => React.ReactNode> = {
  grid:     p => <><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={p}/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={p}/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={p}/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={p}/></>,
  book:     p => <><path d="M4 19V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13" stroke="currentColor" strokeWidth={p} fill="none"/><path d="M4 19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" stroke="currentColor" strokeWidth={p} fill="none"/><line x1="9" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth={p}/><line x1="9" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth={p}/></>,
  classes:  p => <><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth={p} fill="none"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth={p}/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth={p}/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth={p}/></>,
  users:    p => <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth={p} fill="none"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth={p} fill="none"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth={p} fill="none"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  shield:   p => <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  award:    p => <><circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth={p} fill="none"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  eye:      p => <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth={p} fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  plus:     p => <><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth={p}/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth={p}/></>,
  edit:     p => <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth={p} fill="none"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  settings: p => <><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={p} fill="none"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  user:     p => <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth={p} fill="none"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  palette:  p => <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={p} fill="none"/><path d="M12 2a10 10 0 0 1 10 10c0 2.5-2.5 4-5 4H15a2 2 0 0 0-2 2v1a2 2 0 0 1-2 2" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  layout:   p => <><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth={p} fill="none"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth={p}/><line x1="9" y1="21" x2="9" y2="9" stroke="currentColor" strokeWidth={p}/></>,
  help:     p => <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={p} fill="none"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth={p} fill="none"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth={p+1}/></>,
  back:     p => <><polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  arrow:    p => <><polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  check:    p => <><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  star:     p => <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  download: p => <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth={p} fill="none"/><polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth={p} fill="none"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth={p}/></>,
  copy:     p => <><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth={p} fill="none"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  slash:    p => <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={p} fill="none"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth={p}/></>,
  mail:     p => <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth={p} fill="none"/><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  link:     p => <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth={p} fill="none"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  share:    p => <><circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth={p} fill="none"/><circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth={p} fill="none"/><circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth={p} fill="none"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth={p}/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth={p}/></>,
  verify:   p => <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth={p} fill="none"/><polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  import:   p => <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth={p} fill="none"/><polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth={p} fill="none"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth={p}/></>,
  rotate:   p => <><polyline points="23 4 23 10 17 10" stroke="currentColor" strokeWidth={p} fill="none"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  wallet:   p => <><rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth={p} fill="none"/><path d="M1 10h22" stroke="currentColor" strokeWidth={p}/></>,
  logout:   p => <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth={p} fill="none"/><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth={p} fill="none"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth={p}/></>,
  qr:       p => <><rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth={p} fill="none"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth={p} fill="none"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth={p} fill="none"/><rect x="5" y="5" width="3" height="3" fill="currentColor"/><rect x="16" y="5" width="3" height="3" fill="currentColor"/><rect x="5" y="16" width="3" height="3" fill="currentColor"/><line x1="14" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth={p+1}/><line x1="17" y1="14" x2="17" y2="17" stroke="currentColor" strokeWidth={p}/><line x1="20" y1="14" x2="20" y2="14" stroke="currentColor" strokeWidth={p+1}/><line x1="14" y1="17" x2="14" y2="20" stroke="currentColor" strokeWidth={p}/><line x1="17" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth={p}/></>,
  linkedin: p => <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth={p} fill="none"/><rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth={p} fill="none"/><circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  bell:     p => <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth={p} fill="none"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth={p} fill="none"/></>,
  building: p => <><rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" strokeWidth={p} fill="none"/><line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" strokeWidth={p}/><rect x="12" y="7" width="3" height="3" stroke="currentColor" strokeWidth={p} fill="none"/><rect x="12" y="13" width="3" height="3" stroke="currentColor" strokeWidth={p} fill="none"/><rect x="5" y="7" width="2" height="2" fill="currentColor"/><rect x="5" y="13" width="2" height="2" fill="currentColor"/></>,
}

interface IconProps {
  n: string
  size?: number
  strokeWidth?: number
  className?: string
}

export function Icon({ n, size = 18, strokeWidth = 1.5, className }: IconProps) {
  const path = icons[n]
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0 }}
    >
      {path?.(strokeWidth) ?? <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />}
    </svg>
  )
}
