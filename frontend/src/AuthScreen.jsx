import { useEffect, useState } from "react"
import { api } from "./api"

const inputStyle = {
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  color: "#172033",
}

export default function AuthScreen({ initialMode, onAuthenticated, onBack }) {
  const [mode, setMode] = useState(initialMode)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setMode(initialMode)
    setError("")
  }, [initialMode])

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError("")

    try {
      if (mode === "register") {
        await api("/auth/register", {
          method: "POST",
          body: { name, email, password },
        })
      }

      const session = await api("/auth/login", {
        method: "POST",
        body: { email, password },
      })
      localStorage.setItem("taskforge-token", session.token)
      onAuthenticated(session.token)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main
      className="min-h-screen grid place-items-center p-6 auth-page"
      style={{ color: "#172033" }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-md p-8 auth-card"
        style={{
          background: "#ffffff",
          border: "1px solid #dbe3ef",
          borderRadius: 28,
          boxShadow: "0 30px 80px rgba(40, 61, 63, 0.18)",
        }}
      >
        <div className="flex items-center gap-2 mb-8">
          <span
            className="w-8 h-8 grid place-items-center font-display font-bold"
            style={{
              background: "#f0804c",
              color: "#ffffff",
              borderRadius: 12,
            }}
          >
            TF
          </span>
          <span className="font-display uppercase tracking-widest">
            TaskForge
          </span>
        </div>
        <h1 className="font-display text-4xl uppercase mb-2">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        {mode === "register" && (
          <label className="block text-sm mb-4">
            Name
            <input
              required
              minLength="2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block mt-1 w-full p-3"
              style={inputStyle}
            />
          </label>
        )}
        <label className="block text-sm mb-4">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block mt-1 w-full p-3"
            style={inputStyle}
          />
        </label>
        <label className="block text-sm mb-5">
          Password
          <input
            required
            minLength="6"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block mt-1 w-full p-3"
            style={inputStyle}
          />
        </label>
        {error && (
          <p className="text-sm mb-4" style={{ color: "#dc2626" }}>
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="w-full p-3 font-display uppercase tracking-wider disabled:opacity-50"
          style={{
            background: "#f0804c",
            color: "#ffffff",
            borderRadius: 999,
            boxShadow: "0 10px 24px rgba(240, 128, 76, 0.22)",
          }}
        >
          {busy ? "Working…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login")
            setError("")
          }}
          className="w-full mt-4 text-sm"
          style={{ color: "#526277" }}
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already have an account? Sign in"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full mt-3 text-sm"
          style={{ color: "#526277" }}
        >
          ← Back to landing page
        </button>
      </form>
    </main>
  )
}
