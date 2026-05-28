"use client";

import { useState } from "react";

// デモ用の予約データ（試作版用、実際はサーバーから取得）
const DEMO_RESERVATION = {
  reservationNumber: "SUG-2026-001",
  email: "demo@example.com",
  phone: "09012345678",
  facilityName: "コテージ D棟（チングルマ・4人用・ペット可）",
  facilityType: "cottage" as const,
  petAllowed: true,
  checkin: "2026-07-15",
  checkout: "2026-07-17",
  name: "山田 太郎",
  address: "富山県富山市〇〇町1-2-3",
};

const normalizePhone = (s: string) => s.replace(/[^\d]/g, "");

type Mode = "auth" | "view" | "cancelled";

export default function ManageReservationPage() {
  const [mode, setMode] = useState<Mode>("auth");
  const [authNumber, setAuthNumber] = useState("");
  const [authContact, setAuthContact] = useState("");
  const [authError, setAuthError] = useState("");

  // 編集可能項目（認証後に表示）
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [infants, setInfants] = useState(1);
  const [arrivalTime, setArrivalTime] = useState("16:00");
  const [hasPet, setHasPet] = useState(true);
  const [petInfo, setPetInfo] = useState("小型犬 1匹（柴犬）");
  const [notes, setNotes] = useState("BBQセットを使いたいです");
  const [showSaved, setShowSaved] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const numberMatch = authNumber.trim() === DEMO_RESERVATION.reservationNumber;
    const contact = authContact.trim().toLowerCase();
    const contactMatch =
      contact === DEMO_RESERVATION.email ||
      normalizePhone(contact) === DEMO_RESERVATION.phone;

    if (numberMatch && contactMatch) {
      setMode("view");
    } else {
      setAuthError(
        "予約番号またはお客様情報が一致しません。試作版では下記のデモ情報をご利用ください。",
      );
    }
  };

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  };

  const handleCancel = () => {
    setMode("cancelled");
    setShowCancelConfirm(false);
  };

  const isLateArrival = arrivalTime >= "17:00";

  // ========== 認証画面 ==========
  if (mode === "auth") {
    return (
      <div className="min-h-screen bg-stone-50">
        <header className="bg-emerald-800 text-white py-6 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-emerald-200 text-xs tracking-widest mb-1">
              MANAGE RESERVATION
            </p>
            <h1 className="text-2xl font-bold">予約の確認・変更</h1>
            <p className="text-emerald-100 text-sm mt-1">
              21世紀の森 杉ヶ平キャンプ場
            </p>
          </div>
        </header>

        <div className="max-w-md mx-auto px-6 py-10">
          <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-6 text-sm text-amber-800">
            ⚠️ 試作版です。下記のデモ情報をお試しください。
            <div className="mt-2 font-mono text-xs bg-white p-2 rounded">
              予約番号：SUG-2026-001
              <br />
              メール：demo@example.com
              <br />
              （電話：090-1234-5678 でも可）
            </div>
          </div>

          <form
            onSubmit={handleAuth}
            className="bg-white rounded-lg shadow-sm p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                予約番号 <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={authNumber}
                onChange={(e) => setAuthNumber(e.target.value)}
                placeholder="SUG-2026-XXX"
                required
                className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                登録メールアドレス または 電話番号{" "}
                <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={authContact}
                onChange={(e) => setAuthContact(e.target.value)}
                required
                className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
              />
              <p className="text-xs text-stone-500 mt-1">
                ご予約時に登録されたメールアドレス、または電話番号を入力してください。
              </p>
            </div>

            {authError && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-700 text-white font-semibold py-3 rounded-full hover:bg-emerald-800 transition-colors"
            >
              予約を確認する
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ========== キャンセル完了画面 ==========
  if (mode === "cancelled") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-stone-50">
        <div className="max-w-xl w-full bg-white rounded-lg shadow p-10 text-center">
          <div className="text-stone-400 text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-4 text-stone-800">
            予約をキャンセルしました（試作版）
          </h1>
          <p className="text-stone-600 mb-6 leading-relaxed">
            予約番号 {DEMO_RESERVATION.reservationNumber} のご予約をキャンセルしました。
            <br />
            キャンセル料はかかりません。またのお越しをお待ちしています。
          </p>
          <p className="text-xs text-stone-500 mb-6">
            ※ 試作版のため、実際にはキャンセルされていません。
          </p>
          <a
            href="/"
            className="inline-block bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full hover:bg-emerald-800 transition-colors"
          >
            トップに戻る
          </a>
        </div>
      </div>
    );
  }

  // ========== 予約内容・編集画面 ==========
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-emerald-800 text-white py-6 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-emerald-200 text-xs tracking-widest mb-1">
            MANAGE RESERVATION
          </p>
          <h1 className="text-2xl font-bold">予約の確認・変更</h1>
          <p className="text-emerald-100 text-sm mt-1">
            予約番号：{DEMO_RESERVATION.reservationNumber}
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* 変更不可情報 */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-stone-800 mb-4 pb-3 border-b">
            ご予約内容
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">代表者</span>
              <span className="text-stone-800">{DEMO_RESERVATION.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">利用施設</span>
              <span className="text-stone-800 text-right">
                {DEMO_RESERVATION.facilityName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">期間</span>
              <span className="text-stone-800">
                {DEMO_RESERVATION.checkin} 〜 {DEMO_RESERVATION.checkout}
              </span>
            </div>
          </div>
          <div className="mt-4 bg-stone-50 rounded p-3 text-xs text-stone-600">
            💡 <strong>日程・施設の変更</strong>はこの画面ではできません。
            <br />
            一度キャンセルしてから新規予約を取り直してください（キャンセル料はかかりません）。
          </div>
        </section>

        {/* 編集可能セクション */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-stone-800 mb-4 pb-3 border-b">
            変更可能な項目
          </h2>

          <div className="space-y-6">
            {/* 人数 */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                ご利用人数
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-xs text-stone-500">大人</span>
                  <input
                    type="number"
                    min={0}
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-xs text-stone-500">小・中</span>
                  <input
                    type="number"
                    min={0}
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-xs text-stone-500">幼児（無料）</span>
                  <input
                    type="number"
                    min={0}
                    value={infants}
                    onChange={(e) => setInfants(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 到着時刻 */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                到着予定時刻
              </label>
              <input
                type="time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-48 border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
              />
              {isLateArrival && (
                <p className="text-xs text-amber-700 mt-2">
                  ⚠️ 17時以降は管理人不在です。受付は翌朝になります。
                </p>
              )}
            </div>

            {/* ペット情報（D棟など、ペット可施設の場合のみ） */}
            {DEMO_RESERVATION.petAllowed && (
              <div>
                <label className="flex items-center text-sm font-medium text-stone-700 mb-2">
                  <input
                    type="checkbox"
                    checked={hasPet}
                    onChange={(e) => setHasPet(e.target.checked)}
                    className="mr-2 accent-emerald-700"
                  />
                  ペット同伴
                </label>
                {hasPet && (
                  <input
                    type="text"
                    value={petInfo}
                    onChange={(e) => setPetInfo(e.target.value)}
                    placeholder="例：小型犬1匹"
                    className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
                  />
                )}
              </div>
            )}

            {/* 特記事項 */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                特記事項・ご要望
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-stone-300 rounded px-3 py-2 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-emerald-700 text-white font-semibold py-3 rounded-full hover:bg-emerald-800 transition-colors"
            >
              変更を保存
            </button>
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="flex-1 sm:flex-initial sm:px-8 border-2 border-red-600 text-red-600 font-semibold py-3 rounded-full hover:bg-red-50 transition-colors"
            >
              この予約をキャンセル
            </button>
          </div>

          {showSaved && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded p-3 text-sm text-emerald-800 text-center">
              ✓ 変更を保存しました（試作版のため実際には保存されていません）
            </div>
          )}
        </section>
      </div>

      {/* キャンセル確認モーダル */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-stone-800 mb-3">
              本当にキャンセルしますか？
            </h3>
            <p className="text-sm text-stone-600 mb-6">
              予約番号 {DEMO_RESERVATION.reservationNumber} のご予約をキャンセルします。
              <br />
              キャンセル料はかかりません。この操作は元に戻せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 border border-stone-300 text-stone-700 font-semibold py-2 rounded-full hover:bg-stone-50"
              >
                やめる
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-full hover:bg-red-700"
              >
                キャンセルする
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
