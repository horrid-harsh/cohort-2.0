// ── Alert ─────────────────────────────────────────────────────────────────────
export function Alert({ type = "error", message }) {
  if (!message) return null;

  const styles = {
    error:   "bg-red-500/[0.08] border border-red-500/20 text-red-400",
    success: "bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400",
  };

  return (
    <div className={`flex items-start gap-2 rounded-lg px-3.5 py-3 text-sm leading-relaxed mb-4 ${styles[type]}`}>
      {type === "error" ? <ErrorIcon /> : <CheckIcon />}
      <span>{message}</span>
    </div>
  );
}

// ── FormField ─────────────────────────────────────────────────────────────────
export function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[0.72rem] font-medium uppercase tracking-widest text-gray-500">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-[0.78rem] text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  );
}

// ── InputWrapper ──────────────────────────────────────────────────────────────
export function InputWrapper({ icon, children, suffix }) {
  return (
    <div className="relative flex items-center group">
      {icon && (
        <span className="absolute left-3.5 text-gray-600 group-focus-within:text-[#00d4aa] transition-colors pointer-events-none">
          {icon}
        </span>
      )}
      {children}
      {suffix && (
        <span className="absolute right-3.5">{suffix}</span>
      )}
    </div>
  );
}

// ── TextInput ─────────────────────────────────────────────────────────────────
export const inputClass = `
  w-full bg-white/[0.04] border border-white/[0.08] rounded-lg
  pl-10 pr-4 py-[0.68rem]
  text-[0.9rem] text-[#f0f0ee] font-body placeholder-gray-600
  outline-none transition-all duration-150
  focus:border-[#00d4aa]/50 focus:bg-[#00d4aa]/[0.03] focus:shadow-[0_0_0_3px_rgba(0,212,170,0.12)]
  autofill:bg-[#111]
`.trim().replace(/\s+/g, " ");

// ── Submit Button ─────────────────────────────────────────────────────────────
export function SubmitButton({ isLoading, label, loadingLabel }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="
        w-full mt-2 py-[0.78rem] rounded-lg
        bg-[#00d4aa] text-[#0a0a0a]
        font-display text-[0.9rem] font-semibold tracking-[0.01em]
        transition-all duration-150
        hover:opacity-90 hover:shadow-[0_0_24px_rgba(0,212,170,0.25)]
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
      "
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          {loadingLabel}
        </>
      ) : label}
    </button>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
export const MailIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
    <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M1 5.5l7 4.5 7-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const LockIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="8" cy="10.5" r="1" fill="currentColor" />
  </svg>
);

export const UserIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
    <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M2 13.5c0-2.5 2.7-4 6-4s6 1.5 6 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const EyeOpenIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export const EyeClosedIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
    <path d="M2 2l12 12M6.5 6.6A2 2 0 0010 9.9M4.15 4.2C2.6 5.2 1 8 1 8s2.5 5 7 5a7.2 7.2 0 003.85-1.2M6.5 3.1A7.2 7.2 0 0115 8s-.8 1.6-2.1 2.8"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

function ErrorIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14" className="flex-shrink-0 mt-0.5">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14" className="flex-shrink-0 mt-0.5">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
