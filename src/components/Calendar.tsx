import {
  DEMO_RESERVATIONS,
  DemoReservation,
  TODAY,
  getVisitCountByPhone,
} from "@/lib/demoData";

type Bar = {
  reservation: DemoReservation;
  startCol: number; // 0-6
  endCol: number; // 0-6 (inclusive)
  row: number;
};

function dateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildWeeks(year: number, month: number): Date[][] {
  const firstDay = new Date(year, month - 1, 1);
  const startSun = new Date(firstDay);
  startSun.setDate(startSun.getDate() - firstDay.getDay());
  const weeks: Date[][] = [];
  const d = new Date(startSun);
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    weeks.push(week);
    // Stop if next week starts after target month
    if (
      d.getMonth() !== month - 1 &&
      !(month === 12 && d.getMonth() === 0 && d.getFullYear() === year + 1)
    ) {
      // d is now the first day of next week
      // If we've moved past the target month, stop
      if (d.getFullYear() > year || (d.getFullYear() === year && d.getMonth() > month - 1)) {
        break;
      }
    }
  }
  return weeks;
}

function getShortFacility(facilities: string[]): string {
  const f = facilities[0];
  if (!f) return "";
  const cottageMatch = f.match(/([A-E]棟)/);
  if (cottageMatch) return cottageMatch[1];
  if (f.includes("バンガロー 1")) return "バ1";
  if (f.includes("バンガロー 2")) return "バ2";
  if (f.includes("テント")) return "テント";
  return f.slice(0, 4);
}

function packBars(reservations: DemoReservation[], week: Date[]): Bar[] {
  const weekStartStr = dateStr(week[0]);
  const weekEndStr = dateStr(week[6]);

  const overlapping = reservations
    .filter((r) => r.checkin <= weekEndStr && r.checkout > weekStartStr)
    .sort((a, b) => {
      const aStart = a.checkin.localeCompare(b.checkin);
      if (aStart !== 0) return aStart;
      return b.checkout.localeCompare(a.checkout);
    });

  const bars: Bar[] = [];
  const rowEnds: string[] = []; // rowEnds[row] = last day occupied (date string)

  for (const r of overlapping) {
    let startCol = -1;
    let endCol = -1;

    for (let i = 0; i < 7; i++) {
      const ds = dateStr(week[i]);
      if (ds >= r.checkin && startCol === -1) startCol = i;
      if (ds < r.checkout) endCol = i;
    }

    if (startCol === -1 || endCol === -1 || startCol > endCol) continue;

    // Find row: a row whose last occupied day is before this bar's start
    let row = 0;
    while (row < rowEnds.length) {
      if (rowEnds[row] < dateStr(week[startCol])) break;
      row++;
    }
    if (row === rowEnds.length) {
      rowEnds.push(dateStr(week[endCol]));
    } else {
      rowEnds[row] = dateStr(week[endCol]);
    }

    bars.push({ reservation: r, startCol, endCol, row });
  }

  return bars;
}

export default function Calendar({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const weeks = buildWeeks(year, month);
  const reservations = DEMO_RESERVATIONS.filter(
    (r) => r.status !== "cancelled",
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-bold text-stone-800">
          {year}年{month}月の予約状況
        </h2>
        <div className="text-xs text-stone-500 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-amber-200 rounded"></span>
            予約
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-orange-200 rounded"></span>
            🐾 ペット
          </span>
          <span>★3回以上 / ☆2回</span>
        </div>
      </div>
      <div className="grid grid-cols-7 bg-stone-50 border-b border-stone-100 text-xs font-semibold">
        {["日", "月", "火", "水", "木", "金", "土"].map((d, i) => (
          <div
            key={d}
            className={`text-center py-2 ${
              i === 0
                ? "text-red-600"
                : i === 6
                  ? "text-blue-600"
                  : "text-stone-600"
            }`}
          >
            {d}
          </div>
        ))}
      </div>
      {weeks.map((week, wIdx) => (
        <WeekRow
          key={wIdx}
          week={week}
          reservations={reservations}
          currentMonth={month}
        />
      ))}
    </div>
  );
}

function WeekRow({
  week,
  reservations,
  currentMonth,
}: {
  week: Date[];
  reservations: DemoReservation[];
  currentMonth: number;
}) {
  const bars = packBars(reservations, week);
  const maxRow = bars.length === 0 ? 0 : Math.max(...bars.map((b) => b.row)) + 1;
  const minHeight = Math.max(96, 32 + maxRow * 24);

  return (
    <div className="border-b border-stone-100 last:border-b-0">
      <div
        className="grid grid-cols-7 relative"
        style={{ minHeight: `${minHeight}px` }}
      >
        {/* Day cells (background + date numbers) */}
        {week.map((d, i) => {
          const isOtherMonth = d.getMonth() !== currentMonth - 1;
          const isToday = dateStr(d) === TODAY;
          const dayNumberClass = isToday
            ? "bg-emerald-700 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold"
            : isOtherMonth
              ? "text-stone-400"
              : i === 0
                ? "text-red-600 font-medium"
                : i === 6
                  ? "text-blue-600 font-medium"
                  : "text-stone-700 font-medium";
          return (
            <div
              key={i}
              className={`border-r border-stone-100 last:border-r-0 px-1.5 py-1 ${
                isOtherMonth ? "bg-stone-50" : ""
              }`}
            >
              <div className={`text-xs ${dayNumberClass}`}>{d.getDate()}</div>
            </div>
          );
        })}

        {/* Reservation bars overlay */}
        <div
          className="absolute left-0 right-0 grid grid-cols-7 px-0.5"
          style={{ top: "28px", gridAutoRows: "22px", rowGap: "2px" }}
        >
          {bars.map((bar) => {
            const r = bar.reservation;
            const visitCount = getVisitCountByPhone(r.customerPhone);
            const star = visitCount >= 3 ? " ★" : visitCount === 2 ? " ☆" : "";
            const fac = getShortFacility(r.facilities);
            const more = r.facilities.length > 1 ? "+" : "";
            const label = `${fac}${more} ${r.customerName}${star}`;
            const bg = r.hasPet
              ? "bg-orange-200 hover:bg-orange-300"
              : "bg-amber-200 hover:bg-amber-300";
            return (
              <div
                key={r.id}
                style={{
                  gridColumn: `${bar.startCol + 1} / ${bar.endCol + 2}`,
                  gridRow: bar.row + 1,
                }}
                className={`${bg} text-stone-800 text-xs px-1.5 py-0.5 rounded truncate cursor-pointer`}
                title={`${r.customerName} (${r.reservationNumber})\n${r.facilities.join(", ")}\n${r.checkin} 〜 ${r.checkout}\n到着 ${r.arrivalTime} / ${visitCount}回目のご利用${r.hasPet ? "\n🐾 ペット同伴" : ""}`}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
