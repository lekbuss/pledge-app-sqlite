import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold">My Pledges</h1>
      <div className="mt-4 flex gap-3">
        <Link className="px-3 py-2 rounded bg-black text-white" href="/commit/new">New Pledge</Link>
      </div>
      <p className="mt-6 text-gray-600">This is a placeholder. Wire auth & fetch pledges in a real app.</p>
    </main>
  );
}
