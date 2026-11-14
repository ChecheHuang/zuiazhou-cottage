import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "後台登入 - Happy 抓周小屋",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-brand-beige/55 px-4 py-20">
      <div className="w-full max-w-sm rounded-3xl border border-brand-soft/40 bg-white p-8 shadow-[0_22px_44px_rgba(237,160,157,0.12)]">
        <p className="text-sm uppercase tracking-[0.4em] text-brand-accent">
          Admin
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-brand">後台登入</h1>
        <p className="mt-2 text-sm text-brand-ink/70">
          輸入管理密碼以管理網站的圖片與文字。
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
