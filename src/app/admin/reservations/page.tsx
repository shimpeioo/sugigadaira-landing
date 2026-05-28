"use client";

import { useMemo, useState } from "react";
import {
  DEMO_RESERVATIONS,
  ReservationStatus,
  isLateArrival,
  sortByCheckin,
  totalGuestCount,
} from "@/lib/demoData";

export default function ReservationsPage() {
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">(
    "all",
  );
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = sortByCheckin(DEMO_RESERVATIONS);
    if (statusFilter !== "all") {
      list = list.filter((r) => r.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.reservationNumber.toLowerCase().includes(q) ||
          r.customerPhone.includes(q),
      );
    }
    return list;
  }, [statusFilter, search]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-stone-800">予約一覧</h1>
        <p className="text-sm text-stone-500 mt-1">
          全 {DEMO_RESERVATIONS.length}件 ／ 表示 {filtered.length}件
        </p>
      </div>

      {/* フィルター */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-stone-600 mb-1">検索</label>
            <input
              type="text"
              placeholder="氏名・予約番号・電話番号"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-600 mb-1">
              ステータス
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as ReservationStatus | "all")
              }
              className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none bg-white"
            >
              <option value="all">すべて</option>
              <option value="confirmed">確定</option>
              <option value="checkedIn">受付済</option>
              <option value="completed">完了</option>
              <option value="cancelled">キャンセル</option>
            </select>
          </div>
        </div>
      </div>

      {/* 予約リスト */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-100">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-stone-700">
                  予約番号
                </th>
                <th className="px-3 py-2 text-left font-semibold text-stone-700">
                  代表者
                </th>
                <th className="px-3 py-2 text-left font-semibold text-stone-700">
                  期間
                </th>
                <th className="px-3 py-2 text-left font-semibold text-stone-700">
                  施設
                </th>
                <th className="px-3 py-2 text-right font-semibold text-stone-700">
                  人数
                </th>
                <th className="px-3 py-2 text-right font-semibold text-stone-700">
                  料金
                </th>
                <th className="px-3 py-2 text-center font-semibold text-stone-700">
                  状態
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50">
                  <td className="px-3 py-3 text-stone-700 font-mono text-xs whitespace-nowrap">
                    {r.reservationNumber}
                  </td>
                  <td className="px-3 py-3 text-stone-800">
                    <div className="flex items-center gap-1">
                      <span>{r.customerName}</span>
                      {r.hasPet && (
                        <span className="text-orange-500" title="ペット同伴">
                          🐾
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500">{r.customerPhone}</p>
                  </td>
                  <td className="px-3 py-3 text-stone-700 whitespace-nowrap">
                    <p>{r.checkin}</p>
                    <p className="text-xs text-stone-500">〜 {r.checkout}</p>
                    {isLateArrival(r.arrivalTime) && (
                      <p className="text-xs text-amber-600">
                        🌙 着 {r.arrivalTime}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-3 text-stone-700">
                    <ul className="space-y-0.5">
                      {r.facilities.map((f, i) => (
                        <li key={i} className="text-xs">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-3 py-3 text-right text-stone-700">
                    {totalGuestCount(r)}名
                  </td>
                  <td className="px-3 py-3 text-right text-stone-800 font-semibold whitespace-nowrap">
                    ¥{r.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-10 text-center text-stone-500"
                  >
                    該当する予約がありません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 経理エクスポート */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-semibold text-stone-800">経理データ出力</h3>
          <p className="text-xs text-stone-500 mt-1">
            NPO経理向けのExcel形式で売上明細を出力できます。
          </p>
        </div>
        <button className="bg-emerald-700 text-white font-semibold px-4 py-2 rounded-full hover:bg-emerald-800 transition-colors text-sm">
          📊 Excelをダウンロード
        </button>
      </div>
    </div>
  );
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
