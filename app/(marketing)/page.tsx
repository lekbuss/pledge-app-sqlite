export default function Page() {
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Pledge App (MVP)</h1>
      <p className="mt-4">Make a promise, set a deadline, authorize $100. If you fail, your supervisor gets the money.</p>
      <a className="mt-6 inline-block px-4 py-2 rounded bg-black text-white" href="/dashboard">Go to Dashboard</a>
    </main>
  );
}
