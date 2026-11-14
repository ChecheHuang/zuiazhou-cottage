import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/app/admin/login/actions";
import { isAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "後台 - Happy 抓周小屋",
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="flex min-h-full flex-1 flex-col bg-brand-beige/40">
      <header className="sticky top-0 z-20 border-b border-brand-soft/40 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/admin" className="font-semibold text-brand">
            抓周小屋後台
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              target="_blank"
              className="rounded-full px-4 py-2 text-brand-ink hover:bg-brand-soft/30"
            >
              查看網站
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-brand-soft/60 px-4 py-2 text-brand-ink hover:bg-brand-soft/30"
              >
                登出
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
