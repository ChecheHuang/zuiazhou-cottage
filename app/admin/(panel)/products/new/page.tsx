import { ProductForm } from "@/components/admin/ProductForm";
import { emptyProduct } from "@/lib/products/shared";

export default function AdminNewProductPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold text-brand">新增商品</h1>
      <ProductForm initial={emptyProduct} />
    </>
  );
}
