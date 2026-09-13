import { useState } from "react"
import { api } from "./api"

const inputStyle = { background: "#0a0a0a", border: "1px solid #222220" }

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

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
      className="min-h-screen grid place-items-center p-6"
      style={{ background: "#0a0a0a", color: "#f0efe8" }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-md p-8"
        style={{ background: "#111", border: "1px solid #222220" }}
      >
        <div className="flex items-center gap-2 mb-8">
          <span
            className="w-8 h-8 grid place-items-center font-display font-bold"
            style={{ background: "#d4ff00", color: "#0a0a0a" }}
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
          <p className="text-sm mb-4" style={{ color: "#ff6b6b" }}>
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="w-full p-3 font-display uppercase tracking-wider disabled:opacity-50"
          style={{ background: "#d4ff00", color: "#0a0a0a" }}
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
          style={{ color: "#a0a09a" }}
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already have an account? Sign in"}
        </button>
      </form>
    </main>
  )
}
