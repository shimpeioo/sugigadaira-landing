"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* デモ用バナー（公開URL アクセスへの配慮） */}
      <div className="bg-amber-100 border-b border-amber-300 text-amber-900 text-xs px-4 py-2 text-center">
        <strong>※ これはデモ画面です。</strong>
        本番では認証（ID・パスワード）が必要になります。表示されているデータはすべてダミーです。
      </div>

      <header className="bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-stone-400 text-xs tracking-widest">
                ADMIN DASHBOARD
              </p>
              <h1 className="text-lg font-bold">杉ヶ平キャンプ場 管理画面</h1>
            </div>
            <span className="text-xs bg-amber-700 text-amber-100 px-2 py-1 rounded">
              試作版
            </span>
          </div>
        </div>
        <nav className="border-t border-stone-700">
          <div className="max-w-6xl mx-auto px-4">
            <ul className="flex overflow-x-auto text-sm">
              <NavLink href="/admin" label="ホーム" />
              <NavLink href="/admin/today" label="今日の受付" />
              <NavLink href="/admin/tasks" label="段取り" />
              <NavLink href="/admin/reservations" label="予約一覧" />
              <NavLink href="/admin/customers" label="顧客一覧" />
            </ul>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  // 完全一致 or 階層下のページもアクティブ扱い（ただし /admin は厳密に）
  const isActive =
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <li>
      <Link
        href={href}
        className={`block px-4 py-3 whitespace-nowrap transition-colors ${
          isActive
            ? "bg-emerald-700 text-white border-b-2 border-emerald-300"
            : "hover:bg-stone-800 border-b-2 border-transparent"
        }`}
      >
        {label}
      </Link>
    </li>
  );
}
