"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  TASK_CATEGORY_COLOR,
  TASK_CATEGORY_LABEL,
  TODAY,
  generateTasksForDate,
  type Task,
  type TaskCategory,
} from "@/lib/demoData";

const CATEGORIES: TaskCategory[] = [
  "cleaning",
  "inspection",
  "supplies",
  "collection",
  "communication",
  "other",
];

function shiftDays(date: string, delta: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

function dayLabel(date: string): string {
  const d = new Date(date);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return days[d.getDay()];
}

export default function TasksPage() {
  const [date, setDate] = useState(TODAY);
  const [filter, setFilter] = useState<TaskCategory | "all">("all");

  const tasks = useMemo(() => generateTasksForDate(date), [date]);
  const [doneOverrides, setDoneOverrides] = useState<Record<string, boolean>>({});

  const visibleTasks: Task[] = useMemo(() => {
    return tasks
      .map((t) => ({ ...t, done: doneOverrides[t.id] ?? t.done }))
      .filter((t) => filter === "all" || t.category === filter);
  }, [tasks, filter, doneOverrides]);

  function toggle(id: string) {
    setDoneOverrides((prev) => ({
      ...prev,
      [id]: !(prev[id] ?? tasks.find((t) => t.id === id)?.done ?? false),
    }));
  }

  const open = visibleTasks.filter((t) => !t.done).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-bold text-stone-800">段取り（業務リスト）</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/tasks/history"
            className="text-sm border border-stone-300 text-stone-700 px-3 py-1.5 rounded hover:bg-stone-50"
          >
            過去ログ
          </Link>
          <Link
            href="/admin/tasks/settings"
            className="text-sm bg-stone-800 text-white px-3 py-1.5 rounded hover:bg-stone-700"
          >
            ⚙ テンプレート設定
          </Link>
        </div>
      </div>

      {/* 日付ナビ */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDate(shiftDays(date, -1))}
              className="px-3 py-1.5 text-sm rounded border border-stone-300 hover:bg-stone-50"
            >
              ← 前日
            </button>
            <button
              onClick={() => setDate(TODAY)}
              className="px-3 py-1.5 text-sm rounded border border-stone-300 hover:bg-stone-50"
            >
              今日
            </button>
            <button
              onClick={() => setDate(shiftDays(date, 1))}
              className="px-3 py-1.5 text-sm rounded border border-stone-300 hover:bg-stone-50"
            >
              翌日 →
            </button>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-stone-800">
              {date}（{dayLabel(date)}）
            </span>
            <span className="ml-3 text-stone-500">
              未完了 <span className="font-bold text-emerald-700">{open}</span> /{" "}
              {visibleTasks.length}
            </span>
          </div>
        </div>

        {/* カテゴリフィルタ */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <FilterChip
            label="すべて"
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c}
              label={TASK_CATEGORY_LABEL[c]}
              active={filter === c}
              onClick={() => setFilter(c)}
              color={TASK_CATEGORY_COLOR[c]}
            />
          ))}
        </div>
      </div>

      {/* タスク一覧 */}
      <div className="bg-white rounded-lg shadow-sm">
        {visibleTasks.length === 0 ? (
          <p className="p-6 text-stone-500 text-sm text-center">
            この日の段取りはありません。
          </p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {visibleTasks.map((t) => (
              <li key={t.id} className="p-4 flex items-start gap-3">
                <input
                  id={`tk-${t.id}`}
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggle(t.id)}
                  className="mt-1 w-4 h-4 accent-emerald-700 cursor-pointer flex-shrink-0"
                />
                <label htmlFor={`tk-${t.id}`} className="flex-1 min-w-0 cursor-pointer">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded border ${TASK_CATEGORY_COLOR[t.category]}`}
                    >
                      {TASK_CATEGORY_LABEL[t.category]}
                    </span>
                    <span
                      className={`text-sm ${t.done ? "line-through text-stone-400" : "text-stone-800 font-medium"}`}
                    >
                      {t.name}
                    </span>
                    {t.templateId === undefined && (
                      <span className="text-xs text-stone-400">（手動）</span>
                    )}
                  </div>
                  {t.reservationLabel && (
                    <p
                      className={`text-xs mt-0.5 ${t.done ? "text-stone-400" : "text-stone-500"}`}
                    >
                      🔗 {t.reservationLabel}
                    </p>
                  )}
                  {t.notes && (
                    <p
                      className={`text-xs mt-0.5 ${t.done ? "text-stone-400" : "text-stone-600"}`}
                    >
                      {t.notes}
                    </p>
                  )}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-stone-400 mt-4">
        ※ 試作版：チェック状態はリロードで戻ります。手動タスクの追加UIは仕様書 §5.6.6
        に基づき後日実装。
      </p>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  if (active) {
    return (
      <button
        onClick={onClick}
        className="text-xs px-2.5 py-1 rounded bg-stone-800 text-white"
      >
        {label}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded border ${color ?? "bg-white text-stone-600 border-stone-200"} hover:opacity-80`}
    >
      {label}
    </button>
  );
}
