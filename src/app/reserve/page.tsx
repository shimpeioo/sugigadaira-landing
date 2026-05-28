"use client";

import { useMemo, useState } from "react";

type FacilityType = "cottage" | "bungalow";

type Facility = {
  id: string;
  name: string;
  type: FacilityType;
  basePrice: number;
  baseCapacity?: number;
  maxCapacity?: number;
  petAllowed?: boolean;
};

const COTTAGES: Facility[] = [
  {
    id: "cottage-a",
    name: "コテージ A棟（ニッコウキスゲ・6人用）",
    type: "cottage",
    basePrice: 13200,
    baseCapacity: 6,
    maxCapacity: 8,
  },
  {
    id: "cottage-b",
    name: "コテージ B棟（コメツツジ・4人用）",
    type: "cottage",
    basePrice: 8800,
    baseCapacity: 4,
    maxCapacity: 6,
  },
  {
    id: "cottage-c",
    name: "コテージ C棟（シャクナゲ・4人用）",
    type: "cottage",
    basePrice: 8800,
    baseCapacity: 4,
    maxCapacity: 6,
  },
  {
    id: "cottage-d",
    name: "コテージ D棟（チングルマ・4人用・ペット可）",
    type: "cottage",
    basePrice: 8800,
    baseCapacity: 4,
    maxCapacity: 6,
    petAllowed: true,
  },
  {
    id: "cottage-e",
    name: "コテージ E棟（イワカガミ・4人用・追加不可）",
    type: "cottage",
    basePrice: 8800,
    baseCapacity: 4,
    maxCapacity: 4,
  },
];

const BUNGALOWS: Facility[] = [
  { id: "bungalow-1", name: "バンガロー 1番", type: "bungalow", basePrice: 3150 },
  { id: "bungalow-2", name: "バンガロー 2番", type: "bungalow", basePrice: 3150 },
];

const CAMPSITE_PER_PERSON = 220;
const TENT_BRING = 660;
const TENT_RENT = 880;
const COTTAGE_EXTRA_PER_PERSON = 1100;

function calculateNights(checkin: string, checkout: string): number {
  if (!checkin || !checkout) return 0;
  const ms = new Date(checkout).getTime() - new Date(checkin).getTime();
  const days = Math.round(ms / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

function nightsMultiplier(nights: number): number {
  if (nights <= 0) return 0;
  return 1 + (nights - 1) * 0.5;
}

type LineItem = { label: string; detail: string; amount: number };

type CalcInput = {
  selectedCottages: string[];
  selectedBungalows: string[];
  tentBringCount: number;
  tentRentCount: number;
  tentPeople: number;
  nights: number;
  adults: number;
  children: number;
  infants: number;
};

function calculate(input: CalcInput): {
  items: LineItem[];
  total: number;
  needsManualSheetFee: boolean;
  capacityExceeded: boolean;
  exceededCount: number;
  totalCottageMaxCap: number;
  cottagePeople: number;
} {
  const {
    selectedCottages,
    selectedBungalows,
    tentBringCount,
    tentRentCount,
    tentPeople,
    nights,
    adults,
    children,
    infants,
  } = input;

  if (nights <= 0)
    return {
      items: [],
      total: 0,
      needsManualSheetFee: false,
      capacityExceeded: false,
      exceededCount: 0,
      totalCottageMaxCap: 0,
      cottagePeople: 0,
    };

  const mult = nightsMultiplier(nights);
  const items: LineItem[] = [];

  // コテージ棟代
  let totalCottageBaseCap = 0;
  let totalCottageMaxCap = 0;
  for (const id of selectedCottages) {
    const f = COTTAGES.find((c) => c.id === id);
    if (!f) continue;
    totalCottageBaseCap += f.baseCapacity ?? 0;
    totalCottageMaxCap += f.maxCapacity ?? f.baseCapacity ?? 0;
    items.push({
      label: f.name,
      detail: `${f.basePrice.toLocaleString()}円 × ${nights}泊（連泊半額適用）`,
      amount: Math.round(f.basePrice * mult),
    });
  }

  // コテージ追加料金（シーツ代）
  // ルール1：コテージ＋バンガロー併用時は、超過分をバンガローで吸収できるためシーツ代不要
  // ルール2：テント利用者はコテージ宿泊者から除外（テント人数を引いた残りで判定）
  let needsManualSheetFee = false;
  const totalPeople = adults + children + infants;
  const hasBungalow = selectedBungalows.length > 0;
  const hasTentLocal = tentBringCount > 0 || tentRentCount > 0;
  // コテージに泊まる想定人数（テント利用者を除外、幼児はコテージにいると仮定）
  const cottagePeople = totalPeople - (hasTentLocal ? tentPeople : 0);

  if (selectedCottages.length > 0 && !hasBungalow) {
    if (selectedCottages.length === 1) {
      const f = COTTAGES.find((c) => c.id === selectedCottages[0]);
      if (f && cottagePeople > (f.baseCapacity ?? 0)) {
        const extra = cottagePeople - (f.baseCapacity ?? 0);
        items.push({
          label: "コテージ追加料金（シーツ代）",
          detail: `${COTTAGE_EXTRA_PER_PERSON}円 × ${extra}名 × ${nights}泊（連泊半額適用）`,
          amount: Math.round(COTTAGE_EXTRA_PER_PERSON * extra * mult),
        });
      }
    } else {
      if (cottagePeople > totalCottageBaseCap) {
        const extra = cottagePeople - totalCottageBaseCap;
        items.push({
          label: "コテージ追加料金（概算・要相談）",
          detail: `合計定員${totalCottageBaseCap}名超過分 ${extra}名分の概算（実際の振り分けは現地相談）`,
          amount: Math.round(COTTAGE_EXTRA_PER_PERSON * extra * mult),
        });
        needsManualSheetFee = true;
      }
    }
  }

  // バンガロー棟代
  for (const id of selectedBungalows) {
    const f = BUNGALOWS.find((b) => b.id === id);
    if (!f) continue;
    items.push({
      label: f.name,
      detail: `${f.basePrice.toLocaleString()}円 × ${nights}泊（連泊半額適用）`,
      amount: Math.round(f.basePrice * mult),
    });
  }

  // テント料金
  if (tentBringCount > 0) {
    items.push({
      label: "持込テント",
      detail: `${TENT_BRING}円 × ${tentBringCount}張 × ${nights}泊（連泊半額適用）`,
      amount: Math.round(TENT_BRING * tentBringCount * mult),
    });
  }
  if (tentRentCount > 0) {
    items.push({
      label: "テント貸出し",
      detail: `${TENT_RENT}円 × ${tentRentCount}張 × ${nights}泊（連泊半額適用）`,
      amount: Math.round(TENT_RENT * tentRentCount * mult),
    });
  }

  // テント人数料金（テント利用がある場合のみ、tentPeopleで指定された人数で計算）
  const hasTent = tentBringCount > 0 || tentRentCount > 0;
  if (hasTent && tentPeople > 0) {
    items.push({
      label: "キャンプ場使用料（テント利用人数）",
      detail: `${CAMPSITE_PER_PERSON}円 × ${tentPeople}名 × ${nights}泊（小学生以上、連泊半額適用）`,
      amount: Math.round(CAMPSITE_PER_PERSON * tentPeople * mult),
    });
  }

  // 定員超過チェック（コテージのみ・バンガロー無しの場合）
  let capacityExceeded = false;
  let exceededCount = 0;
  if (selectedCottages.length > 0 && !hasBungalow) {
    if (cottagePeople > totalCottageMaxCap) {
      capacityExceeded = true;
      exceededCount = cottagePeople - totalCottageMaxCap;
    }
  }

  const total = items.reduce((sum, it) => sum + it.amount, 0);
  return {
    items,
    total,
    needsManualSheetFee,
    capacityExceeded,
    exceededCount,
    totalCottageMaxCap,
    cottagePeople,
  };
}

export default function ReservePage() {
  const [selectedCottages, setSelectedCottages] = useState<string[]>([]);
  const [selectedBungalows, setSelectedBungalows] = useState<string[]>([]);
  const [tentBringCount, setTentBringCount] = useState(0);
  const [tentRentCount, setTentRentCount] = useState(0);
  const [tentPeople, setTentPeople] = useState(0);

  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  // 双方向同期：合計人数（料金対象 = 大人＋小中）と テントサイト利用人数 を整合させる
  // テント人数を増やしたら、不足分を大人に追加。合計を減らしてテント人数を下回ったらテント人数も連動して減らす。
  function updateTentPeople(next: number) {
    const v = Math.max(0, next);
    setTentPeople(v);
    const totalPaying = adults + children;
    if (v > totalPaying) {
      setAdults(adults + (v - totalPaying));
    }
  }
  function updateAdults(next: number) {
    const v = Math.max(0, next);
    setAdults(v);
    const newTotal = v + children;
    if (tentPeople > newTotal) setTentPeople(newTotal);
  }
  function updateChildren(next: number) {
    const v = Math.max(0, next);
    setChildren(v);
    const newTotal = adults + v;
    if (tentPeople > newTotal) setTentPeople(newTotal);
  }

  const [hasPet, setHasPet] = useState(false);
  const [petInfo, setPetInfo] = useState("");

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const nights = calculateNights(checkin, checkout);

  const {
    items,
    total,
    needsManualSheetFee,
    capacityExceeded,
    exceededCount,
    totalCottageMaxCap,
    cottagePeople,
  } = useMemo(
    () =>
      calculate({
        selectedCottages,
        selectedBungalows,
        tentBringCount,
        tentRentCount,
        tentPeople,
        nights,
        adults,
        children,
        infants,
      }),
    [
      selectedCottages,
      selectedBungalows,
      tentBringCount,
      tentRentCount,
      tentPeople,
      nights,
      adults,
      children,
      infants,
    ],
  );

  const totalPeople = adults + children + infants;
  const hasTent = tentBringCount > 0 || tentRentCount > 0;
  const hasAnyFacility =
    selectedCottages.length > 0 ||
    selectedBungalows.length > 0 ||
    hasTent;

  // ペット可コテージが選ばれているか
  const showPetField = selectedCottages.some(
    (id) => COTTAGES.find((c) => c.id === id)?.petAllowed === true,
  );

  const isLateArrival = arrivalTime && arrivalTime >= "17:00";

  const isGroup = selectedCottages.length + selectedBungalows.length > 1 || hasTent && (selectedCottages.length > 0 || selectedBungalows.length > 0);

  const toggleCottage = (id: string) => {
    setSelectedCottages((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleBungalow = (id: string) => {
    setSelectedBungalows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  if (submitted) {
    const facilitiesSummary: string[] = [
      ...selectedCottages.map(
        (id) => COTTAGES.find((c) => c.id === id)?.name ?? id,
      ),
      ...selectedBungalows.map(
        (id) => BUNGALOWS.find((b) => b.id === id)?.name ?? id,
      ),
    ];
    if (tentBringCount > 0)
      facilitiesSummary.push(`持込テント ${tentBringCount}張`);
    if (tentRentCount > 0)
      facilitiesSummary.push(`貸出テント ${tentRentCount}張`);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-stone-50">
        <div className="max-w-xl w-full bg-white rounded-lg shadow p-10 text-center">
          <div className="text-emerald-600 text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-4 text-stone-800">
            ご予約内容を受け付けました（試作版）
          </h1>
          <p className="text-stone-600 mb-8 leading-relaxed">
            これは試作版のため、実際の予約は確定していません。
            <br />
            正式版では、ここで予約番号と確認メールが送信されます。
          </p>
          <div className="text-left bg-stone-50 rounded p-6 mb-6 text-sm space-y-2">
            <p>
              <span className="text-stone-500">代表者：</span>
              {name || "—"}
            </p>
            <div>
              <span className="text-stone-500">利用施設：</span>
              <ul className="ml-4 mt-1 list-disc text-stone-700">
                {facilitiesSummary.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <p>
              <span className="text-stone-500">期間：</span>
              {checkin} 〜 {checkout}（{nights}泊）
            </p>
            <p>
              <span className="text-stone-500">人数：</span>
              大人 {adults}名 / 小・中 {children}名 / 幼児 {infants}名
            </p>
            <p className="text-emerald-700 font-semibold pt-2 border-t border-stone-200">
              合計：{total.toLocaleString()}円
            </p>
            {needsManualSheetFee && (
              <p className="text-xs text-amber-700">
                ※ 複数コテージの追加料金は概算です。当日の振り分けに応じて精算します。
              </p>
            )}
          </div>
          {isLateArrival && (
            <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-6 text-sm text-left">
              <p className="font-semibold text-amber-800 mb-2">
                ⚠️ 17時以降のご到着について
              </p>
              <p className="text-amber-700">
                管理人は17時で退出します。ご到着時は施設を直接ご利用ください。
                受付は翌朝8:30以降にお願いします。緊急時は 090-6478-6054 まで。
              </p>
            </div>
          )}
          <button
            onClick={() => setSubmitted(false)}
            className="text-emerald-700 hover:underline"
          >
            フォームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-emerald-800 text-white py-6 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-emerald-200 text-xs tracking-widest mb-1">
            RESERVATION
          </p>
          <h1 className="text-2xl font-bold">ご予約</h1>
          <p className="text-emerald-100 text-sm mt-1">
            21世紀の森 杉ヶ平キャンプ場
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-8 text-xs text-amber-800">
          <strong>※ 試作版のお知らせ：</strong>このページは設計確認のための試作版です。ご入力いただいても予約は確定しませんのでご安心ください。
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-10"
        >
          {/* Section 1: 利用施設（複数選択可） */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-stone-800 mb-2 pb-3 border-b">
              ① 利用施設（複数選択可）
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              団体でのご利用はコテージ・バンガロー・テントを組み合わせて選べます。
            </p>

            {/* コテージ */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-stone-700 mb-2">
                コテージ
              </h3>
              <div className="space-y-2">
                {COTTAGES.map((f) => (
                  <label
                    key={f.id}
                    className={`flex items-start p-3 rounded border cursor-pointer transition-colors ${
                      selectedCottages.includes(f.id)
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCottages.includes(f.id)}
                      onChange={() => toggleCottage(f.id)}
                      className="mt-1 mr-3 accent-emerald-700"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-stone-800">{f.name}</div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {f.basePrice.toLocaleString()}円/棟（
                        {f.baseCapacity}人まで）
                        {f.maxCapacity && f.maxCapacity > (f.baseCapacity ?? 0)
                          ? ` / 最大${f.maxCapacity}人まで（追加1,100円/人）`
                          : ""}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* バンガロー */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-stone-700 mb-2">
                バンガロー
              </h3>
              <div className="space-y-2">
                {BUNGALOWS.map((f) => (
                  <label
                    key={f.id}
                    className={`flex items-start p-3 rounded border cursor-pointer transition-colors ${
                      selectedBungalows.includes(f.id)
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBungalows.includes(f.id)}
                      onChange={() => toggleBungalow(f.id)}
                      className="mt-1 mr-3 accent-emerald-700"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-stone-800">{f.name}</div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {f.basePrice.toLocaleString()}円/棟
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* テントサイト */}
            <div>
              <h3 className="text-sm font-semibold text-stone-700 mb-2">
                テントサイト
              </h3>
              <p className="text-xs text-stone-500 mb-3">
                区画割のないフリーサイトです。場内の広いフィールドに好きな場所にお張りいただけます。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-stone-200 rounded p-3">
                  <div className="text-sm font-medium text-stone-800 mb-1">
                    持込テント
                  </div>
                  <div className="text-xs text-stone-500 mb-2">660円/張</div>
                  <input
                    type="number"
                    min={0}
                    value={tentBringCount}
                    onChange={(e) => setTentBringCount(Number(e.target.value))}
                    className="w-24 border border-stone-300 rounded px-3 py-1 focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="ml-2 text-stone-600 text-sm">張</span>
                </div>
                <div className="border border-stone-200 rounded p-3">
                  <div className="text-sm font-medium text-stone-800 mb-1">
                    テント貸出し
                  </div>
                  <div className="text-xs text-stone-500 mb-2">880円/張</div>
                  <input
                    type="number"
                    min={0}
                    value={tentRentCount}
                    onChange={(e) => setTentRentCount(Number(e.target.value))}
                    className="w-24 border border-stone-300 rounded px-3 py-1 focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="ml-2 text-stone-600 text-sm">張</span>
                </div>
              </div>
              {hasTent && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded">
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    テントサイト利用人数（小学生以上）
                    <span className="text-red-600">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={tentPeople}
                      onChange={(e) =>
                        updateTentPeople(Number(e.target.value))
                      }
                      className="w-32 border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
                    />
                    <span className="text-stone-700 text-sm">名</span>
                    <span className="text-xs text-stone-500 ml-2">
                      220円 × 人数 で計算（幼児は無料）
                    </span>
                  </div>
                </div>
              )}
            </div>

            {!hasAnyFacility && (
              <p className="text-xs text-red-600 mt-4">
                ⚠️ 少なくとも1つの施設をお選びください。
              </p>
            )}
            {capacityExceeded && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm">
                <p className="font-semibold text-red-800 mb-1">
                  ⚠️ 選択中の施設の最大定員を超えています
                </p>
                <p className="text-red-700">
                  コテージ宿泊予定 {cottagePeople}名 に対し、選択中のコテージ最大定員は {totalCottageMaxCap}名です（{exceededCount}名超過）。
                </p>
                <p className="text-red-700 mt-2">
                  以下のいずれかをご検討ください：
                </p>
                <ul className="list-disc ml-5 text-red-700 mt-1 space-y-0.5">
                  <li>別のコテージを追加で選ぶ</li>
                  <li>バンガローを追加（人数制限なし、超過分を吸収できます）</li>
                  <li>テントサイトを追加して、テント利用人数を増やす</li>
                </ul>
              </div>
            )}
            {isGroup && !capacityExceeded && (
              <p className="text-xs text-emerald-700 mt-4 bg-emerald-50 rounded p-2">
                💡 団体予約として処理されます。複数施設の追加料金は概算となり、当日精算で調整します。
              </p>
            )}
          </section>

          {/* Section 2: 期間 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-stone-800 mb-4 pb-3 border-b">
              ② 期間・到着時刻
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  チェックイン日 <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={checkin}
                  onChange={(e) => setCheckin(e.target.value)}
                  required
                  className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  チェックアウト日 <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={checkout}
                  onChange={(e) => setCheckout(e.target.value)}
                  required
                  className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  到着予定時刻 <span className="text-red-600">*</span>
                </label>
                <input
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  required
                  className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
                {isLateArrival && (
                  <p className="text-xs text-amber-700 mt-1">
                    ⚠️ 17時以降は管理人不在です。受付は翌朝になります。
                  </p>
                )}
              </div>
              {nights > 0 && (
                <div className="flex items-end">
                  <p className="text-sm text-stone-600">
                    宿泊数：
                    <span className="font-bold text-emerald-700">{nights}泊</span>
                    {nights >= 2 && (
                      <span className="text-xs text-stone-500 ml-2">
                        （2泊目以降は半額）
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Section 3: 人数 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-stone-800 mb-4 pb-3 border-b">
              ③ ご利用人数（合計）
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  大人
                </label>
                <input
                  type="number"
                  min={0}
                  value={adults}
                  onChange={(e) => updateAdults(Number(e.target.value))}
                  className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  小・中
                </label>
                <input
                  type="number"
                  min={0}
                  value={children}
                  onChange={(e) => updateChildren(Number(e.target.value))}
                  className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  幼児（無料）
                </label>
                <input
                  type="number"
                  min={0}
                  value={infants}
                  onChange={(e) => setInfants(Number(e.target.value))}
                  className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-3">
              合計 {totalPeople}名（団体の場合、施設ごとの人数振り分けは現地で確認します）
            </p>
          </section>

          {/* Section 4: ペット同伴（D棟が選ばれている場合のみ） */}
          {showPetField && (
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-stone-800 mb-4 pb-3 border-b">
                ④ ペット同伴
              </h2>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hasPet}
                    onChange={(e) => setHasPet(e.target.checked)}
                    className="mr-2 accent-emerald-700"
                  />
                  ペットを同伴する
                </label>
                {hasPet && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      ペットの種類・頭数
                    </label>
                    <input
                      type="text"
                      value={petInfo}
                      onChange={(e) => setPetInfo(e.target.value)}
                      placeholder="例：小型犬1匹"
                      className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
                    />
                    <p className="text-xs text-stone-500 mt-2">
                      ※ 室内は玄関までで、ゲージ着用、お部屋には上げないでください。
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Section 5: 代表者情報 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-stone-800 mb-4 pb-3 border-b">
              {showPetField ? "⑤" : "④"} 代表者情報
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  代表者氏名 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  住所 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    電話番号 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="090-1234-5678"
                    className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: 特記事項 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-stone-800 mb-4 pb-3 border-b">
              特記事項・ご要望（任意）
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="アレルギー、車椅子利用、団体名、その他ご要望など"
              className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
            />
          </section>

          {/* 料金まとめ */}
          <section className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-emerald-900 mb-4">
              料金のお見積もり
            </h2>
            {items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-start py-2 border-b border-emerald-200"
                  >
                    <div className="flex-1">
                      <div className="text-stone-800">{item.label}</div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {item.detail}
                      </div>
                    </div>
                    <div className="font-semibold text-stone-800 ml-4">
                      {item.amount.toLocaleString()}円
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 text-xl">
                  <span className="font-bold text-emerald-900">合計</span>
                  <span className="font-bold text-emerald-700">
                    {total.toLocaleString()}円
                  </span>
                </div>
                {needsManualSheetFee && (
                  <p className="text-xs text-amber-700 bg-amber-50 rounded p-2">
                    ⚠️ 複数コテージのご利用です。シーツ代は概算で表示しています。当日の振り分けに応じて精算します。
                  </p>
                )}
                <p className="text-xs text-stone-500 text-right">
                  当日現地でのお支払いとなります
                </p>
              </div>
            ) : (
              <p className="text-stone-600 text-sm">
                施設・期間・人数を入力すると料金が表示されます。
              </p>
            )}
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={!hasAnyFacility || nights <= 0 || capacityExceeded}
            className="w-full bg-emerald-700 text-white font-bold py-4 rounded-full hover:bg-emerald-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
          >
            {capacityExceeded
              ? "定員を超えているため予約できません"
              : "この内容で予約を確認する"}
          </button>
        </form>
      </div>
    </div>
  );
}
