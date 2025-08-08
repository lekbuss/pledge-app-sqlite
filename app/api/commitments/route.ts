import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe, DEFAULT_AMOUNT_CENTS, DEFAULT_CURRENCY } from "@/lib/stripe";
import { z } from "zod";

const Body = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  supervisorEmail: z.string().email(),
  deadline: z.string()
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const body = Body.parse(json);

    // TODO: real auth. For MVP, create/find a demo user by email header.
    const demoEmail = req.headers.get("x-demo-user") || "demo@example.com";
    let user = await prisma.user.findUnique({ where: { email: demoEmail } });
    if (!user) user = await prisma.user.create({ data: { email: demoEmail } });

    // Create customer (or reuse by email)
    const customers = await stripe.customers.list({ email: demoEmail, limit: 1 });
    const customer = customers.data[0] || await stripe.customers.create({ email: demoEmail });

    // Create SetupIntent to save payment method on client (for real app you return client_secret)
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      usage: "off_session",
      payment_method_types: ["card"]
    });

    // Create commitment draft
    const commitment = await prisma.commitment.create({
      data: {
        userId: user.id,
        title: body.title,
        description: body.description,
        amountCents: DEFAULT_AMOUNT_CENTS,
        currency: DEFAULT_CURRENCY,
        deadline: new Date(body.deadline),
        auditLogs: { create: [{ event: "CREATED" }] },
        supervisor: {
          create: {
            supervisorEmail: body.supervisorEmail,
            verifyMode: "NEEDS_CONFIRM",
            verifyToken: crypto.randomUUID()
          }
        }
      },
      include: { supervisor: true }
    });

    return NextResponse.json({
      ok: true,
      commitmentId: commitment.id,
      supervisorVerifyLink: `${process.env.APP_BASE_URL}/supervise/${commitment.supervisor?.verifyToken}`,
      stripeSetupIntentClientSecret: setupIntent.client_secret
    });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
