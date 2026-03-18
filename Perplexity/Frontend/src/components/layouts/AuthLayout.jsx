/**
 * AuthLayout — shared chrome for all auth pages.
 * Handles the dark background, dot-grid texture, glow,
 * and the card shell. Pages only render their own form inside.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-[#0a0a0a] overflow-hidden">

      {/* Dot-grid background texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Radial teal glow from top */}
      <div
        className="pointer-events-none fixed z-0 top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px]"
        style={{
          background: "radial-gradient(ellipse, rgba(0,212,170,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div
        className="
          relative z-10 w-full max-w-[420px]
          bg-[rgba(15,15,15,0.85)] border border-white/[0.08]
          rounded-[20px] px-8 py-10
          backdrop-blur-2xl
          animate-[cardReveal_0.45s_cubic-bezier(0.16,1,0.3,1)_forwards]
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#00d4aa] flex items-center justify-center flex-shrink-0">
            <LogoMark />
          </div>
          <span className="font-display text-[1.05rem] font-bold tracking-tight text-[#f0f0ee]">
            Perplexity
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 18 18" fill="none" className="w-[18px] h-[18px] text-[#0a0a0a]">
      <circle cx="9" cy="9" r="3.5" fill="currentColor" />
      <path d="M9 1v3M9 14v3M1 9h3M14 9h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M3.22 3.22l2.12 2.12M12.66 12.66l2.12 2.12M3.22 14.78l2.12-2.12M12.66 5.34l2.12-2.12"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
      />
    </svg>
  );
}
