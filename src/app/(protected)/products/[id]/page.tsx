import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import {
  getProductById,
  getIdeasByProduct,
  getIdeaCountsByStatus,
  getIdeaCountsByFunnelStage,
  getTopIdeasByImpactEase,
  type IdeaSortField,
  type IdeaFilters,
} from "@/db/queries";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/products/ProductForm";
import { DeleteProductButton } from "@/components/products/DeleteProductButton";
import { IdeasTable } from "@/components/ideas/IdeasTable";
import { IdeaForm } from "@/components/ideas/IdeaForm";
import { Dashboard } from "@/components/dashboard/Dashboard";

type ProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    sort?: IdeaSortField;
    dir?: "asc" | "desc";
    status?: string;
    funnelStage?: string;
    confidenceBasis?: string;
  }>;
};

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { id } = await params;
  const product = await getProductById(id, session.user.id);

  if (!product) {
    notFound();
  }

  const sp = await searchParams;
  const sortField = sp.sort || "createdAt";
  const sortDirection = sp.dir || "desc";
  const filters: IdeaFilters = {
    status: sp.status,
    funnelStage: sp.funnelStage,
    confidenceBasis: sp.confidenceBasis,
  };

  const [ideas, statusCounts, funnelCounts, topIdeas] = await Promise.all([
    getIdeasByProduct(product.id, sortField, sortDirection, filters),
    getIdeaCountsByStatus(product.id),
    getIdeaCountsByFunnelStage(product.id),
    getTopIdeasByImpactEase(product.id, 5),
  ]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-text-secondary hover:text-neon-cyan transition-colors text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-text-secondary mt-1 max-w-2xl">
                {product.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ProductForm product={product} />
            <DeleteProductButton
              productId={product.id}
              productName={product.name}
            />
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <Dashboard
        statusCounts={statusCounts}
        funnelCounts={funnelCounts}
        topIdeas={topIdeas}
      />

      {/* Ideas Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-primary">Ideas</h2>
          <IdeaForm productId={product.id} />
        </div>

        <IdeasTable
          ideas={ideas}
          productId={product.id}
          currentSort={sortField}
          currentDirection={sortDirection}
          currentFilters={filters}
        />
      </div>
    </div>
  );
}
