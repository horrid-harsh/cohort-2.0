import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hook/useAuth.js";
import AuthLayout from "../../../components/layouts/AuthLayout.jsx";
import { Alert, FormField, InputWrapper, inputClass, MailIcon } from "../../../components/ui/AuthUI.jsx";

// ── States this page can be in ────────────────────────────────────────────────
const STATUS = {
  LOADING:  "loading",
  SUCCESS:  "success",
  FAILED:   "failed",
  RESENT:   "resent",
};

// ── Icons ─────────────────────────────────────────────────────────────────────
function SuccessIcon() {
  return (
    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26" className="text-emerald-400">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7.5 12l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function FailedIcon() {
  return (
    <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26" className="text-red-400">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 7v6M12 16.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function SpinnerIcon() {
  return (
    <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-5">
      <span className="w-6 h-6 border-2 border-white/10 border-t-[#00d4aa] rounded-full animate-spin block" />
    </div>
  );
}

// ── Resend form (shown on failure) ────────────────────────────────────────────
function ResendForm({ onResent, isLoading, error }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(({ email }) => onResent(email))} noValidate className="mt-5 flex flex-col gap-3">
      <Alert type="error" message={error} />
      <FormField label="Your email" error={errors.email?.message}>
        <InputWrapper icon={<MailIcon />}>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            className={inputClass}
          />
        </InputWrapper>
      </FormField>

      <button
        type="submit"
        disabled={isLoading}
        className="
          w-full py-[0.78rem] rounded-lg mt-1
          bg-[#00d4aa] text-[#0a0a0a]
          font-display text-[0.9rem] font-semibold tracking-[0.01em]
          transition-all duration-150
          hover:opacity-90 hover:shadow-[0_0_24px_rgba(0,212,170,0.25)]
          active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2 select-none
        "
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            Sending…
          </>
        ) : "Resend verification email"}
      </button>
    </form>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, verifyEmail, resendVerification, clearError } = useAuth();
  const [status, setStatus] = useState(STATUS.LOADING);
  const hasRun = useRef(false); // prevent double-fire in StrictMode

  const token = searchParams.get("token");

  // On mount: attempt verification if token present
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      setStatus(STATUS.FAILED);
      return;
    }

    const run = async () => {
      try {
        clearError();
        await verifyEmail(token);
        setStatus(STATUS.SUCCESS);
      } catch (err) {
        console.error("Verification Error:", err);
        setStatus(STATUS.FAILED);
      }
    };

    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResend = async (email) => {
    try {
      clearError();
      await resendVerification(email);
      setStatus(STATUS.RESENT);
    } catch {
      // error in Redux state — ResendForm reads it
    }
  };

  const handleContinue = () => {
    navigate(isAuthenticated ? "/dashboard" : "/login");
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <AuthLayout>
      {status === STATUS.LOADING && (
        <div className="text-center py-4">
          <SpinnerIcon />
          <h1 className="font-display text-[1.4rem] font-bold tracking-tight text-[#f0f0ee] mb-2">
            Verifying your email
          </h1>
          <p className="text-sm text-gray-500 font-light">
            Just a moment…
          </p>
        </div>
      )}

      {status === STATUS.SUCCESS && (
        <div className="text-center py-4">
          <SuccessIcon />
          <h1 className="font-display text-[1.4rem] font-bold tracking-tight text-[#f0f0ee] mb-2">
            Email verified!
          </h1>
          <p className="text-sm text-gray-500 font-light mb-7">
            Your account is now active. You can sign in.
          </p>
          <button onClick={handleContinue} className="
            w-full py-[0.78rem] rounded-lg
            bg-[#00d4aa] text-[#0a0a0a]
            font-display text-[0.9rem] font-semibold tracking-[0.01em]
            transition-all duration-150
            hover:opacity-90 hover:shadow-[0_0_24px_rgba(0,212,170,0.25)]
            active:scale-[0.98] select-none
          ">
            {isAuthenticated ? "Go to dashboard" : "Go to login"}
          </button>
        </div>
      )}

      {status === STATUS.FAILED && (
        <div className="py-2">
          <FailedIcon />
          <h1 className="font-display text-[1.4rem] font-bold tracking-tight text-[#f0f0ee] mb-2 text-center">
            {error || "Verification failed"}
          </h1>
          <p className="text-sm text-gray-500 font-light text-center leading-normal px-4">
            This verification link has expired or already been used. 
            Enter your email and we'll send a fresh one.
          </p>
          <ResendForm
            onResent={handleResend}
            isLoading={isLoading}
            error={error}
          />
          <div className="mt-7 flex flex-col items-center gap-3">
             <p className="text-center text-sm text-gray-500">
               Already verified?{" "}
               <Link to="/login" className="text-[#00d4aa] font-medium hover:opacity-75 transition-opacity">
                 Sign in
               </Link>
             </p>
             <p className="text-xs text-gray-600">
               Not signed up? <Link to="/signup" className="hover:underline">Create account</Link>
             </p>
          </div>
        </div>
      )}

      {status === STATUS.RESENT && (
        <div className="text-center py-4">
          <SuccessIcon />
          <h1 className="font-display text-[1.4rem] font-bold tracking-tight text-[#f0f0ee] mb-2">
            Check your inbox
          </h1>
          <p className="text-sm text-gray-500 font-light mb-7">
            A new verification link is on its way. It expires in 24 hours.
          </p>
          <Link
            to="/login"
            className="
              block w-full py-[0.78rem] rounded-lg text-center
              bg-white/[0.04] border border-white/[0.08] text-[#f0f0ee]
              font-display text-[0.9rem] font-semibold tracking-[0.01em]
              transition-all duration-150
              hover:bg-white/[0.07] hover:border-white/[0.14]
              active:scale-[0.98] select-none
            "
          >
            Back to login
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}