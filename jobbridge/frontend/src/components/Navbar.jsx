import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Radar } from "lucide-react";
import { logout } from "../store/authSlice";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const homeLink = !user ? "/" : user.role === "hr" ? "/hr/dashboard" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-ink-600 bg-white/80 dark:bg-ink-900/80 backdrop-blur-md transition-colors duration-300">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to={homeLink} className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-mist-100">
          <Radar className="h-5 w-5 text-blue-600 dark:text-signal-violet" strokeWidth={2.5} />
          Job<span className="text-blue-600 dark:text-signal-violet">Bridge</span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              {user.role === "candidate" && (
                <>
                  <Link to="/" className="hidden text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-mist-300 dark:hover:text-mist-100 sm:block transition-colors">Home</Link>
                  <Link to="/dashboard" className="hidden text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-mist-300 dark:hover:text-mist-100 sm:block transition-colors">Dashboard</Link>
                  <Link to="/feed" className="hidden text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-mist-300 dark:hover:text-mist-100 sm:block transition-colors">Feed</Link>
                  <Link to="/messages" className="hidden text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-mist-300 dark:hover:text-mist-100 sm:block transition-colors">Messages</Link>
                  <Link to="/profile" className="hidden text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-mist-300 dark:hover:text-mist-100 sm:block transition-colors">Profile</Link>
                </>
              )}
              {user.role === "hr" && (
                <>
                  <Link to="/" className="hidden text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-mist-300 dark:hover:text-mist-100 sm:block transition-colors">Home</Link>
                  <Link to="/hr/dashboard" className="hidden text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-mist-300 dark:hover:text-mist-100 sm:block transition-colors">Candidates</Link>
                </>
              )}
              <button onClick={handleLogout} className="bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-ink-800 dark:hover:bg-ink-700 dark:text-mist-300 font-bold py-2 px-4 rounded-xl transition-all ml-2 flex items-center gap-2">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-slate-800 hover:text-blue-600 dark:text-mist-300 dark:hover:text-mist-100 transition-colors">Candidate</Link>
              <Link to="/hr/login" className="text-sm font-bold text-slate-800 hover:text-blue-600 dark:text-mist-300 dark:hover:text-mist-100 transition-colors">HR</Link>
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-signal-violet dark:hover:bg-signal-violet/80 font-bold py-2.5 px-6 rounded-full transition-all shadow-sm">Get started</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
