import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { LogOut, Boxes } from "lucide-react";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/products"
            className="flex items-center gap-2 text-lg font-bold"
          >
            <span className="text-neon-cyan">Product</span>
            <span className="text-neon-magenta">5000</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Boxes className="w-4 h-4" />
              Products
            </Link>

            <div className="flex items-center gap-3 pl-4 border-l border-border">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-8 h-8 rounded-full border border-border"
                />
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-1 text-text-muted hover:text-neon-magenta transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
