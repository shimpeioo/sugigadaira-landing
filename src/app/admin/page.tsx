import Link from "next/link";
import Calendar from "@/components/Calendar";
import TodayTasksCard from "@/components/TodayTasksCard";
import {
  DEMO_RESERVATIONS,
  TODAY,
  generateTasksForDate,
  getTodayReservations,
  getUpcomingReservations,
  isLateArrival,
  totalGuestCount,
} from "@/lib/demoData";

export default function AdminHome() {
  const today = getTodayReservations();
  const upcoming = getUpcomingReservations();
  const currentYearMonth = TODAY.slice(0, 7); // "2026-06"
  const thisMonth = DEMO_RESERVATIONS.filter(
    (r) =>
      r.checkin.startsWith(currentYearMonth) && r.status !== "cancelled",
  );
  const monthlyRevenue = thisMonth.reduce((sum, r) => sum + r.totalAmount, 0);
  const recentChanges = [...DEMO_RESERVATIONS]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);
  const todayTasks = generateTasksForDate(TODAY);
  const currentYear = Number(TODAY.slice(0, 4));
  const currentMonth = Number(TODAY.slice(5, 7));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <p className="text-xs text-stone-500">本日</p>
        <p className="text-stone-800 font-semibold">
          {TODAY}（{getDayLabel(TODAY)}）
        </p>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SummaryCard
          label="今日の受付"
          value={`${today.length}件`}
          tone="emerald"
          href="/admin/today"
        />
        <SummaryCard
          label="今後の予約"
          value={`${upcoming.length}件`}
          tone="stone"
          href="/admin/reservations"
        />
        <SummaryCard
          label="今月の予約"
          value={`${thisMonth.length}件`}
          tone="stone"
        />
        <SummaryCard
          label="今月の売上"
          value={`¥${monthlyRevenue.toLocaleString()}`}
          tone="stone"
        />
      </div>

      {/* 今日の段取り */}
      <TodayTasksCard initialTasks={todayTasks} />

      {/* カレンダー（月表示） */}
      <section className="mb-6">
        <Calendar year={currentYear} month={currentMonth} />
      </section>

      {/* 今日の受付プレビュー */}
      <section className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-stone-800">今日の受付</h2>
          <Link
            href="/admin/today"
            className="text-emerald-700 text-sm hover:underline"
          >
            詳細リスト →
          </Link>
        </div>
        {today.length === 0 ? (
          <p className="text-stone-500 text-sm">本日の受付はありません。</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {today.map((r) => (
              <li key={r.id} className="py-3 flex items-center gap-3">
                <div className="text-sm flex-1 min-w-0">
                  <p className="font-semibold text-stone-800 truncate">
                    {r.customerName}
                  </p>
                  <p className="text-xs text-stone-500 truncate">
                    {r.facilities.join(" / ")} ・ {totalGuestCount(r)}名
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {r.hasPet && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                      🐾 ペット
                    </span>
                  )}
                  {isLateArrival(r.arrivalTime) && (
                    <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                      🌙 17時以降
                    </span>
                  )}
                  <span className="text-xs text-stone-600">
                    着 {r.arrivalTime}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 通知・要対応 */}
      <section className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="font-bold text-stone-800 mb-4">最近の予約・更新</h2>
        <ul className="divide-y divide-stone-100">
          {recentChanges.map((r) => (
            <li key={r.id} className="py-3 text-sm">
              <div className="flex justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-stone-800 truncate">
                    {r.customerName}（{r.reservationNumber}）
                  </p>
                  <p className="text-xs text-stone-500 truncate">
                    {r.checkin} 〜 {r.checkout} / {r.facilities.join(", ")}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
  href,
}: {
  label: string;
  value: string;
  tone: "emerald" | "stone";
  href?: string;
}) {
  const bg = tone === "emerald" ? "bg-emerald-700 text-white" : "bg-white text-stone-800";
  const labelColor = tone === "emerald" ? "text-emerald-200" : "text-stone-500";

  const inner = (
    <div className={`${bg} rounded-lg shadow-sm p-4 transition-shadow hover:shadow-md`}>
      <p className={`text-xs ${labelColor}`}>{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }
  return inner;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    confirmed: { label: "確定", color: "bg-emerald-100 text-emerald-800" },
    checkedIn: { label: "受付済", color: "bg-blue-100 text-blue-800" },
    completed: { label: "完了", color: "bg-stone-100 text-stone-700" },
    cancelled: { label: "キャンセル", color: "bg-red-100 text-red-700" },
  };
  const v = map[status] ?? { label: status, color: "bg-stone-100 text-stone-700" };
  return (
    <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${v.color}`}>
      {v.label}
    </span>
  );
}

function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return days[d.getDay()];
}
