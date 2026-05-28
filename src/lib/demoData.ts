// 試作版用のデモデータ
// 実際のシステムでは DB から取得します

export type ReservationStatus = "confirmed" | "checkedIn" | "completed" | "cancelled";

export type DemoReservation = {
  id: string;
  reservationNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  facilities: string[]; // 表示用
  checkin: string; // YYYY-MM-DD
  checkout: string;
  arrivalTime: string; // HH:MM
  adults: number;
  children: number;
  infants: number;
  tentPeople?: number;
  hasPet: boolean;
  petInfo?: string;
  notes?: string;
  totalAmount: number;
  status: ReservationStatus;
  createdAt: string;
};

// 「今日」を 2026-06-19（金・理事会前日）として組み立て
// 翌 6/20（土）が理事会当日。土曜のため予約多め。
export const TODAY = "2026-06-19";

export const DEMO_RESERVATIONS: DemoReservation[] = [
  {
    id: "r-001",
    reservationNumber: "SUG-2026-001",
    customerName: "山田 太郎",
    customerPhone: "090-1234-5678",
    customerEmail: "demo@example.com",
    facilities: ["コテージ D棟（チングルマ）"],
    checkin: "2026-07-18",
    checkout: "2026-07-20",
    arrivalTime: "16:00",
    adults: 2,
    children: 1,
    infants: 1,
    hasPet: true,
    petInfo: "小型犬 1匹（柴犬）",
    notes: "BBQセットを使いたいです",
    totalAmount: 19800,
    status: "confirmed",
    createdAt: "2026-05-25",
  },
  {
    id: "r-002",
    reservationNumber: "SUG-2026-002",
    customerName: "田中 花子",
    customerPhone: "080-2222-3333",
    customerEmail: "tanaka@example.com",
    facilities: ["コテージ A棟（ニッコウキスゲ）", "コテージ B棟（コメツツジ）"],
    checkin: "2026-06-19",
    checkout: "2026-06-21",
    arrivalTime: "17:30",
    adults: 6,
    children: 2,
    infants: 0,
    hasPet: false,
    notes: "誕生日サプライズの予定です",
    totalAmount: 33000,
    status: "confirmed",
    createdAt: "2026-05-30",
  },
  {
    id: "r-003",
    reservationNumber: "SUG-2026-003",
    customerName: "鈴木 一郎",
    customerPhone: "090-3333-4444",
    facilities: ["持込テント 3張"],
    checkin: "2026-06-19",
    checkout: "2026-06-20",
    arrivalTime: "14:00",
    adults: 4,
    children: 2,
    infants: 0,
    tentPeople: 6,
    hasPet: false,
    totalAmount: 3300,
    status: "confirmed",
    createdAt: "2026-06-05",
  },
  {
    id: "r-004",
    reservationNumber: "SUG-2026-004",
    customerName: "佐藤 健",
    customerPhone: "070-4444-5555",
    facilities: ["バンガロー 1番"],
    checkin: "2026-06-19",
    checkout: "2026-06-20",
    arrivalTime: "18:30",
    adults: 2,
    children: 0,
    infants: 0,
    hasPet: false,
    totalAmount: 3150,
    status: "confirmed",
    createdAt: "2026-06-15",
  },
  {
    id: "r-005",
    reservationNumber: "SUG-2026-005",
    customerName: "高橋 美咲",
    customerPhone: "090-5555-6666",
    customerEmail: "takahashi@example.com",
    facilities: ["コテージ D棟（チングルマ）"],
    checkin: "2026-06-19",
    checkout: "2026-06-21",
    arrivalTime: "15:00",
    adults: 2,
    children: 0,
    infants: 1,
    hasPet: true,
    petInfo: "中型犬 1匹（ボーダーコリー）",
    notes: "リピーター（3回目）",
    totalAmount: 13200,
    status: "confirmed",
    createdAt: "2026-05-20",
  },
  {
    id: "r-006",
    reservationNumber: "SUG-2026-006",
    customerName: "中村 聡",
    customerPhone: "080-7777-8888",
    facilities: ["コテージ E棟（イワカガミ）"],
    checkin: "2026-06-20",
    checkout: "2026-06-21",
    arrivalTime: "16:00",
    adults: 2,
    children: 2,
    infants: 0,
    hasPet: false,
    totalAmount: 8800,
    status: "confirmed",
    createdAt: "2026-06-08",
  },
  {
    id: "r-007",
    reservationNumber: "SUG-2026-007",
    customerName: "Smith John",
    customerPhone: "090-8888-9999",
    customerEmail: "john@example.com",
    facilities: ["コテージ B棟（コメツツジ）", "持込テント 2張"],
    checkin: "2026-06-27",
    checkout: "2026-06-29",
    arrivalTime: "13:00",
    adults: 5,
    children: 0,
    infants: 0,
    tentPeople: 2,
    hasPet: false,
    notes: "English speaking. Mountain hiking planned.",
    totalAmount: 16280,
    status: "confirmed",
    createdAt: "2026-06-01",
  },
  {
    id: "r-008",
    reservationNumber: "SUG-2026-008",
    customerName: "渡辺 直樹",
    customerPhone: "070-9999-0000",
    facilities: ["持込テント 1張"],
    checkin: "2026-06-20",
    checkout: "2026-06-21",
    arrivalTime: "11:00",
    adults: 2,
    children: 0,
    infants: 0,
    tentPeople: 2,
    hasPet: false,
    totalAmount: 1100,
    status: "confirmed",
    createdAt: "2026-06-17",
  },
  {
    id: "r-009",
    reservationNumber: "SUG-2026-009",
    customerName: "斎藤 真理子",
    customerPhone: "090-0000-1111",
    facilities: ["コテージ A棟（ニッコウキスゲ）"],
    checkin: "2026-06-12",
    checkout: "2026-06-14",
    arrivalTime: "15:00",
    adults: 6,
    children: 0,
    infants: 0,
    hasPet: false,
    totalAmount: 19800,
    status: "completed",
    createdAt: "2026-05-18",
  },
  {
    id: "r-010",
    reservationNumber: "SUG-2026-010",
    customerName: "林 健太",
    customerPhone: "080-1010-2020",
    facilities: ["バンガロー 2番"],
    checkin: "2026-07-04",
    checkout: "2026-07-05",
    arrivalTime: "16:00",
    adults: 1,
    children: 0,
    infants: 0,
    hasPet: false,
    totalAmount: 3150,
    status: "cancelled",
    createdAt: "2026-06-10",
  },
  // ====== 過去の利用履歴（リピーター実績） ======
  // 高橋 美咲：3回目（★リピーター）
  {
    id: "r-h001",
    reservationNumber: "SUG-2025-A-012",
    customerName: "高橋 美咲",
    customerPhone: "090-5555-6666",
    customerEmail: "takahashi@example.com",
    facilities: ["コテージ D棟（チングルマ）"],
    checkin: "2025-08-12",
    checkout: "2025-08-14",
    arrivalTime: "15:00",
    adults: 2,
    children: 0,
    infants: 1,
    hasPet: true,
    petInfo: "中型犬 1匹（ボーダーコリー）",
    totalAmount: 13200,
    status: "completed",
    createdAt: "2025-07-20",
  },
  {
    id: "r-h002",
    reservationNumber: "SUG-2024-A-008",
    customerName: "高橋 美咲",
    customerPhone: "090-5555-6666",
    customerEmail: "takahashi@example.com",
    facilities: ["コテージ A棟（ニッコウキスゲ）"],
    checkin: "2024-09-21",
    checkout: "2024-09-23",
    arrivalTime: "16:30",
    adults: 2,
    children: 0,
    infants: 0,
    hasPet: true,
    petInfo: "中型犬 1匹（ボーダーコリー）",
    totalAmount: 19800,
    status: "completed",
    createdAt: "2024-08-15",
  },
  // 田中 花子：3回目（★リピーター）
  {
    id: "r-h003",
    reservationNumber: "SUG-2025-T-005",
    customerName: "田中 花子",
    customerPhone: "080-2222-3333",
    customerEmail: "tanaka@example.com",
    facilities: ["コテージ A棟（ニッコウキスゲ）"],
    checkin: "2025-06-14",
    checkout: "2025-06-15",
    arrivalTime: "15:00",
    adults: 6,
    children: 2,
    infants: 0,
    hasPet: false,
    totalAmount: 13200,
    status: "completed",
    createdAt: "2025-05-30",
  },
  {
    id: "r-h004",
    reservationNumber: "SUG-2024-T-003",
    customerName: "田中 花子",
    customerPhone: "080-2222-3333",
    customerEmail: "tanaka@example.com",
    facilities: ["コテージ A棟（ニッコウキスゲ）", "コテージ B棟（コメツツジ）"],
    checkin: "2024-07-20",
    checkout: "2024-07-22",
    arrivalTime: "14:00",
    adults: 7,
    children: 2,
    infants: 0,
    hasPet: false,
    totalAmount: 33000,
    status: "completed",
    createdAt: "2024-06-10",
  },
  // 山田 太郎：2回目（☆）
  {
    id: "r-h005",
    reservationNumber: "SUG-2025-Y-007",
    customerName: "山田 太郎",
    customerPhone: "090-1234-5678",
    customerEmail: "demo@example.com",
    facilities: ["コテージ D棟（チングルマ）"],
    checkin: "2025-07-19",
    checkout: "2025-07-20",
    arrivalTime: "16:00",
    adults: 2,
    children: 1,
    infants: 1,
    hasPet: true,
    petInfo: "小型犬 1匹（柴犬）",
    totalAmount: 8800,
    status: "completed",
    createdAt: "2025-06-25",
  },
  // 鈴木 一郎：2回目（☆）
  {
    id: "r-h006",
    reservationNumber: "SUG-2025-S-011",
    customerName: "鈴木 一郎",
    customerPhone: "090-3333-4444",
    facilities: ["持込テント 2張"],
    checkin: "2025-08-02",
    checkout: "2025-08-03",
    arrivalTime: "13:30",
    adults: 4,
    children: 1,
    infants: 0,
    tentPeople: 5,
    hasPet: false,
    totalAmount: 2420,
    status: "completed",
    createdAt: "2025-07-15",
  },
];

// 予約日付順にソート（チェックイン日昇順）
export function sortByCheckin(list: DemoReservation[]): DemoReservation[] {
  return [...list].sort((a, b) => a.checkin.localeCompare(b.checkin));
}

export function getTodayReservations(today: string = TODAY): DemoReservation[] {
  return DEMO_RESERVATIONS.filter(
    (r) => r.checkin === today && r.status !== "cancelled",
  );
}

export function getUpcomingReservations(today: string = TODAY): DemoReservation[] {
  return DEMO_RESERVATIONS.filter(
    (r) => r.checkin >= today && r.status !== "cancelled",
  );
}

export function totalGuestCount(r: DemoReservation): number {
  return r.adults + r.children + r.infants;
}

export function isLateArrival(time: string): boolean {
  return time >= "17:00";
}

// 顧客マスタ（簡易版・予約から集計）
export type DemoCustomer = {
  name: string;
  phone: string;
  email?: string;
  totalReservations: number;
  lastVisit: string;
  totalSpent: number;
};

// 電話番号から、その顧客の利用回数（キャンセル除く全て）を取得
export function getVisitCountByPhone(phone: string): number {
  return DEMO_RESERVATIONS.filter(
    (r) => r.customerPhone === phone && r.status !== "cancelled",
  ).length;
}

// 来訪パターンを簡易抽出（よく利用する施設・時期）
export function getCustomerPattern(phone: string): {
  favoriteFacility?: string;
  favoriteSeason?: string;
} {
  const past = DEMO_RESERVATIONS.filter(
    (r) =>
      r.customerPhone === phone &&
      r.status !== "cancelled",
  );
  if (past.length < 2) return {};

  // 施設の頻出をカウント
  const facilityCount = new Map<string, number>();
  for (const r of past) {
    for (const f of r.facilities) {
      facilityCount.set(f, (facilityCount.get(f) ?? 0) + 1);
    }
  }
  const favoriteFacility = [...facilityCount.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0];

  // 月の頻出をカウント
  const monthCount = new Map<string, number>();
  for (const r of past) {
    const month = r.checkin.slice(5, 7); // "07"
    monthCount.set(month, (monthCount.get(month) ?? 0) + 1);
  }
  const topMonth = [...monthCount.entries()].sort((a, b) => b[1] - a[1])[0];
  const favoriteSeason = topMonth ? `${parseInt(topMonth[0])}月` : undefined;

  return { favoriteFacility, favoriteSeason };
}

// =====================================================================
// 段取り（業務リスト）機能 — 仕様書 v0.2 §5.6
// =====================================================================

export type TaskCategory =
  | "cleaning"
  | "inspection"
  | "supplies"
  | "collection"
  | "communication"
  | "other";

export const TASK_CATEGORY_LABEL: Record<TaskCategory, string> = {
  cleaning: "清掃",
  inspection: "点検",
  supplies: "備品補充",
  collection: "収集・搬入",
  communication: "連絡・事務",
  other: "その他",
};

export const TASK_CATEGORY_COLOR: Record<TaskCategory, string> = {
  cleaning: "bg-emerald-100 text-emerald-800 border-emerald-200",
  inspection: "bg-blue-100 text-blue-800 border-blue-200",
  supplies: "bg-amber-100 text-amber-800 border-amber-200",
  collection: "bg-purple-100 text-purple-800 border-purple-200",
  communication: "bg-stone-100 text-stone-700 border-stone-200",
  other: "bg-stone-100 text-stone-700 border-stone-200",
};

export type TaskFrequency =
  | "daily"
  | "every2days"
  | "every3days"
  | "weekdays" // 曜日指定（複数選択。選んだ数 = 週N回）
  | "monthly" // 月1回（第N週の指定曜日）
  | "disabled";

export const TASK_FREQUENCY_LABEL: Record<TaskFrequency, string> = {
  daily: "毎日",
  every2days: "2日おき",
  every3days: "3日おき",
  weekdays: "曜日指定",
  monthly: "月1回",
  disabled: "停止中",
};

export const WEEKDAY_LABEL = ["日", "月", "火", "水", "木", "金", "土"];

export const MONTHLY_WEEK_LABEL: Record<number, string> = {
  1: "第1週",
  2: "第2週",
  3: "第3週",
  4: "第4週",
  5: "第5週",
};

export type ReservationTrigger = "dayBefore" | "morningOf" | "checkoutDay";

export const RESERVATION_TRIGGER_LABEL: Record<ReservationTrigger, string> = {
  dayBefore: "チェックイン前日",
  morningOf: "チェックイン当日朝",
  checkoutDay: "チェックアウト日",
};

export type TaskTemplate = {
  id: string;
  name: string;
  category: TaskCategory;
  enabled: boolean;
  rule:
    | {
        type: "reservationLinked";
        trigger: ReservationTrigger;
        // 施設名の部分一致でフィルタ。空配列なら全施設対象
        facilityKeywords: string[];
      }
    | {
        type: "periodic";
        frequency: TaskFrequency;
        // frequency === "weekdays" のとき：複数曜日（0=日, 6=土）
        // frequency === "monthly" のとき：単一曜日（要素1つ）
        weekdays?: number[];
        // every{N}days の起算日（YYYY-MM-DD）。未指定なら2026-05-01から起算
        anchorDate?: string;
        // frequency === "monthly" のとき：第N週（1-5）
        monthlyWeek?: number;
      };
  notes?: string;
};

export type Task = {
  id: string;
  templateId?: string; // 手動追加の場合は undefined
  date: string; // YYYY-MM-DD
  category: TaskCategory;
  name: string;
  reservationId?: string; // 予約連動の場合
  reservationLabel?: string; // 表示用（顧客名・棟など）
  done: boolean;
  notes?: string;
};

// ----- デモ用テンプレート -----
export const TASK_TEMPLATES: TaskTemplate[] = [
  // 予約連動
  {
    id: "tpl-r-checkout-cottage",
    name: "コテージ退室後清掃",
    category: "cleaning",
    enabled: true,
    rule: {
      type: "reservationLinked",
      trigger: "checkoutDay",
      facilityKeywords: ["コテージ"],
    },
    notes: "ゴミ・忘れ物確認・布団畳み・床清掃",
  },
  {
    id: "tpl-r-checkout-bungalow",
    name: "バンガロー退室後清掃",
    category: "cleaning",
    enabled: true,
    rule: {
      type: "reservationLinked",
      trigger: "checkoutDay",
      facilityKeywords: ["バンガロー"],
    },
  },
  {
    id: "tpl-r-pre-cottage",
    name: "コテージ入室前チェック",
    category: "inspection",
    enabled: true,
    rule: {
      type: "reservationLinked",
      trigger: "dayBefore",
      facilityKeywords: ["コテージ"],
    },
    notes: "布団セット数・備品・室内臭・水回り確認",
  },
  {
    id: "tpl-r-morning-key",
    name: "入室当日朝の鍵準備",
    category: "communication",
    enabled: true,
    rule: {
      type: "reservationLinked",
      trigger: "morningOf",
      facilityKeywords: ["コテージ", "バンガロー"],
    },
  },
  {
    id: "tpl-r-pet-setup",
    name: "D棟ペット用備品設置",
    category: "supplies",
    enabled: true,
    rule: {
      type: "reservationLinked",
      trigger: "morningOf",
      facilityKeywords: ["D棟"],
    },
    notes: "ペットゲージ・玄関マット・消臭スプレー",
  },
  // 定期
  {
    id: "tpl-p-toilet-central",
    name: "中央トイレ清掃",
    category: "cleaning",
    enabled: true,
    rule: { type: "periodic", frequency: "daily" },
  },
  {
    id: "tpl-p-shower",
    name: "シャワー棟清掃",
    category: "cleaning",
    enabled: true,
    rule: { type: "periodic", frequency: "every2days", anchorDate: "2026-06-01" },
  },
  {
    id: "tpl-p-kitchen",
    name: "炊事棟・BBQコーナー清掃",
    category: "cleaning",
    enabled: true,
    rule: { type: "periodic", frequency: "every3days", anchorDate: "2026-06-01" },
  },
  {
    id: "tpl-p-tp-restock",
    name: "トイレットペーパー補充確認",
    category: "supplies",
    enabled: true,
    rule: { type: "periodic", frequency: "every3days", anchorDate: "2026-06-01" },
  },
  {
    id: "tpl-p-septic",
    name: "浄化槽点検",
    category: "inspection",
    enabled: true,
    rule: { type: "periodic", frequency: "weekdays", weekdays: [5] },
  },
  {
    id: "tpl-p-fuel",
    name: "燃料・ガス残量確認",
    category: "inspection",
    enabled: true,
    rule: { type: "periodic", frequency: "weekdays", weekdays: [1] },
  },
  {
    id: "tpl-p-trash",
    name: "ゴミ収集日",
    category: "collection",
    enabled: true,
    rule: {
      type: "periodic",
      frequency: "monthly",
      weekdays: [5],
      monthlyWeek: 2,
    },
    notes: "朝、収集場所に出す",
  },
  {
    id: "tpl-p-fire-ext",
    name: "消火器・避難経路点検",
    category: "inspection",
    enabled: false,
    rule: { type: "periodic", frequency: "weekdays", weekdays: [1] },
    notes: "現状停止中（月1運用検討中）",
  },
];

// ----- 手動追加された段取り（デモ用） -----
export const MANUAL_TASKS: Task[] = [
  {
    id: "task-manual-001",
    date: TODAY,
    category: "communication",
    name: "富山市 担当課への月次報告書 提出",
    done: false,
    notes: "前月分の利用実績を整理",
  },
  {
    id: "task-manual-002",
    date: TODAY,
    category: "supplies",
    name: "BBQ用着火剤の追加発注",
    done: true,
    notes: "在庫残り3個",
  },
  {
    id: "task-manual-003",
    date: "2026-06-20",
    category: "other",
    name: "森林学習展示館の照明交換",
    done: false,
  },
];

// ----- 頻度判定 -----
function dayDiff(from: string, to: string): number {
  const ms = new Date(to).getTime() - new Date(from).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function getWeekday(date: string): number {
  return new Date(date).getDay();
}

function matchesPeriodicRule(
  rule: Extract<TaskTemplate["rule"], { type: "periodic" }>,
  date: string,
): boolean {
  if (rule.frequency === "disabled") return false;
  if (rule.frequency === "daily") return true;
  if (
    rule.frequency === "every2days" ||
    rule.frequency === "every3days"
  ) {
    const anchor = rule.anchorDate ?? "2026-05-01";
    const interval = rule.frequency === "every2days" ? 2 : 3;
    const diff = dayDiff(anchor, date);
    return diff >= 0 && diff % interval === 0;
  }
  // weekdays（曜日指定・複数選択）
  if (rule.frequency === "weekdays") {
    if (!rule.weekdays || rule.weekdays.length === 0) return false;
    return rule.weekdays.includes(getWeekday(date));
  }
  // monthly（月1回・第N週の指定曜日）
  if (rule.frequency === "monthly") {
    if (!rule.weekdays || rule.weekdays.length === 0) return false;
    if (!rule.monthlyWeek) return false;
    if (!rule.weekdays.includes(getWeekday(date))) return false;
    const dayOfMonth = new Date(date).getDate();
    const nthWeek = Math.ceil(dayOfMonth / 7);
    return nthWeek === rule.monthlyWeek;
  }
  return false;
}

function facilitiesMatch(
  facilities: string[],
  keywords: string[],
): boolean {
  if (keywords.length === 0) return true;
  return facilities.some((f) => keywords.some((k) => f.includes(k)));
}

function shiftDays(date: string, delta: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

// 指定日の段取り項目を自動生成（テンプレート + 手動）
export function generateTasksForDate(date: string): Task[] {
  const tasks: Task[] = [];

  for (const tmpl of TASK_TEMPLATES) {
    if (!tmpl.enabled) continue;

    if (tmpl.rule.type === "periodic") {
      if (matchesPeriodicRule(tmpl.rule, date)) {
        tasks.push({
          id: `${tmpl.id}@${date}`,
          templateId: tmpl.id,
          date,
          category: tmpl.category,
          name: tmpl.name,
          done: false,
          notes: tmpl.notes,
        });
      }
      continue;
    }

    // reservationLinked
    const trigger = tmpl.rule.trigger;
    let matchDate: string;
    if (trigger === "dayBefore") matchDate = shiftDays(date, 1); // 翌日チェックインの予約
    else if (trigger === "morningOf") matchDate = date;
    else matchDate = date; // checkoutDay

    for (const r of DEMO_RESERVATIONS) {
      if (r.status === "cancelled") continue;
      const facMatch = facilitiesMatch(r.facilities, tmpl.rule.facilityKeywords);
      if (!facMatch) continue;

      let hit = false;
      if (trigger === "checkoutDay" && r.checkout === matchDate) hit = true;
      if (trigger === "dayBefore" && r.checkin === matchDate) hit = true;
      if (trigger === "morningOf" && r.checkin === matchDate) hit = true;
      if (!hit) continue;

      tasks.push({
        id: `${tmpl.id}@${r.id}@${date}`,
        templateId: tmpl.id,
        date,
        category: tmpl.category,
        name: tmpl.name,
        reservationId: r.id,
        reservationLabel: `${r.customerName}（${r.facilities.join("／")}）`,
        done: false,
        notes: tmpl.notes,
      });
    }
  }

  // 手動タスク
  for (const t of MANUAL_TASKS) {
    if (t.date === date) tasks.push({ ...t });
  }

  // ソート：未完了→完了、カテゴリ順
  const catOrder: Record<TaskCategory, number> = {
    cleaning: 0,
    inspection: 1,
    supplies: 2,
    collection: 3,
    communication: 4,
    other: 5,
  };
  tasks.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return catOrder[a.category] - catOrder[b.category];
  });

  return tasks;
}

export function countOpenTasks(tasks: Task[]): { open: number; total: number } {
  return {
    open: tasks.filter((t) => !t.done).length,
    total: tasks.length,
  };
}

export type TaskLogStatus = "done" | "open" | "skipped";

export type TaskLog = Task & {
  status: TaskLogStatus;
  source: "auto" | "manual";
  completedAt?: string;
  completedBy?: string;
  logNote?: string;
};

const TASK_LOG_OVERRIDES: Record<
  string,
  Partial<Pick<TaskLog, "status" | "completedAt" | "completedBy" | "logNote">>
> = {
  "task-manual-001": {
    status: "done",
    completedAt: "16:20",
    completedBy: "山岸",
    logNote: "利用者数と売上メモを添付して提出済み",
  },
  "task-manual-002": {
    status: "done",
    completedAt: "10:15",
    completedBy: "奥様",
    logNote: "次回納品は5/7予定",
  },
  "tpl-p-kitchen@2026-06-13": {
    status: "skipped",
    completedBy: "山岸",
    logNote: "雨天で利用が少なかったため翌日に回した",
  },
  "tpl-p-shower@2026-06-19": {
    status: "open",
    logNote: "夕方の受付後に確認予定",
  },
  "tpl-r-morning-key@r-004@2026-06-19": {
    status: "done",
    completedAt: "09:10",
    completedBy: "村上",
    logNote: "18時以降到着案内も送信済み",
  },
};

function taskLogSeed(text: string): number {
  let total = 0;
  for (const char of text) total += char.charCodeAt(0);
  return total;
}

function defaultTaskLogStatus(task: Task): TaskLogStatus {
  if (task.done) return "done";
  if (task.date >= TODAY) return task.done ? "done" : "open";

  const seed = taskLogSeed(task.id);
  if (seed % 17 === 0) return "skipped";
  if (seed % 13 === 0) return "open";
  return "done";
}

function defaultCompletedAt(task: Task): string {
  const seed = taskLogSeed(task.id);
  const hour = 8 + (seed % 9);
  const minute = [0, 10, 20, 30, 40, 50][seed % 6];
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function defaultCompletedBy(task: Task): string {
  const staff = ["奥様", "山岸", "村上", "現場スタッフ"];
  return staff[taskLogSeed(task.id) % staff.length];
}

export function generateTaskLogsForDate(date: string): TaskLog[] {
  return generateTasksForDate(date).map((task) => {
    const override = TASK_LOG_OVERRIDES[task.id] ?? {};
    const status = override.status ?? defaultTaskLogStatus(task);
    const source = task.templateId ? "auto" : "manual";

    return {
      ...task,
      done: status === "done",
      status,
      source,
      completedAt:
        status === "done"
          ? override.completedAt ?? defaultCompletedAt(task)
          : undefined,
      completedBy:
        status === "done" || status === "skipped"
          ? override.completedBy ?? defaultCompletedBy(task)
          : undefined,
      logNote: override.logNote,
    };
  });
}

export function generateTaskLogsBetween(from: string, to: string): TaskLog[] {
  const logs: TaskLog[] = [];
  const current = new Date(from);
  const end = new Date(to);

  while (current <= end) {
    logs.push(...generateTaskLogsForDate(current.toISOString().slice(0, 10)));
    current.setDate(current.getDate() + 1);
  }

  return logs.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return (a.completedAt ?? "99:99").localeCompare(b.completedAt ?? "99:99");
  });
}

export function getCustomers(): DemoCustomer[] {
  const map = new Map<string, DemoCustomer>();
  for (const r of DEMO_RESERVATIONS) {
    if (r.status === "cancelled") continue;
    const key = r.customerPhone;
    const existing = map.get(key);
    if (existing) {
      existing.totalReservations += 1;
      existing.totalSpent += r.totalAmount;
      if (r.checkin > existing.lastVisit) existing.lastVisit = r.checkin;
    } else {
      map.set(key, {
        name: r.customerName,
        phone: r.customerPhone,
        email: r.customerEmail,
        totalReservations: 1,
        lastVisit: r.checkin,
        totalSpent: r.totalAmount,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    b.lastVisit.localeCompare(a.lastVisit),
  );
}
