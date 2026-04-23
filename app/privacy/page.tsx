import { SiteHeader } from "@/components/SiteHeader";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "隱私政策 · 剪筆 JianBi",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12 prose prose-zinc dark:prose-invert">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 mb-6 no-underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            返回
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold tracking-chinese">隱私政策</h1>
          <p className="text-sm text-zinc-500 mt-1">最後更新：2026-04-23</p>

          <div className="space-y-5 mt-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            <section>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                1. 我們收集什麼？
              </h2>
              <p>
                剪筆（JianBi）v0.1 MVP 階段**不建立帳號、不建立資料庫、不記錄使用者身分**。
                你在剪筆所有的設定（API Key、模型選擇、歷史紀錄最近 10 筆）都儲存在你這台裝置的瀏覽器 localStorage 裡。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                2. API Key 如何處理？
              </h2>
              <p>
                你的 Anthropic / OpenAI API Key 儲存在你的瀏覽器 localStorage。
                當你按「一鍵剪筆」時，Key 會透過 HTTPS 傳送到我們伺服器，
                我們**立即**用這個 Key 去呼叫對應的 AI Provider，
                呼叫完成後 Key 不寫入任何日誌或資料庫，立即從記憶體釋放。
              </p>
              <p className="mt-2">
                如果你不信任，可以隨時到 Anthropic / OpenAI console 查看你 Key 的使用量與撤銷 Key。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                3. 你的內容如何處理？
              </h2>
              <p>
                你貼的網址與內容會經過我們伺服器做內容擷取（YouTube 字幕、網頁主文），
                並作為 prompt 送給你指定的 AI Provider。
                這些資料**不寫入資料庫、不寫入永久日誌**。
                但你指定的 AI Provider（Anthropic / OpenAI）有自己的資料處理政策，
                請參考它們的官方文件。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                4. 使用量分析
              </h2>
              <p>
                我們可能使用 Plausible 等隱私友好的分析工具，紀錄匿名的頁面瀏覽量與點擊次數，
                不收集可識別個人的資料、不使用 cookie。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                5. 來源合法性
              </h2>
              <p>
                剪筆的設計定位是協助創作者處理自己擁有或有權引用的內容。
                使用者必須自行確保所擷取的 YouTube 影片或網頁內容符合來源平台的使用條款，
                以及你所在司法管轄區的著作權法規。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                6. 聯絡
              </h2>
              <p>
                有任何隱私或資料相關問題，請開 GitHub Issue 或來信。
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
