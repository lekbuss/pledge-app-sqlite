import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const token = params.token;
  const url = new URL(req.url);
  const action = url.searchParams.get("action"); // 'success' or 'fail'

  const sup = await prisma.supervision.findFirst({ where: { verifyToken: token }, include: { commitment: true } });
  if (!sup) return new NextResponse("Invalid token", { status: 404 });

  if (action === "success") {
    await prisma.commitment.update({ where: { id: sup.commitmentId }, data: { status: "SUCCESS" } });
  } else if (action === "fail") {
    await prisma.commitment.update({ where: { id: sup.commitmentId }, data: { status: "FAILED" } });
  }

  return NextResponse.redirect(new URL(`/supervise/${token}/done`, req.url));
}
