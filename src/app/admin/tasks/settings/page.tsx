"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MONTHLY_WEEK_LABEL,
  RESERVATION_TRIGGER_LABEL,
  TASK_CATEGORY_COLOR,
  TASK_CATEGORY_LABEL,
  TASK_FREQUENCY_LABEL,
  TASK_TEMPLATES,
  WEEKDAY_LABEL,
  type TaskFrequency,
  type TaskTemplate,
} from "@/lib/demoData";

const FREQ_OPTIONS: TaskFrequency[] = [
  "daily",
  "every2days",
  "every3days",
  "weekdays",
  "monthly",
  "disabled",
];

const MONTHLY_WEEKS = [1, 2, 3, 4, 5] as const;

export default function TaskSettingsPage() {
  const [tab, setTab] = useState<"reservation" | "periodic">("reservation");
  const [templates, setTemplates] = useState<TaskTemplate[]>(TASK_TEMPLATES);

  const reservationTpls = templates.filter((t) => t.rule.type === "reservationLinked");
  const periodicTpls = templates.filter((t) => t.rule.type === "periodic");

  function toggleEnabled(id: string) {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
    );
  }

  function changeFrequency(id: string, freq: TaskFrequency) {
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id !== id || t.rule.type !== "periodic") return t;
        const current = t.rule;
        // 切替時のデフォルト値を整える
        let nextWeekdays = current.weekdays;
        let nextMonthlyWeek = current.monthlyWeek;
        if (freq === "weekdays") {
          if (!nextWeekdays || nextWeekdays.length === 0) nextWeekdays = [1];
        }
        if (freq === "monthly") {
          // monthlyは曜日1つだけ
          if (!nextWeekdays || nextWeekdays.length === 0) nextWeekdays = [5]; // 金
          else nextWeekdays = [nextWeekdays[0]];
          if (!nextMonthlyWeek) nextMonthlyWeek = 2;
        }
        return {
          ...t,
          rule: {
            ...current,
            frequency: freq,
            weekdays: nextWeekdays,
            monthlyWeek: nextMonthlyWeek,
          },
        };
      }),
    );
  }

  function toggleWeekday(id: string, weekday: number) {
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id !== id || t.rule.type !== "periodic") return t;
        const current = t.rule.weekdays ?? [];
        // monthly は単一選択（クリックされた曜日に置き換え）
        if (t.rule.frequency === "monthly") {
          return { ...t, rule: { ...t.rule, weekdays: [weekday] } };
        }
        // weekdays は複数選択（トグル）
        const next = current.includes(weekday)
          ? current.filter((d) => d !== weekday)
          : [...current, weekday].sort((a, b) => a - b);
        return { ...t, rule: { ...t.rule, weekdays: next } };
      }),
    );
  }

  function changeMonthlyWeek(id: string, week: number) {
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id !== id || t.rule.type !== "periodic") return t;
        return { ...t, rule: { ...t.rule, monthlyWeek: week } };
      }),
    );
  }

  function removeTemplate(id: string, name: string) {
    if (!confirm(`「${name}」テンプレートを削除しますか？\n（過去の段取り記録は残りますが、今後の自動生成は止まります）`)) return;
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Link
          href="/admin/tasks"
          className="text-sm text-stone-600 hover:text-stone-800"
        >
          ← 段取り一覧へ戻る
        </Link>
      </div>
      <h1 className="text-xl font-bold text-stone-800 mb-2">
        段取りテンプレート設定
      </h1>
      <p className="text-sm text-stone-600 mb-4">
        運用しながら自由に追加・編集できます（仕様書 v0.2 §5.6.4）。
      </p>

      {/* タブ */}
      <div className="flex gap-1 mb-4 border-b border-stone-200">
        <TabButton
          active={tab === "reservation"}
          label={`予約連動（${reservationTpls.length}）`}
          onClick={() => setTab("reservation")}
        />
        <TabButton
          active={tab === "periodic"}
          label={`定期（${periodicTpls.length}）`}
          onClick={() => setTab("periodic")}
        />
      </div>

      {tab === "reservation" && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-stone-100">
            <p className="text-xs text-stone-500">
              予約データから自動生成されるタスク。トリガーは「前日／当日朝／退室日」から選択。
            </p>
          </div>
          <ul className="divide-y divide-stone-100">
            {reservationTpls.map((t) => (
              <li key={t.id} className="p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={t.enabled}
                    onChange={() => toggleEnabled(t.id)}
                    className="mt-1 w-4 h-4 accent-emerald-700 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded border ${TASK_CATEGORY_COLOR[t.category]}`}
                      >
                        {TASK_CATEGORY_LABEL[t.category]}
                      </span>
                      <span
                        className={`text-sm font-medium ${t.enabled ? "text-stone-800" : "text-stone-400"}`}
                      >
                        {t.name}
                      </span>
                    </div>
                    {t.rule.type === "reservationLinked" && (
                      <div className="text-xs text-stone-500 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                        <span>
                          🕒 {RESERVATION_TRIGGER_LABEL[t.rule.trigger]}
                        </span>
                        <span>
                          🏠 対象：
                          {t.rule.facilityKeywords.length === 0
                            ? "全施設"
                            : t.rule.facilityKeywords.join("／")}
                        </span>
                      </div>
                    )}
                    {t.notes && (
                      <p className="text-xs text-stone-500 mt-1">{t.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeTemplate(t.id, t.name)}
                    aria-label={`${t.name} を削除`}
                    title="このテンプレートを削除"
                    className="text-stone-400 hover:text-red-600 hover:bg-red-50 rounded p-1.5 flex-shrink-0 transition"
                  >
                    🗑
                  </button>
                </div>
              </li>
            ))}
            {reservationTpls.length === 0 && (
              <li className="p-6 text-center text-sm text-stone-500">
                予約連動テンプレートはありません。
              </li>
            )}
          </ul>
          <div className="p-4 border-t border-stone-100 text-center">
            <button className="text-sm text-stone-500 border border-dashed border-stone-300 rounded px-4 py-2 hover:bg-stone-50">
              ＋ 予約連動テンプレートを追加（試作版では未実装）
            </button>
          </div>
        </div>
      )}

      {tab === "periodic" && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-stone-100">
            <p className="text-xs text-stone-500">
              一定の頻度で繰り返すタスク。シーズンに合わせて頻度を切り替えてください。
            </p>
          </div>
          <ul className="divide-y divide-stone-100">
            {periodicTpls.map((t) => (
              <li key={t.id} className="p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={t.enabled}
                    onChange={() => toggleEnabled(t.id)}
                    className="mt-1 w-4 h-4 accent-emerald-700 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded border ${TASK_CATEGORY_COLOR[t.category]}`}
                      >
                        {TASK_CATEGORY_LABEL[t.category]}
                      </span>
                      <span
                        className={`text-sm font-medium ${t.enabled ? "text-stone-800" : "text-stone-400"}`}
                      >
                        {t.name}
                      </span>
                    </div>
                    {t.rule.type === "periodic" && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="text-xs text-stone-500">頻度：</label>
                          <select
                            value={t.rule.frequency}
                            onChange={(e) =>
                              changeFrequency(t.id, e.target.value as TaskFrequency)
                            }
                            disabled={!t.enabled}
                            className="text-sm border border-stone-300 rounded px-2 py-1 bg-white disabled:bg-stone-50 disabled:text-stone-400"
                          >
                            {FREQ_OPTIONS.map((f) => (
                              <option key={f} value={f}>
                                {TASK_FREQUENCY_LABEL[f]}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* 曜日指定の場合のみ、曜日選択UIを表示 */}
                        {t.rule.frequency === "weekdays" && (
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-stone-500">曜日：</span>
                            <div className="flex gap-1">
                              {WEEKDAY_LABEL.map((label, idx) => {
                                const selected = t.rule.type === "periodic" && (t.rule.weekdays ?? []).includes(idx);
                                const isWeekend = idx === 0 || idx === 6;
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    disabled={!t.enabled}
                                    onClick={() => toggleWeekday(t.id, idx)}
                                    className={`w-8 h-8 text-xs rounded border transition ${
                                      selected
                                        ? "bg-emerald-700 text-white border-emerald-700"
                                        : `bg-white border-stone-300 hover:bg-stone-50 ${
                                            isWeekend ? "text-stone-500" : "text-stone-700"
                                          }`
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                  >
                                    {label}
                                  </button>
                                );
                              })}
                            </div>
                            <span className="text-xs text-emerald-700 font-medium">
                              {weekdaysCountLabel(t.rule.weekdays ?? [])}
                            </span>
                          </div>
                        )}

                        {/* 月1回の場合：第N週 + 単一曜日 */}
                        {t.rule.frequency === "monthly" && (
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-stone-500">毎月：</span>
                            <select
                              value={t.rule.monthlyWeek ?? 2}
                              onChange={(e) =>
                                changeMonthlyWeek(t.id, Number(e.target.value))
                              }
                              disabled={!t.enabled}
                              className="text-sm border border-stone-300 rounded px-2 py-1 bg-white disabled:bg-stone-50 disabled:text-stone-400"
                            >
                              {MONTHLY_WEEKS.map((w) => (
                                <option key={w} value={w}>
                                  {MONTHLY_WEEK_LABEL[w]}
                                </option>
                              ))}
                            </select>
                            <span className="text-xs text-stone-500">の</span>
                            <div className="flex gap-1">
                              {WEEKDAY_LABEL.map((label, idx) => {
                                const selected =
                                  t.rule.type === "periodic" &&
                                  (t.rule.weekdays ?? [])[0] === idx;
                                const isWeekend = idx === 0 || idx === 6;
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    disabled={!t.enabled}
                                    onClick={() => toggleWeekday(t.id, idx)}
                                    className={`w-8 h-8 text-xs rounded border transition ${
                                      selected
                                        ? "bg-emerald-700 text-white border-emerald-700"
                                        : `bg-white border-stone-300 hover:bg-stone-50 ${
                                            isWeekend ? "text-stone-500" : "text-stone-700"
                                          }`
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                  >
                                    {label}
                                  </button>
                                );
                              })}
                            </div>
                            <span className="text-xs text-emerald-700 font-medium">
                              {monthlyLabel(t.rule.monthlyWeek, t.rule.weekdays)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    {t.notes && (
                      <p className="text-xs text-stone-500 mt-1">{t.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeTemplate(t.id, t.name)}
                    aria-label={`${t.name} を削除`}
                    title="このテンプレートを削除"
                    className="text-stone-400 hover:text-red-600 hover:bg-red-50 rounded p-1.5 flex-shrink-0 transition"
                  >
                    🗑
                  </button>
                </div>
              </li>
            ))}
            {periodicTpls.length === 0 && (
              <li className="p-6 text-center text-sm text-stone-500">
                定期テンプレートはありません。
              </li>
            )}
          </ul>
          <div className="p-4 border-t border-stone-100 text-center">
            <button className="text-sm text-stone-500 border border-dashed border-stone-300 rounded px-4 py-2 hover:bg-stone-50">
              ＋ 定期テンプレートを追加（試作版では未実装）
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-stone-400 mt-4">
        ※ 試作版：変更内容はリロードで戻ります。本実装ではDBに保存されます。
      </p>
    </div>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
        active
          ? "border-emerald-700 text-emerald-700"
          : "border-transparent text-stone-500 hover:text-stone-800"
      }`}
    >
      {label}
    </button>
  );
}

function weekdaysCountLabel(days: number[]): string {
  if (days.length === 0) return "⚠ 曜日を1つ以上選んでください";
  const names = ["日", "月", "火", "水", "木", "金", "土"];
  const sorted = [...days].sort((a, b) => a - b);
  const labels = sorted.map((d) => names[d]).join("・");
  return `週${days.length}回（${labels}曜）`;
}

function monthlyLabel(week: number | undefined, days: number[] | undefined): string {
  if (!week || !days || days.length === 0) return "⚠ 第N週と曜日を選んでください";
  const names = ["日", "月", "火", "水", "木", "金", "土"];
  return `毎月 第${week}${names[days[0]]}曜`;
}
