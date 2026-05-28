import { getCustomers } from "@/lib/demoData";

export default function CustomersPage() {
  const customers = getCustomers();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-stone-800">顧客一覧</h1>
        <p className="text-sm text-stone-500 mt-1">
          全 {customers.length}名 ／ リピーター（2回以上）{" "}
          {customers.filter((c) => c.totalReservations >= 2).length}名
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-100">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-stone-700">
                  氏名
                </th>
                <th className="px-3 py-2 text-left font-semibold text-stone-700">
                  連絡先
                </th>
                <th className="px-3 py-2 text-right font-semibold text-stone-700">
                  利用回数
                </th>
                <th className="px-3 py-2 text-left font-semibold text-stone-700">
                  最終利用
                </th>
                <th className="px-3 py-2 text-right font-semibold text-stone-700">
                  累計利用額
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {customers.map((c) => (
                <tr key={c.phone} className="hover:bg-stone-50">
                  <td className="px-3 py-3 text-stone-800">
                    <div className="flex items-center gap-2">
                      <span>{c.name}</span>
                      {c.totalReservations >= 3 && (
                        <span
                          className="text-amber-500 text-sm"
                          title="3回以上のリピーター"
                        >
                          ★
                        </span>
                      )}
                      {c.totalReservations === 2 && (
                        <span className="text-stone-400 text-xs" title="2回利用">
                          ☆
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-stone-700">
                    <p>{c.phone}</p>
                    {c.email && (
                      <p className="text-xs text-stone-500">{c.email}</p>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right text-stone-700 font-semibold">
                    {c.totalReservations}回
                  </td>
                  <td className="px-3 py-3 text-stone-700 whitespace-nowrap">
                    {c.lastVisit}
                  </td>
                  <td className="px-3 py-3 text-right text-stone-800 font-semibold whitespace-nowrap">
                    ¥{c.totalSpent.toLocaleString()}
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-10 text-center text-stone-500"
                  >
                    顧客データがありません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-xs text-stone-500">
        ※ ★：3回以上のリピーター ／ ☆：2回利用
      </div>
    </div>
  );
}
