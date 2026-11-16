import { redirect } from "next/navigation";
import { sectionForBlockPage } from "@/lib/admin/page-sections";
import { SITE_PAGES, pageSectionHref } from "@/lib/admin/sections";

// 舊的「文字管理」網址：後台改成依網頁分頁後，導到對應的頁面
export default async function AdminContentRedirect({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const section = (page && sectionForBlockPage(page)) || SITE_PAGES[0];
  redirect(pageSectionHref(section.slug));
}
