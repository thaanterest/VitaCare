import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "บันทึกความยินยอม (Consent Logs)",
};

const ACTION_LABELS: Record<string, string> = {
  ACCEPT_ALL: "ยอมรับทั้งหมด",
  REJECT_ALL: "ปฏิเสธทั้งหมด",
  CUSTOM: "กำหนดเอง",
};

const ACTION_COLORS: Record<string, string> = {
  ACCEPT_ALL: "bg-green-100 text-green-800",
  REJECT_ALL: "bg-red-100 text-red-800",
  CUSTOM: "bg-blue-100 text-blue-800",
};

function BoolBadge({ value }: { value: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
        value ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      {value ? "✓ ใช่" : "✗ ไม่"}
    </span>
  );
}

export default async function ConsentLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; action?: string }>;
}) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const pageSize = 20;
  const skip = (page - 1) * pageSize;
  const actionFilter = params.action || "";

  const where = actionFilter ? { action: actionFilter } : {};

  const [logs, total] = await Promise.all([
    prisma.consentLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.consentLog.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  // Summary stats
  const [acceptCount, rejectCount, customCount] = await Promise.all([
    prisma.consentLog.count({ where: { action: "ACCEPT_ALL" } }),
    prisma.consentLog.count({ where: { action: "REJECT_ALL" } }),
    prisma.consentLog.count({ where: { action: "CUSTOM" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          🔐 บันทึกความยินยอม (Consent Logs)
        </h1>
        <p className="text-sm text-gray-500">
          ทั้งหมด {total.toLocaleString()} รายการ
        </p>
      </div>

      <p className="text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        ข้อมูลนี้เก็บรวบรวมตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
        เพื่อเป็นหลักฐานการขอและได้รับความยินยอมจากผู้ใช้งาน
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">
            ✓
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">ยอมรับทั้งหมด</p>
            <p className="text-2xl font-bold text-green-700">
              {acceptCount.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-xl">
            ✗
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">ปฏิเสธทั้งหมด</p>
            <p className="text-2xl font-bold text-red-700">
              {rejectCount.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
            ⚙
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">กำหนดเอง</p>
            <p className="text-2xl font-bold text-blue-700">
              {customCount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 self-center mr-2">
          กรองตามการกระทำ:
        </span>
        {[
          { value: "", label: "ทั้งหมด" },
          { value: "ACCEPT_ALL", label: "ยอมรับทั้งหมด" },
          { value: "REJECT_ALL", label: "ปฏิเสธทั้งหมด" },
          { value: "CUSTOM", label: "กำหนดเอง" },
        ].map((opt) => (
          <a
            key={opt.value}
            href={`/admin/consent-logs?action=${opt.value}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              actionFilter === opt.value
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {opt.label}
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">เวลา</th>
                <th className="px-4 py-3">การกระทำ</th>
                <th className="px-4 py-3">ผู้ใช้</th>
                <th className="px-4 py-3">Anonymous ID</th>
                <th className="px-4 py-3">เวอร์ชัน</th>
                <th className="px-4 py-3 text-center">Functional</th>
                <th className="px-4 py-3 text-center">Analytics</th>
                <th className="px-4 py-3 text-center">Marketing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("th-TH", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                        ACTION_COLORS[log.action] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {ACTION_LABELS[log.action] || log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {log.user ? (
                      <div>
                        <p className="font-medium">{log.user.name}</p>
                        <p className="text-xs text-gray-400">{log.user.email}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">ไม่ได้ล็อกอิน</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400 max-w-[120px] truncate">
                    {log.anonymousId}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-center">
                    {log.policyVersion}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <BoolBadge value={log.functional} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <BoolBadge value={log.analytics} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <BoolBadge value={log.marketing} />
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    ไม่มีบันทึกความยินยอม
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              หน้า {page} / {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={`/admin/consent-logs?page=${page - 1}&action=${actionFilter}`}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  ← ก่อนหน้า
                </a>
              )}
              {page < totalPages && (
                <a
                  href={`/admin/consent-logs?page=${page + 1}&action=${actionFilter}`}
                  className="px-3 py-1.5 text-sm bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
                >
                  ถัดไป →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
