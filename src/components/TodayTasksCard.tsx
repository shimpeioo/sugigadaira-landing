"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  TASK_CATEGORY_COLOR,
  TASK_CATEGORY_LABEL,
  type Task,
  type TaskCategory,
} from "@/lib/demoData";

export default function TodayTasksCard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const { open, total } = useMemo(
    () => ({
      open: tasks.filter((t) => !t.done).length,
      total: tasks.length,
    }),
    [tasks],
  );

  const byCategory = useMemo(() => {
    const map = new Map<TaskCategory, { open: number; total: number }>();
    for (const t of tasks) {
      const v = map.get(t.category) ?? { open: 0, total: 0 };
      v.total += 1;
      if (!t.done) v.open += 1;
      map.set(t.category, v);
    }
    return map;
  }, [tasks]);

  function toggle(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-baseline gap-2">
          <h2 className="font-bold text-stone-800">今日の段取り</h2>
          <span className="text-sm text-stone-500">
            未完了 <span className="font-bold text-emerald-700">{open}</span> / {total}
          </span>
        </div>
        <Link
          href="/admin/tasks"
          className="text-emerald-700 text-sm hover:underline"
        >
          一覧・設定 →
        </Link>
      </div>

      {/* カテゴリ別の小計 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Array.from(byCategory.entries()).map(([cat, v]) => (
          <span
            key={cat}
            className={`text-xs px-2 py-0.5 rounded border ${TASK_CATEGORY_COLOR[cat]}`}
          >
            {TASK_CATEGORY_LABEL[cat]} {v.open}/{v.total}
          </span>
        ))}
      </div>

      {tasks.length === 0 ? (
        <p className="text-stone-500 text-sm">本日の段取りはありません。</p>
      ) : (
        <ul className="divide-y divide-stone-100">
          {tasks.map((t) => (
            <li key={t.id} className="py-2.5 flex items-start gap-3">
              <input
                id={`task-${t.id}`}
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
                className="mt-1 w-4 h-4 accent-emerald-700 cursor-pointer flex-shrink-0"
              />
              <label
                htmlFor={`task-${t.id}`}
                className="flex-1 min-w-0 cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded border ${TASK_CATEGORY_COLOR[t.category]}`}
                  >
                    {TASK_CATEGORY_LABEL[t.category]}
                  </span>
                  <span
                    className={`text-sm ${t.done ? "line-through text-stone-400" : "text-stone-800"}`}
                  >
                    {t.name}
                  </span>
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
    </section>
  );
}
