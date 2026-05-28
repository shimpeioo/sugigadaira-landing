export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-700 text-white px-6 py-20">
        <div className="max-w-3xl text-center">
          <p className="text-sm tracking-[0.3em] mb-4 text-emerald-200">
            TOYAMA · YATSUO · SHIRAKIMINE
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 tracking-tight">
            杉ヶ平キャンプ場
          </h1>
          <p className="text-lg sm:text-xl mb-10 text-emerald-50 leading-relaxed">
            標高636m、白木峰の山麓。
            <br />
            広葉樹の森に囲まれた、静かなキャンプ場。
          </p>
          <a
            href="/reserve"
            className="inline-block bg-white text-emerald-900 font-semibold px-8 py-4 rounded-full hover:bg-emerald-50 transition-colors"
          >
            予約する
          </a>
          <div className="mt-4">
            <a
              href="/reserve/manage"
              className="text-emerald-200 text-sm hover:text-white underline underline-offset-4"
            >
              予約の確認・変更はこちら
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-stone-800">
            森と過ごす、ひと夜。
          </h2>
          <p className="text-stone-700 leading-loose text-lg">
            富山市八尾町の山あい、標高636m。白木峰の山麓に広がる「21世紀の森」のなか、
            ブナ原生林に抱かれた静かなキャンプ場です。
          </p>
          <p className="text-stone-700 leading-loose text-lg mt-6">
            白木峰登山の拠点として、家族でののんびりキャンプとして、
            仲間とのバーベキューとして──
            <br />
            5月から10月まで、皆さまをお迎えしています。
          </p>
        </div>
      </section>

      {/* 森の魅力 */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-stone-800 text-center">
            森を歩く
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-emerald-50 rounded-lg p-8">
              <p className="text-emerald-700 text-sm font-semibold mb-2">
                4つの遊歩道
              </p>
              <h3 className="text-xl font-bold text-stone-800 mb-3">
                森の中を、自分のペースで。
              </h3>
              <ul className="text-stone-700 space-y-2 text-sm">
                <li>・ 初級者向け 45分コース</li>
                <li>・ 初級者向け 1時間コース</li>
                <li>・ 中級者向け 2時間コース</li>
                <li>・ 上級者向け 4時間コース</li>
              </ul>
            </div>
            <div className="bg-emerald-50 rounded-lg p-8">
              <p className="text-emerald-700 text-sm font-semibold mb-2">
                7つの森林ゾーン
              </p>
              <h3 className="text-xl font-bold text-stone-800 mb-3">
                季節ごとの表情に出会う。
              </h3>
              <ul className="text-stone-700 space-y-2 text-sm">
                <li>・ ブナ原生林（2箇所）</li>
                <li>・ 紅葉の森／山菜の森</li>
                <li>・ 木の実の森／野鳥の森</li>
                <li>・ きのこの森／冒険の森</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center text-stone-600 text-sm">
            白木峰登山口（八合目駐車場）まで車で約30分。日帰り登山の拠点としてもご利用いただけます。
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-stone-800 text-center">
            施設のご案内
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <a
              href="/reserve"
              className="group relative overflow-hidden rounded-lg aspect-[4/5] bg-cover bg-center shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300"
              style={{ backgroundImage: "url('/tent.jpg')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/90 transition-colors" />
              <div className="relative h-full flex flex-col justify-end p-8 text-white">
                <p className="text-emerald-200 font-semibold mb-2">
                  テントサイト
                </p>
                <p className="text-2xl font-bold mb-1">
                  広い森のフリーサイト
                </p>
                <p className="text-stone-200 text-sm mb-4">
                  区画割なし／好きな場所に張れます
                </p>
                <p className="text-stone-100 text-sm">
                  持込テントOK。テント貸出しもございます。ペット同伴も常識の範囲で歓迎。
                </p>
              </div>
            </a>
            <a
              href="/reserve"
              className="group relative overflow-hidden rounded-lg aspect-[4/5] bg-cover bg-center shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300"
              style={{ backgroundImage: "url('/cottage.jpg')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/90 transition-colors" />
              <div className="relative h-full flex flex-col justify-end p-8 text-white">
                <p className="text-emerald-200 font-semibold mb-2">コテージ</p>
                <p className="text-5xl font-bold mb-1">5</p>
                <p className="text-stone-200 text-sm mb-4">棟（4〜6人用）</p>
                <p className="text-stone-100 text-sm">
                  A棟ニッコウキスゲ／B棟コメツツジ／C棟シャクナゲ／<span className="text-emerald-200 font-semibold">D棟チングルマ（ペット可）</span>／E棟イワカガミ
                </p>
              </div>
            </a>
            <a
              href="/reserve"
              className="group relative overflow-hidden rounded-lg aspect-[4/5] bg-cover bg-center shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300"
              style={{ backgroundImage: "url('/bungalow.jpg')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/90 transition-colors" />
              <div className="relative h-full flex flex-col justify-end p-8 text-white">
                <p className="text-emerald-200 font-semibold mb-2">バンガロー</p>
                <p className="text-5xl font-bold mb-1">2</p>
                <p className="text-stone-200 text-sm mb-4">棟（1番・2番）</p>
                <p className="text-stone-100 text-sm">
                  シンプルな小屋掛け。手軽な一泊にぴったり。3,150円／棟。
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Pricing summary */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-stone-800 text-center">
            料金（1泊）
          </h2>
          <div className="space-y-3 text-stone-700">
            <div className="flex justify-between border-b border-stone-200 py-3">
              <span>キャンプ場使用料（小学生以上）</span>
              <span className="font-semibold">220円 / 人</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 py-3">
              <span>持込テント</span>
              <span className="font-semibold">660円 / 張</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 py-3">
              <span>テント貸出し</span>
              <span className="font-semibold">880円 / 張</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 py-3">
              <span>コテージ（6人用）</span>
              <span className="font-semibold">13,200円 / 棟</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 py-3">
              <span>コテージ（4人用）</span>
              <span className="font-semibold">8,800円 / 棟</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 py-3">
              <span>コテージ追加料金</span>
              <span className="font-semibold">1,100円 / 人</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 py-3">
              <span>バンガロー</span>
              <span className="font-semibold">3,150円 / 棟</span>
            </div>
          </div>
          <p className="text-stone-500 text-sm mt-6">
            ※ 幼児は無料。日帰り利用は半額。2泊目以降も半額。
          </p>
        </div>
      </section>

      {/* アクセス */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-stone-800 text-center">
            アクセス
          </h2>
          <div className="bg-stone-50 rounded-lg p-8 space-y-4 text-stone-700">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
              <span className="text-stone-500 font-semibold sm:w-32 shrink-0">所在地</span>
              <span>富山県富山市八尾町杉平16-8（21世紀の森内）</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
              <span className="text-stone-500 font-semibold sm:w-32 shrink-0">お車で</span>
              <span>
                北陸自動車道 富山西ICから約60分
                <br />
                富山市中心部から約75分
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
              <span className="text-stone-500 font-semibold sm:w-32 shrink-0">駐車場</span>
              <span>無料・台数制限なし（場内複数箇所）</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
              <span className="text-stone-500 font-semibold sm:w-32 shrink-0">営業期間</span>
              <span>
                毎年 5月1日〜10月31日
                <br />
                <span className="text-stone-500 text-sm">定休日：毎週木曜日</span>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
              <span className="text-stone-500 font-semibold sm:w-32 shrink-0">近隣</span>
              <span>
                白木峰登山口（八合目駐車場）まで車で約30分
                <br />
                <span className="text-stone-500 text-sm">飛騨市方面へも抜けられます</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="reserve"
        className="py-20 px-6 bg-emerald-800 text-white text-center"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">ご予約・お問い合わせ</h2>
          <p className="mb-8 text-emerald-100 leading-relaxed">
            オンラインで24時間いつでもご予約いただけます。
          </p>
          <a
            href="/reserve"
            className="inline-block bg-white text-emerald-900 font-bold px-10 py-4 rounded-full hover:bg-emerald-50 transition-colors text-lg"
          >
            オンラインで予約する
          </a>
          <p className="text-emerald-100 text-sm mt-10 mb-2">
            お電話でのお問い合わせ
          </p>
          <a
            href="tel:09064786054"
            className="inline-block text-white text-xl font-semibold border-b border-emerald-300 hover:border-white transition-colors"
          >
            090-6478-6054
          </a>
          <p className="text-emerald-200 text-sm mt-2">受付 9:00〜17:00</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-10 px-6">
        <div className="max-w-3xl mx-auto text-center text-sm space-y-2">
          <p className="font-semibold text-white">21世紀の森 杉ヶ平キャンプ場</p>
          <p>〒939-2516 富山県富山市八尾町杉平16-8</p>
          <p>営業期間：5月1日〜10月31日 / 定休日：毎週木曜</p>
          <p className="text-stone-500 mt-4">
            指定管理：特定非営利活動法人 大長谷村づくり協議会
          </p>
        </div>
      </footer>
    </div>
  );
}
