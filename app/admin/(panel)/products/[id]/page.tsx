import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductForAdmin } from "@/lib/products/server";
import { toProductInput } from "@/lib/products/shared";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const product = await getProductForAdmin(id);
  if (!product) notFound();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-brand">編輯商品</h1>
        {product.published && (
          <Link
            href={`/products/${product.id}`}
            target="_blank"
            className="text-sm text-brand underline-offset-4 hover:underline"
          >
            在網站上查看 ↗
          </Link>
        )}
      </div>
      <ProductForm productId={product.id} initial={toProductInput(product)} />
    </>
  );
}
