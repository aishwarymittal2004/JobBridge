import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../store/api/authApi";
import { setCredentials } from "../../store/authSlice";

export default function HRLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(form).unwrap();
      if (data.user.role !== "hr") {
        setError("This account is registered as a candidate. Use the candidate login instead.");
        return;
      }
      dispatch(setCredentials(data));
      navigate("/hr/dashboard");
    } catch (err) {
      setError(err?.data?.detail || "Login failed. Check your credentials.");
    }
  };

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
      <p className="eyebrow mb-2">HR</p>
      <h1 className="font-display text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-mist-500">Log in to search candidates.</p>

      <form onSubmit={handleSubmit} className="card mt-8 flex flex-col gap-4 p-6">
        <div>
          <label className="label">Email</label>
          <input type="email" required className="input-field" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" required className="input-field" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p className="text-sm text-bad">{error}</p>}
        <button type="submit" disabled={isLoading} className="btn-primary mt-2">
          {isLoading ? "Signing in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-mist-500">
        No account? <Link to="/hr/signup" className="text-signal-cyan hover:underline">Sign up</Link>
      </p>
      <p className="mt-2 text-center text-sm text-mist-500">
        Looking for a role? <Link to="/login" className="text-signal-cyan hover:underline">Candidate login</Link>
      </p>
    </main>
  );
}
