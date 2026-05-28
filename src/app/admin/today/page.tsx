"use client";

import { useMemo, useState } from "react";
import {
  TODAY,
  DemoReservation,
  getTodayReservations,
  getVisitCountByPhone,
  getCustomerPattern,
  isLateArrival,
  totalGuestCount,
} from "@/lib/demoData";

type ReservationLocalState = {
  status: "confirmed" | "checkedIn" | "completed";
  adults: number;
  children: number;
  infants: number;
  checkout: string;
  notes: string;
  estimatedAmount: number;
  paidAmount?: number;
  refundAmount?: number;
  mode: "view" | "editing" | "checkout";
};

function calcNights(checkin: string, checkout: string): number {
  if (!checkin || !checkout) return 0;
  const ms = new Date(checkout).getTime() - new Date(checkin).getTime();
  const days = Math.round(ms / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

function nightsMultiplier(nights: number): number {
  if (nights <= 0) return 0;
  return 1 + (nights - 1) * 0.5;
}

// 簡易再計算（プロトタイプ用）
// 元の合計から「1泊相当の単価」を逆算し、変更後の泊数・人数で再計算
function estimateAmount(
  original: DemoReservation,
  newAdults: number,
  newChildren: number,
  newCheckout: string,
): number {
  const origNights = calcNights(original.checkin, original.checkout);
  const newNights = calcNights(original.checkin, newCheckout);
  const origMult = nightsMultiplier(origNights);
  const newMult = nightsMultiplier(newNights);

  if (origNights <= 0 || origMult <= 0) return original.totalAmount;

  const baseRate = original.totalAmount / origMult;
  let est = baseRate * newMult;

  // テント利用の場合、人数差分に応じた料金を加算
  const hasTent = (original.tentPeople ?? 0) > 0;
  if (hasTent) {
    const origPaying = original.adults + original.children;
    const newPaying = newAdults + newChildren;
    const diff = newPaying - origPaying;
    if (diff !== 0) {
      est += 220 * diff * newMult;
    }
  }

  return Math.max(0, Math.round(est));
}

export default function TodayList() {
  const list = getTodayReservations();

  // 各予約のローカル状態を保持
  const [states, setStates] = useState<Record<string, ReservationLocalState>>(
    () => {
      const init: Record<string, ReservationLocalState> = {};
      for (const r of list) {
        init[r.id] = {
          status: r.status === "completed" ? "completed" : "confirmed",
          adults: r.adults,
          children: r.children,
          infants: r.infants,
          checkout: r.checkout,
          notes: r.notes ?? "",
          estimatedAmount: r.totalAmount,
          mode: "view",
        };
      }
      return init;
    },
  );

  const summary = useMemo(() => {
    const totalGuests = list.reduce((sum, r) => sum + totalGuestCount(r), 0);
    const withPet = list.filter((r) => r.hasPet).length;
    const lateArrivals = list.filter((r) =>
      isLateArrival(r.arrivalTime),
    ).length;
    return { totalGuests, withPet, lateArrivals };
  }, [list]);

  function updateState(id: string, patch: Partial<ReservationLocalState>) {
    setStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-stone-800">本日の受付リスト</h1>
        <p className="text-sm text-stone-500 mt-1">
          {TODAY} ・ 受付 {list.length}組 / 利用者 {summary.totalGuests}名 /
          ペット同伴 {summary.withPet}件 / 17時以降到着{" "}
          {summary.lateArrivals}件
        </p>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center text-stone-500">
          本日の受付はありません。
        </div>
      ) : (
        <ul className="space-y-4">
          {list
            .sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime))
            .map((r) => (
              <ReservationCard
                key={r.id}
                reservation={r}
                state={states[r.id]}
                onUpdate={(patch) => updateState(r.id, patch)}
              />
            ))}
        </ul>
      )}
    </div>
  );
}

function ReservationCard({
  reservation: r,
  state,
  onUpdate,
}: {
  reservation: DemoReservation;
  state: ReservationLocalState;
  onUpdate: (patch: Partial<ReservationLocalState>) => void;
}) {
  const visitCount = getVisitCountByPhone(r.customerPhone);
  const pattern = getCustomerPattern(r.customerPhone);
  const repeaterMark =
    visitCount >= 3 ? "★" : visitCount === 2 ? "☆" : null;
  const newNights = calcNights(r.checkin, state.checkout);
  const origNights = calcNights(r.checkin, r.checkout);
  const isAmountChanged =
    state.mode !== "view" && state.estimatedAmount !== r.totalAmount;

  function recalculate() {
    const est = estimateAmount(
      r,
      state.adults,
      state.children,
      state.checkout,
    );
    onUpdate({ estimatedAmount: est });
  }

  function startEdit() {
    onUpdate({ mode: "editing" });
  }
  function cancelEdit() {
    onUpdate({
      mode: "view",
      adults: r.adults,
      children: r.children,
      infants: r.infants,
      checkout: r.checkout,
      estimatedAmount: r.totalAmount,
    });
  }
  function checkin() {
    onUpdate({
      mode: "view",
      status: "checkedIn",
      paidAmount: state.estimatedAmount,
    });
  }
  function startCheckout() {
    onUpdate({ mode: "checkout" });
  }
  function confirmCheckout() {
    const refund = (state.paidAmount ?? 0) - state.estimatedAmount;
    onUpdate({
      mode: "view",
      status: "completed",
      refundAmount: refund > 0 ? refund : 0,
    });
  }

  return (
    <li className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* ヘッダー行 */}
      <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-xs text-stone-500">{r.reservationNumber}</p>
          <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            {r.customerName}
            {repeaterMark && (
              <span
                className={`${
                  visitCount >= 3 ? "text-amber-500" : "text-stone-400"
                } text-xl leading-none`}
                title={`${visitCount}回目のご利用`}
              >
                {repeaterMark}
              </span>
            )}
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            {visitCount === 1
              ? "初めてのご利用"
              : `${visitCount}回目のご利用`}
            {pattern.favoriteFacility && (
              <span className="ml-2 text-stone-500">
                ・好み：{pattern.favoriteFacility}
                {pattern.favoriteSeason && ` / ${pattern.favoriteSeason}`}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusChip status={state.status} />
          {r.hasPet && (
            <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded">
              🐾 ペット同伴
            </span>
          )}
          {isLateArrival(r.arrivalTime) && (
            <span className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded">
              🌙 17時以降到着
            </span>
          )}
        </div>
      </div>

      {/* 詳細（閲覧モード） */}
      {state.mode === "view" && (
        <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-xs text-stone-500">到着予定</p>
            <p className="font-semibold text-stone-800">{r.arrivalTime}</p>
          </div>
          <div>
            <p className="text-xs text-stone-500">人数</p>
            <p className="font-semibold text-stone-800">
              合計 {state.adults + state.children + state.infants}名
            </p>
            <p className="text-xs text-stone-500">
              大人{state.adults} / 小中{state.children} / 幼児{state.infants}
            </p>
          </div>
          <div>
            <p className="text-xs text-stone-500">期間（{newNights}泊）</p>
            <p className="font-semibold text-stone-800">
              {r.checkin}
              <br />〜 {state.checkout}
            </p>
          </div>
          <div>
            <p className="text-xs text-stone-500">
              {state.status === "completed" ? "確定金額" : "予定金額"}
            </p>
            <p className="font-semibold text-stone-800">
              ¥{state.estimatedAmount.toLocaleString()}
            </p>
            {state.paidAmount && state.paidAmount !== state.estimatedAmount && (
              <p className="text-xs text-stone-500">
                受領 ¥{state.paidAmount.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 編集モード */}
      {(state.mode === "editing" || state.mode === "checkout") && (
        <div className="px-4 py-4 bg-emerald-50 border-y border-emerald-200">
          <p className="font-semibold text-emerald-900 mb-3 text-sm">
            {state.mode === "editing"
              ? "✏️ 受付前の最終確認・変更"
              : "🏁 チェックアウト時の精算（実際の利用に合わせて修正）"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-stone-700 mb-1">大人</label>
              <input
                type="number"
                min={0}
                value={state.adults}
                onChange={(e) => onUpdate({ adults: Number(e.target.value) })}
                className="w-full border border-stone-300 rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-700 mb-1">
                小・中
              </label>
              <input
                type="number"
                min={0}
                value={state.children}
                onChange={(e) =>
                  onUpdate({ children: Number(e.target.value) })
                }
                className="w-full border border-stone-300 rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-700 mb-1">
                幼児（無料）
              </label>
              <input
                type="number"
                min={0}
                value={state.infants}
                onChange={(e) => onUpdate({ infants: Number(e.target.value) })}
                className="w-full border border-stone-300 rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs text-stone-700 mb-1">
                チェックアウト日（実際）
              </label>
              <input
                type="date"
                value={state.checkout}
                min={r.checkin}
                onChange={(e) => onUpdate({ checkout: e.target.value })}
                className="w-full sm:w-auto border border-stone-300 rounded px-2 py-1 text-sm"
              />
              <p className="text-xs text-stone-500 mt-1">
                予約：{r.checkin}〜{r.checkout}（{origNights}泊）
                ／ 実際：{newNights}泊
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={recalculate}
              className="text-sm border border-emerald-700 text-emerald-700 font-semibold px-3 py-1.5 rounded-full hover:bg-emerald-100"
            >
              🧮 金額を再計算
            </button>
          </div>

          {/* 金額表示 */}
          <div className="mt-4 p-3 bg-white rounded border border-emerald-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-600">予約時の予定金額</span>
              <span className="text-stone-700">
                ¥{r.totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1 text-base">
              <span className="font-semibold text-emerald-900">
                {state.mode === "editing" ? "確定金額" : "実費"}
              </span>
              <span className="font-bold text-emerald-700">
                ¥{state.estimatedAmount.toLocaleString()}
              </span>
            </div>
            {state.mode === "checkout" && state.paidAmount != null && (
              <>
                <div className="flex items-center justify-between mt-1 text-sm">
                  <span className="text-stone-600">受付時受領済み</span>
                  <span className="text-stone-700">
                    ¥{state.paidAmount.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-emerald-100 flex items-center justify-between">
                  {state.paidAmount > state.estimatedAmount ? (
                    <>
                      <span className="font-semibold text-red-700">
                        💴 返金額
                      </span>
                      <span className="font-bold text-red-700 text-lg">
                        ¥
                        {(
                          state.paidAmount - state.estimatedAmount
                        ).toLocaleString()}
                      </span>
                    </>
                  ) : state.paidAmount < state.estimatedAmount ? (
                    <>
                      <span className="font-semibold text-blue-700">
                        💰 追加徴収額
                      </span>
                      <span className="font-bold text-blue-700 text-lg">
                        ¥
                        {(
                          state.estimatedAmount - state.paidAmount
                        ).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-stone-600 text-sm">
                      ✓ 過不足なし
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* 編集モードのアクション */}
          {state.mode === "editing" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={checkin}
                className="text-sm bg-emerald-700 text-white font-semibold px-4 py-2 rounded-full hover:bg-emerald-800"
              >
                ✓ 受付完了（金額確定・決済受領）
              </button>
              <button
                onClick={cancelEdit}
                className="text-sm border border-stone-300 text-stone-700 font-semibold px-4 py-2 rounded-full hover:bg-stone-50"
              >
                変更を取り消す
              </button>
            </div>
          )}

          {/* チェックアウトモードのアクション */}
          {state.mode === "checkout" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={confirmCheckout}
                className="text-sm bg-stone-700 text-white font-semibold px-4 py-2 rounded-full hover:bg-stone-800"
              >
                🏁 チェックアウト完了（精算済）
              </button>
              <button
                onClick={() => onUpdate({ mode: "view" })}
                className="text-sm border border-stone-300 text-stone-700 font-semibold px-4 py-2 rounded-full hover:bg-stone-50"
              >
                取消
              </button>
            </div>
          )}
        </div>
      )}

      {/* 施設情報 */}
      <div className="px-4 py-3 bg-stone-50 border-t border-stone-100">
        <p className="text-xs text-stone-500 mb-1">利用施設</p>
        <ul className="text-sm text-stone-800 list-disc ml-5">
          {r.facilities.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>

      {r.hasPet && r.petInfo && (
        <div className="px-4 py-3 bg-orange-50 border-t border-orange-100 text-sm">
          <p className="text-xs text-orange-700 font-semibold mb-1">
            🐾 ペット情報
          </p>
          <p className="text-stone-800">{r.petInfo}</p>
          <p className="text-xs text-orange-700 mt-1">
            ※ 室内は玄関までで、ゲージ着用、お部屋には上げないようご案内
          </p>
        </div>
      )}

      {state.notes && (
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 text-sm">
          <p className="text-xs text-stone-500 mb-1">特記事項</p>
          <p className="text-stone-700">{state.notes}</p>
        </div>
      )}

      {/* ステータスごとのアクション */}
      <div className="px-4 py-3 border-t border-stone-100 flex gap-2 flex-wrap">
        {state.status === "confirmed" && state.mode === "view" && (
          <button
            onClick={startEdit}
            className="text-sm bg-emerald-700 text-white font-semibold px-4 py-2 rounded-full hover:bg-emerald-800"
          >
            ✏️ 受付・編集する
          </button>
        )}
        {state.status === "checkedIn" && state.mode === "view" && (
          <>
            <span className="text-sm text-emerald-700 px-4 py-2">
              ✓ 受付済み（¥{state.paidAmount?.toLocaleString()} 受領）
            </span>
            <button
              onClick={startCheckout}
              className="text-sm border-2 border-stone-700 text-stone-700 font-semibold px-4 py-2 rounded-full hover:bg-stone-100"
            >
              🏁 チェックアウト精算
            </button>
          </>
        )}
        {state.status === "completed" && state.mode === "view" && (
          <span className="text-sm text-stone-600 px-4 py-2">
            ✓ 完了 ・ 確定 ¥{state.estimatedAmount.toLocaleString()}
            {state.refundAmount != null && state.refundAmount > 0 && (
              <span className="ml-2 text-red-600">
                （返金 ¥{state.refundAmount.toLocaleString()}）
              </span>
            )}
          </span>
        )}
      </div>
    </li>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    confirmed: {
      label: "予約確定",
      color: "bg-emerald-100 text-emerald-800",
    },
    checkedIn: { label: "受付済み", color: "bg-blue-100 text-blue-800" },
    completed: { label: "完了", color: "bg-stone-200 text-stone-700" },
  };
  const v = map[status] ?? { label: status, color: "bg-stone-100 text-stone-700" };
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded ${v.color}`}>
      {v.label}
    </span>
  );
}
