import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCandidateSignupMutation } from "../../store/api/authApi";
import { setCredentials } from "../../store/authSlice";

export default function CandidateSignup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [signup, { isLoading }] = useCandidateSignupMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await signup(form).unwrap();
      dispatch(setCredentials(data));
      navigate("/profile");
    } catch (err) {
      setError(err?.data?.detail || "Signup failed. Please try again.");
    }
  };

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
      <p className="eyebrow mb-2">Candidate</p>
      <h1 className="font-display text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-mist-500">Upload a resume once. Let the feed do the searching.</p>

      <form onSubmit={handleSubmit} className="card mt-8 flex flex-col gap-4 p-6">
        <div>
          <label className="label">Full name</label>
          <input required minLength={2} className="input-field" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" required className="input-field" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" required minLength={8} className="input-field" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <p className="mt-1 text-xs text-mist-500">At least 8 characters.</p>
        </div>
        {error && <p className="text-sm text-bad">{error}</p>}
        <button type="submit" disabled={isLoading} className="btn-primary mt-2">
          {isLoading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-mist-500">
        Already have an account? <Link to="/login" className="text-signal-cyan hover:underline">Log in</Link>
      </p>
      <p className="mt-2 text-center text-sm text-mist-500">
        Hiring instead? <Link to="/hr/signup" className="text-signal-cyan hover:underline">HR signup</Link>
      </p>
    </main>
  );
}
