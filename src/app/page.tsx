import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import { Lightbulb, Target, Zap, Github } from "lucide-react";

export default async function LandingPage() {
  const session = await auth();

  // If already logged in, redirect to products
  if (session) {
    redirect("/products");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo / Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            <span className="text-neon-cyan text-glow-cyan">Product</span>
            <span className="text-neon-magenta text-glow-magenta"> 5000</span>
          </h1>

          <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-xl mx-auto">
            Ideas management for solo PMs. Track, prioritize, and validate —
            without the bloat.
          </p>

          {/* CTA Button */}
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/products" });
            }}
          >
            <button
              type="submit"
              className="btn btn-primary text-lg px-8 py-3 animate-pulse-glow"
            >
              <Github className="w-5 h-5" />
              Sign in with GitHub
            </button>
          </form>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <FeatureCard
              icon={<Lightbulb className="w-8 h-8 text-neon-cyan" />}
              title="Capture Fast"
              description="Log ideas in seconds. Name + problem, done. Add details when you have them."
            />
            <FeatureCard
              icon={<Target className="w-8 h-8 text-neon-magenta" />}
              title="Prioritize Smart"
              description="Impact x Ease scoring. Sort, filter, find the highest-value opportunities."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-neon-green" />}
              title="Validate Honestly"
              description="Track confidence levels. Opinion, anecdote, data, or validated."
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-text-muted text-sm">
        <p>Built for solo PMs who prefer clarity over chaos</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card p-6 text-left">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm">{description}</p>
    </div>
  );
}
