import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getLog } from '@/lib/data'
import { StatusPill } from '@/components/ui/StatusPill'
import { RoleBadge } from '@/components/ui/RoleBadge'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'

export default async function LogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  const log = await getLog()
  const entry = log.find(e => e.id === id)
  if (!entry) notFound()

  const isDev = session.user.role === 'developer'

  const typeColor: Record<string,string> = {
    Credential:'credential',Course:'course',Student:'student',
    User:'user',Class:'class',Settings:'settings',
  }

  return (
    <div style={{ maxWidth:800 }}>
      <Link href="/log" className="back-btn">← Back to Log</Link>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, gap:20 }}>
        <div>
          <div style={{ fontFamily:'monospace', fontSize:11, color:'var(--mute)', marginBottom:8 }}>{entry.id}</div>
          <h1 style={{ fontSize:32, fontWeight:700, letterSpacing:'-0.025em', marginBottom:8 }}>{entry.action}</h1>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span className={`log-action-tag ${typeColor[entry.objectType]??'settings'}`}>{entry.objectType}</span>
            <StatusPill status={entry.status === 'success' ? 'active' : entry.status === 'pending' ? 'pending' : 'revoked'}/>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 16px', background:'var(--ink)', color:'var(--paper)', borderRadius:8, fontSize:12, flexShrink:0 }}>
          <span style={{ fontSize:9, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', background:'var(--ember)', color:'#fff', padding:'2px 7px', borderRadius:3 }}>Immutable</span>
          Entry cannot be modified
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {/* Event details */}
        <div className="panel" style={{ overflow:'visible' }}>
          <div className="panel-head"><h3>Event Details</h3></div>
          <div style={{ padding:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              ['Log ID', entry.id, true],
              ['Timestamp', formatDateTime(entry.createdAt), true],
              ['Action', entry.action, false],
              ['Status', entry.status, false],
              ['Object Type', entry.objectType, false],
              ['Object ID', entry.objectId, true],
              ['Object Name', entry.objectName, false],
              ['Scope', entry.scope, false],
            ].map(([l, v, mono]) => (
              <div key={String(l)} style={{ padding:'12px 14px', background:'var(--paper-2)', border:'1px solid var(--line)', borderRadius:8 }}>
                <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:500, fontFamily: mono?'monospace':undefined, wordBreak:'break-all' }}>
                  {l === 'Status' ? <StatusPill status={v === 'success'?'active':v==='pending'?'pending':'revoked'}/> : v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actor */}
        <div className="panel" style={{ overflow:'visible' }}>
          <div className="panel-head"><h3>Actor</h3></div>
          <div style={{ padding:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              ['User Name', entry.userName, false],
              ['User Email', entry.userEmail, true],
            ].map(([l,v,mono]) => (
              <div key={String(l)} style={{ padding:'12px 14px', background:'var(--paper-2)', border:'1px solid var(--line)', borderRadius:8 }}>
                <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:500, fontFamily:mono?'monospace':undefined }}>{v}</div>
              </div>
            ))}
            <div style={{ padding:'12px 14px', background:'var(--paper-2)', border:'1px solid var(--line)', borderRadius:8 }}>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:4 }}>Role</div>
              <RoleBadge role={entry.userRole}/>
            </div>
          </div>
        </div>

        {/* Change record */}
        <div className="panel" style={{ overflow:'visible' }}>
          <div className="panel-head"><h3>Change Record</h3></div>
          <div style={{ padding:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:8 }}>Previous Value</div>
              <pre style={{ fontFamily:'monospace', fontSize:12, background:'var(--paper-2)', border:'1px solid var(--line)', borderRadius:8, padding:16, margin:0, lineHeight:1.6, color: entry.prevValue?'var(--ember)':'var(--mute)', whiteSpace:'pre-wrap', wordBreak:'break-word', minHeight:80 }}>
                {entry.prevValue ?? '— (no previous value)'}
              </pre>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:8 }}>New Value</div>
              <pre style={{ fontFamily:'monospace', fontSize:12, background:'var(--paper-2)', border:'1px solid var(--line)', borderRadius:8, padding:16, margin:0, lineHeight:1.6, color: entry.newValue?'var(--sage)':'var(--mute)', whiteSpace:'pre-wrap', wordBreak:'break-word', minHeight:80 }}>
                {entry.newValue ?? '—'}
              </pre>
            </div>
          </div>
          {entry.reason && (
            <div style={{ padding:'0 20px 20px' }}>
              <div style={{ padding:'12px 14px', background:'var(--paper-2)', border:'1px solid var(--line)', borderRadius:8 }}>
                <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:4 }}>Reason / Comment</div>
                <div style={{ fontSize:13, fontWeight:500 }}>{entry.reason}</div>
              </div>
            </div>
          )}
        </div>

        {/* Developer metadata */}
        {isDev && (entry.sessionId || entry.ipAddress) && (
          <div className="panel" style={{ overflow:'visible' }}>
            <div className="panel-head">
              <h3>Technical Metadata <RoleBadge role="developer"/></h3>
            </div>
            <div style={{ padding:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[
                ['Session ID', entry.sessionId ?? '—', true],
                ['IP Address', entry.ipAddress ?? '—', true],
                ['System Event ID', `EVT-${entry.id}`, true],
                ['Platform Version', 'v1.0.0', false],
              ].map(([l,v,mono]) => (
                <div key={String(l)} style={{ padding:'12px 14px', background:'var(--paper-2)', border:'1px solid var(--line)', borderRadius:8 }}>
                  <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:4 }}>{l}</div>
                  <div style={{ fontSize:12, fontFamily:mono?'monospace':undefined }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
