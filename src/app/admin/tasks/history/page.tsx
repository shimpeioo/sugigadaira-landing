"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  TASK_CATEGORY_COLOR,
  TASK_CATEGORY_LABEL,
  TODAY,
  generateTaskLogsBetween,
  type TaskCategory,
  type TaskLog,
  type TaskLogStatus,
} from "@/lib/demoData";

const CATEGORIES: TaskCategory[] = [
  "cleaning",
  "inspection",
  "supplies",
  "collection",
  "communication",
  "other",
];

const STATUS_LABEL: Record<TaskLogStatus, string> = {
  done: "完了",
  open: "未完了",
  skipped: "見送り",
};

const STATUS_STYLE: Record<TaskLogStatus, string> = {
  done: "bg-emerald-100 text-emerald-800 border-emerald-200",
  open: "bg-rose-100 text-rose-800 border-rose-200",
  skipped: "bg-amber-100 text-amber-800 border-amber-200",
};

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

function groupByDate(logs: TaskLog[]): Array<[string, TaskLog[]]> {
  const map = new Map<string, TaskLog[]>();
  for (const log of logs) {
    const list = map.get(log.date) ?? [];
    list.push(log);
    map.set(log.date, list);
  }
  return Array.from(map.entries()).sort(([a], [b]) => (a < b ? 1 : -1));
}

export default function TaskHistoryPage() {
  const [from, setFrom] = useState(shiftDays(TODAY, -7));
  const [to, setTo] = useState(TODAY);
  const [status, setStatus] = useState<TaskLogStatus | "all">("all");
  const [category, setCategory] = useState<TaskCategory | "all">("all");

  const logs = useMemo(() => {
    const rangeFrom = from <= to ? from : to;
    const rangeTo = from <= to ? to : from;
    return generateTaskLogsBetween(rangeFrom, rangeTo).filter((log) => {
      const statusMatch = status === "all" || log.status === status;
      const categoryMatch = category === "all" || log.category === category;
      return statusMatch && categoryMatch;
    });
  }, [from, to, status, category]);

  const summary = useMemo(
    () => ({
      done: logs.filter((log) => log.status === "done").length,
      open: logs.filter((log) => log.status === "open").length,
      skipped: logs.filter((log) => log.status === "skipped").length,
      total: logs.length,
    }),
    [logs],
  );

  const groupedLogs = useMemo(() => groupByDate(logs), [logs]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <Link href="/admin/tasks" className="text-sm text-stone-500 hover:underline">
            段取り一覧へ戻る
          </Link>
          <h1 className="text-xl font-bold text-stone-800 mt-1">
            段取りの過去ログ
          </h1>
        </div>
        <Link
          href="/admin/tasks/settings"
          className="text-sm bg-stone-800 text-white px-3 py-1.5 rounded hover:bg-stone-700"
        >
          テンプレート設定
        </Link>
      </div>

      <section className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="text-sm text-stone-700">
            開始日
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm text-stone-700">
            終了日
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </label>
          <button
            onClick={() => {
              setFrom(shiftDays(TODAY, -7));
              setTo(TODAY);
              setStatus("all");
              setCategory("all");
            }}
            className="rounded border border-stone-300 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
          >
            直近7日に戻す
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          <FilterChip label="すべて" active={status === "all"} onClick={() => setStatus("all")} />
          {(["done", "open", "skipped"] as TaskLogStatus[]).map((s) => (
            <FilterChip
              key={s}
              label={STATUS_LABEL[s]}
              active={status === s}
              onClick={() => setStatus(s)}
              color={STATUS_STYLE[s]}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
          <FilterChip
            label="全カテゴリ"
            active={category === "all"}
            onClick={() => setCategory("all")}
          />
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c}
              label={TASK_CATEGORY_LABEL[c]}
              active={category === c}
              onClick={() => setCategory(c)}
              color={TASK_CATEGORY_COLOR[c]}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2 mb-4 md:grid-cols-4">
        <SummaryCard label="総件数" value={summary.total} />
        <SummaryCard label="完了" value={summary.done} tone="text-emerald-700" />
        <SummaryCard label="未完了" value={summary.open} tone="text-rose-700" />
        <SummaryCard label="見送り" value={summary.skipped} tone="text-amber-700" />
      </section>

      {groupedLogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center text-sm text-stone-500">
          条件に合う段取りログはありません。
        </div>
      ) : (
        <div className="space-y-4">
          {groupedLogs.map(([date, dayLogs]) => (
            <section key={date} className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-stone-100 px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
                <h2 className="font-bold text-stone-800">
                  {date}（{dayLabel(date)}）
                </h2>
                <p className="text-xs text-stone-500">
                  完了 {dayLogs.filter((log) => log.status === "done").length} /{" "}
                  {dayLogs.length}
                </p>
              </div>
              <ul className="divide-y divide-stone-100">
                {dayLogs.map((log) => (
                  <li key={log.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded border ${STATUS_STYLE[log.status]}`}
                          >
                            {STATUS_LABEL[log.status]}
                          </span>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded border ${TASK_CATEGORY_COLOR[log.category]}`}
                          >
                            {TASK_CATEGORY_LABEL[log.category]}
                          </span>
                          <span className="text-sm font-medium text-stone-800">
                            {log.name}
                          </span>
                          {log.source === "manual" && (
                            <span className="text-xs text-stone-400">手動</span>
                          )}
                        </div>
                        {log.reservationLabel && (
                          <p className="text-xs text-stone-500 mt-1">
                            予約連動：{log.reservationLabel}
                          </p>
                        )}
                        {log.notes && (
                          <p className="text-xs text-stone-600 mt-1">{log.notes}</p>
                        )}
                        {log.logNote && (
                          <p className="text-xs text-stone-700 mt-2 bg-stone-50 rounded px-2 py-1">
                            記録メモ：{log.logNote}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-xs text-stone-500 whitespace-nowrap">
                        {log.completedAt && <p>{log.completedAt}</p>}
                        {log.completedBy && <p>{log.completedBy}</p>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <p className="text-xs text-stone-400 mt-4">
        ※ 試作版：ログはデモデータです。本実装では完了操作・見送り操作・担当者・メモをDBに保存します。
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

function SummaryCard({
  label,
  value,
  tone = "text-stone-800",
}: {
  label: string;
  value: number;
  tone?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <p className="text-xs text-stone-500">{label}</p>
      <p className={`text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}
