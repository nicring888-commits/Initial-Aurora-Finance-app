import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, Sparkles, WalletMinimal } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "./AuthContext";

interface AuthViewProps {
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
  onAuthenticated: () => void;
}

export function AuthView({ mode, onModeChange, onAuthenticated }: AuthViewProps) {
  const { signIn, signUp, isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isRegister = mode === "register";

  const title = isRegister ? "Account erstellen" : "Willkommen zurueck";
  const subtitle = isRegister
    ? "Registriere dich sicher mit Supabase Authentication."
    : "Melde dich an, um deinen privaten Finance Workspace zu oeffnen.";

  const passwordHint = useMemo(() => {
    if (!password) return "Mindestens 6 Zeichen";
    return password.length >= 6 ? "Sieht gut aus" : "Noch zu kurz";
  }, [password]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!isConfigured) {
      setError("Supabase ist noch nicht konfiguriert. Trage zuerst die ENV-Werte ein.");
      return;
    }

    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const result = await signUp(email, password, `${window.location.origin}/dashboard`);

        if (result.needsEmailConfirmation) {
          setMessage("Account erstellt. Bitte bestaetige deine E-Mail, bevor du dich anmeldest.");
          onModeChange("login");
          return;
        }
      } else {
        await signIn(email, password);
      }

      onAuthenticated();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Authentifizierung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ink-950 px-5 py-10 text-ink-100">
      <div className="app-surface absolute inset-0" />
      <div className="relative z-10 grid w-full max-w-[1080px] grid-cols-[1fr_440px] gap-8 max-lg:max-w-[520px] max-lg:grid-cols-1">
        <section className="flex flex-col justify-between py-4 max-lg:hidden">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-white text-ink-950">
              <WalletMinimal size={21} strokeWidth={2.4} />
            </span>
            <div>
              <p className="font-semibold text-ink-100">Aurora Finance</p>
              <p className="text-sm text-ink-300/58">Secure personal money OS</p>
            </div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.045] px-3 py-1 text-xs text-mint">
                <ShieldCheck size={14} />
                Powered by Supabase Auth
              </p>
              <h1 className="max-w-[620px] text-5xl font-semibold tracking-normal text-ink-100">
                Private Finanzdaten, klar getrennt pro Nutzer.
              </h1>
              <p className="mt-5 max-w-[560px] text-base leading-7 text-ink-300/68">
                Jeder Account bekommt seinen eigenen lokalen Finance Workspace. Ohne aktive Session bleibt das Dashboard geschlossen.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["Auth", "Budgets", "Analytics"].map((item) => (
              <div key={item} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
                <Sparkles size={17} className="mb-4 text-mint" />
                <p className="text-sm font-medium text-ink-100">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <motion.section
          className="glass-panel rounded-xl border border-white/[0.1] bg-white/[0.055] p-6 shadow-glow"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-7">
            <p className="text-xs uppercase text-ink-300/45">Secure Access</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink-100">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink-300/62">{subtitle}</p>
          </div>

          {!isConfigured && (
            <div className="mb-4 rounded-lg border border-amber/30 bg-amber/10 p-3 text-sm leading-6 text-amber">
              Supabase ist noch nicht verbunden. Lege `.env.local` mit `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` an.
            </div>
          )}

          <form className="space-y-3" onSubmit={submit}>
            <label className="field">
              <Mail size={17} />
              <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@example.com" required />
            </label>
            <label className="field">
              <LockKeyhole size={17} />
              <input
                type="password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Passwort"
                required
              />
            </label>
            <p className="text-xs text-ink-300/50">{passwordHint}</p>

            {error && <p className="rounded-lg border border-coral/30 bg-coral/10 p-3 text-sm text-coral">{error}</p>}
            {message && <p className="rounded-lg border border-mint/30 bg-mint/10 p-3 text-sm text-mint">{message}</p>}

            <button
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-ink-950 transition hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Bitte warten" : isRegister ? "Registrieren" : "Anmelden"}
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-ink-300/62">
            <span>{isRegister ? "Schon ein Konto?" : "Noch kein Konto?"}</span>
            <button className="font-medium text-ink-100 hover:text-mint" onClick={() => onModeChange(isRegister ? "login" : "register")}>
              {isRegister ? "Anmelden" : "Registrieren"}
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
