import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Radar } from "lucide-react";
import { logout } from "../store/authSlice";

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
    <header className="sticky top-0 z-40 border-b border-ink-600 bg-ink-900/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to={homeLink} className="flex items-center gap-2 font-display text-lg font-bold text-mist-100">
          <Radar className="h-5 w-5 text-signal-violet" strokeWidth={2.5} />
          Job<span className="text-signal-violet">Bridge</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === "candidate" && (
                <>
                  <Link to="/dashboard" className="hidden text-sm text-mist-300 hover:text-mist-100 sm:block">Feed</Link>
                  <Link to="/messages" className="hidden text-sm text-mist-300 hover:text-mist-100 sm:block">Messages</Link>
                  <Link to="/profile" className="hidden text-sm text-mist-300 hover:text-mist-100 sm:block">Profile</Link>
                </>
              )}
              {user.role === "hr" && (
                <Link to="/hr/dashboard" className="hidden text-sm text-mist-300 hover:text-mist-100 sm:block">Candidates</Link>
              )}
              <button onClick={handleLogout} className="btn-secondary !py-2 !px-3.5">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-mist-300 hover:text-mist-100">Candidate</Link>
              <Link to="/hr/login" className="text-sm text-mist-300 hover:text-mist-100">HR</Link>
              <Link to="/signup" className="btn-primary !py-2 !px-4">Get started</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
