import { SiteHeader } from "@/components/SiteHeader";
import { ApiKeyForm } from "@/components/ApiKeyForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "設定 · 剪筆 JianBi",
};

export default function SettingsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            返回
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold mb-1 tracking-chinese">設定</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">
            設定 AI Provider 與 API Key。所有資料只存在你這台裝置的瀏覽器裡。
          </p>

          <ApiKeyForm />
        </div>
      </main>
    </>
  );
}
