import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("x-cron-secret");
  if (auth !== process.env.CRON_SECRET) return new NextResponse("Forbidden", { status: 403 });

  const now = new Date();
  const due = await prisma.commitment.findMany({
    where: {
      status: "PENDING",
      deadline: { lte: now }
    },
    include: { supervisor: true, user: true }
  });

  let processed = 0;
  for (const c of due) {
    // naive logic: if NEEDS_CONFIRM, send email in a real app; here we treat as FAILED for MVP demo
    const mode = c.supervisor?.verifyMode || "NEEDS_CONFIRM";
    if (mode === "AUTO_PASS") {
      await prisma.commitment.update({ where: { id: c.id }, data: { status: "SUCCESS" } });
      await prisma.auditLog.create({ data: { commitmentId: c.id, event: "AUTO_PASS" } });
      processed++;
      continue;
    }

    // FAIL path → charge the user
    try {
      // For MVP we don't have saved payment_method yet. In real app, grab payment_method from client after setup.
      // Here we mark FAILED; real charging is left as TODO.
      await prisma.commitment.update({ where: { id: c.id }, data: { status: "FAILED" } });
      await prisma.auditLog.create({ data: { commitmentId: c.id, event: "MARK_FAILED" } });
      processed++;
    } catch (e:any) {
      await prisma.auditLog.create({ data: { commitmentId: c.id, event: "CHARGE_ERROR", data: { message: e.message } } });
    }
  }

  return NextResponse.json({ ok: true, processed });
}
