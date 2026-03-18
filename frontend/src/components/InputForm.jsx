import React, { useState } from 'react'
import axios from 'axios'

export default function InputForm({ setIsOpen }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    let endpoint = isSignUp ? "signUp" : "login"
    try {
      const res = await axios.post(`http://localhost:5000/${endpoint}`, { email, password })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      setIsOpen()
      window.location.reload()
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleOnSubmit}>
      <h2 className="auth-form-title">
        {isSignUp ? "Create Account" : "Welcome Back"}
      </h2>
      <p className="auth-form-subtitle">
        {isSignUp
          ? "Join the community and share your recipes"
          : "Sign in to access your recipes"}
      </p>

      <div className="form-group">
        <label htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          type="email"
          className="form-input"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          type="password"
          className="form-input"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <div className="auth-error">{error}</div>}

      <button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? "Please wait..." : (isSignUp ? "🚀 Create Account" : "✨ Sign In")}
      </button>

      <button
        type="button"
        className="auth-toggle"
        onClick={() => { setIsSignUp(prev => !prev); setError(""); }}
      >
        {isSignUp ? "Already have an account? Sign in" : "New here? Create an account"}
      </button>
    </form>
  )
}