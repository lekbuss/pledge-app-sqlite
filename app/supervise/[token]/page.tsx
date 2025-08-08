import Link from "next/link";

export default function Page({ params }: { params: { token: string } }) {
  const token = params.token;
  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold">Supervisor Decision</h1>
      <p className="mt-2">Please confirm whether the pledge was completed.</p>
      <div className="mt-4 flex gap-3">
        <Link className="px-3 py-2 rounded bg-green-600 text-white" href={`/api/supervise/${token}?action=success`}>Mark Success</Link>
        <Link className="px-3 py-2 rounded bg-red-600 text-white" href={`/api/supervise/${token}?action=fail`}>Mark Fail</Link>
      </div>
    </main>
  );
}
