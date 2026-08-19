import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useHrSignupMutation } from "../../store/api/authApi";
import { setCredentials } from "../../store/authSlice";

export default function HRSignup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", company_name: "" });
  const [error, setError] = useState("");
  const [signup, { isLoading }] = useHrSignupMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await signup(form).unwrap();
      dispatch(setCredentials(data));
      navigate("/hr/dashboard");
    } catch (err) {
      setError(err?.data?.detail || "Signup failed. Please try again.");
    }
  };

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
      <p className="eyebrow mb-2">HR</p>
      <h1 className="font-display text-2xl font-bold">Create your HR account</h1>
      <p className="mt-1 text-sm text-mist-500">Search candidates by skill and reach out directly.</p>

      <form onSubmit={handleSubmit} className="card mt-8 flex flex-col gap-4 p-6">
        <div>
          <label className="label">Full name</label>
          <input required minLength={2} className="input-field" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="label">Company name</label>
          <input className="input-field" value={form.company_name}
            onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
        </div>
        <div>
          <label className="label">Work email</label>
          <input type="email" required className="input-field" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" required minLength={8} className="input-field" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p className="text-sm text-bad">{error}</p>}
        <button type="submit" disabled={isLoading} className="btn-primary mt-2">
          {isLoading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-mist-500">
        Already have an account? <Link to="/hr/login" className="text-signal-cyan hover:underline">Log in</Link>
      </p>
    </main>
  );
}
