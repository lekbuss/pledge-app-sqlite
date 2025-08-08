'use client';
import { useState } from 'react';

export default function NewCommitPage() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [email, setEmail] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setResult(null);
    const res = await fetch('/api/commitments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: desc, supervisorEmail: email, deadline })
    });
    const data = await res.json();
    setLoading(false);
    setResult(JSON.stringify(data, null, 2));
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold">Create a Pledge</h1>
      <div className="mt-4 flex flex-col gap-3">
        <input className="border p-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="border p-2" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
        <input className="border p-2" placeholder="Supervisor Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2" type="datetime-local" value={deadline} onChange={e=>setDeadline(e.target.value)} />
        <button className="px-3 py-2 bg-black text-white rounded" onClick={submit} disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
      {result && <pre className="mt-6 bg-gray-100 p-4 text-sm overflow-auto">{result}</pre>}
    </main>
  );
}
