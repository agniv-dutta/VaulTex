import Link from "next/link";
import { cookies } from "next/headers";
import { Card } from "@/components/ui/Card";

export default function Home() {
  const token = cookies().get("vaultex_token")?.value;

  return (
    <main className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(42,42,255,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(0,255,170,0.12),transparent_60%)]" />

      <div className="relative mx-auto flex min-h-full w-full max-w-5xl items-center px-4 py-12">
        <div className="grid w-full gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-6 lg:p-8">
            <div className="font-display text-[13px] tracking-[0.2em] uppercase text-[#5A5A7A]">
              Vault Access Layer
            </div>
            <h1 className="mt-3 font-display text-[34px] leading-tight tracking-[0.12em] uppercase text-accent drop-shadow-[0_0_12px_#FFD70066] lg:text-[44px]">
              VaulTex Finance Console
            </h1>
            <p className="mt-4 max-w-[62ch] text-[13px] leading-relaxed text-[#B8B8CC]">
              Real-time personal finance tracking with role-based access, records control, and visual analytics.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={token ? "/dashboard" : "/login"}
                className="inline-flex h-11 items-center justify-center rounded-pill border-2 border-accent bg-[linear-gradient(135deg,#FF6B00,#FFD700)] px-6 font-mono text-[13px] uppercase tracking-[0.12em] text-black shadow-glow transition-transform duration-150 hover:scale-[1.03]"
              >
                {token ? "Enter Dashboard" : "Login"}
              </Link>
              {!token ? (
                <Link
                  href="/register"
                  className="inline-flex h-11 items-center justify-center rounded-pill border-2 border-border px-6 font-mono text-[13px] uppercase tracking-[0.12em] text-[#E8E8E0] transition-colors duration-150 hover:border-mint"
                >
                  Create Account
                </Link>
              ) : null}
            </div>
          </Card>

          <Card className="p-6">
            <div className="font-display text-[13px] tracking-[0.15em] uppercase text-[#5A5A7A]">
              Quick Access
            </div>
            <div className="mt-4 space-y-3 text-[13px]">
              <div className="rounded-card border-2 border-border bg-[#0E0E18] px-3 py-2">
                <span className="text-[#5A5A7A]">Route</span>
                <div className="mt-1 text-accent">/dashboard</div>
              </div>
              <div className="rounded-card border-2 border-border bg-[#0E0E18] px-3 py-2">
                <span className="text-[#5A5A7A]">Records API</span>
                <div className="mt-1 text-mint">/api/records</div>
              </div>
              <div className="rounded-card border-2 border-border bg-[#0E0E18] px-3 py-2">
                <span className="text-[#5A5A7A]">Analytics API</span>
                <div className="mt-1 text-danger">/api/dashboard/*</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
