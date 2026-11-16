import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { logout } from "@/app/admin/login/actions";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
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
    <div className="flex min-h-full flex-1 flex-col bg-brand-beige/40 lg:flex-row">
      <AdminSidebar
        footer={
          <div className="flex flex-col gap-1 text-sm">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-brand-ink/80 hover:bg-brand-soft/30"
            >
              <span aria-hidden className="w-5 text-center">
                🌐
              </span>
              查看網站 ↗
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-brand-ink/80 hover:bg-brand-soft/30"
              >
                <span aria-hidden className="w-5 text-center">
                  🚪
                </span>
                登出
              </button>
            </form>
          </div>
        }
      />
      <main className="mx-auto w-full min-w-0 max-w-5xl flex-1 px-4 py-8 sm:px-8">
        {children}
      </main>
    </div>
  );
}
