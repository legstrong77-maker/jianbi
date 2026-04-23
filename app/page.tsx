import { SiteHeader } from "@/components/SiteHeader";
import { ComposerPanel } from "@/components/ComposerPanel";
import Link from "next/link";
import { Scissors, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                <Scissors className="h-3 w-3" />
                <span>繁中創作者專用 · v0.1</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-chinese leading-tight">
                把長內容，
                <br className="md:hidden" />
                剪成<span className="text-emerald-600">台灣人看得順</span>的貼文。
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                貼 YouTube、文章連結，或直接貼逐字稿，一鍵產生 Threads、X、LINE、IG 四平台的
                <strong>繁體中文</strong>貼文草稿。Prompt 內建台灣語感與平台格式規則，不寫「視頻、質量」那套。
              </p>
              <div className="flex flex-wrap gap-4 text-sm pt-2">
                <Feature icon={<Zap className="h-4 w-4" />} text="免費可用（Gemini）" />
                <Feature icon={<ShieldCheck className="h-4 w-4" />} text="BYOK · Key 不落地" />
                <Feature icon={<Scissors className="h-4 w-4" />} text="台灣繁中語感" />
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 pt-1">
                📺 沒字幕的 YouTube 也能剪——用 Gemini 直接看影片。
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <ComposerPanel />
        </section>

        <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14 grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-2">為什麼叫「剪筆」？</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                你已經寫好一筆長內容，差的只是把它剪成各個平台的樣子。
                剪筆就是這把剪刀：保留你的想法，換上平台的衣服。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">為什麼台灣繁中重要？</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                英文工具把中文當成翻譯任務，吐出一堆「視頻、質量、信息」。
                剪筆的 prompt 明確禁止這些用法，要求輸出像台灣人寫的。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">可以完全免費用嗎？</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                可以。Google Gemini 提供免費 API Key（
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-emerald-700 dark:text-emerald-400"
                >
                  AI Studio
                </a>
                ，不需信用卡）。Key 只存在你瀏覽器，我們伺服器不儲存。
                Claude 與 OpenAI 需付費，但中文品質更好。
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-zinc-200 dark:border-zinc-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-zinc-500">
            <div>
              剪筆 JianBi · 台灣繁中內容再製 · v0.1 MVP
            </div>
            <div className="flex gap-4">
              <Link href="/settings" className="hover:text-zinc-700 dark:hover:text-zinc-300">
                設定
              </Link>
              <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300">
                隱私政策
              </Link>
              <span className="text-zinc-400 dark:text-zinc-600">
                © 2026 剪筆
              </span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
      <span className="text-emerald-600">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
