import Link from "next/link";
import { Settings, Scissors } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="h-8 w-8 rounded-md bg-emerald-600 text-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Scissors className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="font-semibold text-lg tracking-chinese">剪筆</span>
          <span className="text-xs text-zinc-500 hidden sm:inline">
            JianBi · 繁中內容再製
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/settings"
            className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>設定</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
