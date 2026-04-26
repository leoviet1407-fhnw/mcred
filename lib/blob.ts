import { put, list, del } from '@vercel/blob'

// Read a JSON collection from blob storage
export async function readBlob<T>(key: string): Promise<T | null> {
  try {
    const { blobs } = await list({ prefix: key })
    const match = blobs.find(b => b.pathname === key)
    if (!match) return null
    const res = await fetch(match.url, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

// Write a JSON collection to blob storage (overwrites)
export async function writeBlob<T>(key: string, data: T): Promise<void> {
  await put(key, JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

// Read or return default
export async function readBlobOrDefault<T>(key: string, defaultValue: T): Promise<T> {
  const data = await readBlob<T>(key)
  return data ?? defaultValue
}

// Atomic-style update: read → transform → write
export async function updateBlob<T>(
  key: string,
  defaultValue: T,
  transform: (current: T) => T,
): Promise<T> {
  const current = await readBlobOrDefault<T>(key, defaultValue)
  const updated = transform(current)
  await writeBlob(key, updated)
  return updated
}

// Delete a blob
export async function deleteBlob(key: string): Promise<void> {
  try {
    const { blobs } = await list({ prefix: key })
    const match = blobs.find(b => b.pathname === key)
    if (match) await del(match.url)
  } catch {
    // ignore
  }
}
