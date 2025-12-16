import Link from "next/link";
import { auth } from "@/lib/auth";
import { getProductsByUser } from "@/db/queries";
import { Plus, Package, ChevronRight } from "lucide-react";
import { ProductForm } from "@/components/products/ProductForm";

export default async function ProductsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const products = await getProductsByUser(session.user.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Products</h1>
          <p className="text-text-secondary mt-1">
            Manage your products and their ideas
          </p>
        </div>
        <ProductForm />
      </div>

      {products.length === 0 ? (
        <div className="empty-state py-20">
          <Package className="w-16 h-16 text-text-muted" />
          <h3 className="text-xl font-semibold mt-4">No products yet</h3>
          <p className="text-text-muted mt-2 max-w-sm">
            Create your first product to start tracking ideas. Click the "New
            Product" button above to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="card card-clickable group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-text-primary truncate group-hover:text-neon-cyan transition-colors">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-neon-cyan transition-colors flex-shrink-0 ml-2" />
              </div>
              <div className="mt-4 text-xs text-text-muted">
                Updated{" "}
                {new Date(product.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
