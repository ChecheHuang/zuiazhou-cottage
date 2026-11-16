import Link from "next/link";
import { ProductList } from "@/components/admin/ProductList";
import { listAllProducts } from "@/lib/products/server";

export default async function AdminProductsPage() {
  const items = await listAllProducts();
  const live = items.filter((p) => p.published).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs text-brand-ink/50">商品專區 ›</p>
          <h1 className="text-2xl font-semibold text-brand">商品管理</h1>
          <p className="mt-2 text-sm text-brand-ink/70">
            共 {items.length} 個商品，{live}{" "}
            個上架中。點「上架中／已下架」可以直接切換；
            用箭頭調整在「商品專區」的顯示順序。
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          ＋ 新增商品
        </Link>
      </div>
      <div className="mt-6">
        <ProductList initial={items} />
      </div>
    </>
  );
}
