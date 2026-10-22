import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/lib/auth";

const consentLogSchema = z.object({
  anonymousId: z.string(),
  policyVersion: z.string(),
  action: z.string(),
  functional: z.boolean(),
  analytics: z.boolean(),
  marketing: z.boolean(),
});

// Rate limiting แบบง่ายใน Memory (ตาม DoD B3)
const rateLimitMap = new Map<string, { count: number; expires: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || record.expires < now) {
    rateLimitMap.set(ip, { count: 1, expires: now + 60000 }); // 1 นาที
    return false;
  }
  if (record.count > 10) return true; // Limit 10 ครั้งต่อนาที
  record.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    // get user IP
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const validated = consentLogSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id;

    // Hash IP แบบง่ายลดการเก็บข้อมูลส่วนบุคคล
    const hashedIp = Buffer.from(ip).toString("base64");

    await prisma.consentLog.create({
      data: {
        anonymousId: validated.data.anonymousId,
        userId: userId || null,
        policyVersion: validated.data.policyVersion,
        action: validated.data.action,
        functional: validated.data.functional,
        analytics: validated.data.analytics,
        marketing: validated.data.marketing,
        userAgent: request.headers.get("user-agent") || "unknown",
        hashedIp,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Consent log API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
