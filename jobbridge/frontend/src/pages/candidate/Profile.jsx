import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGetProfileQuery, useSetJobPreferenceMutation } from "../../store/api/candidateApi";
import LoadingState from "../../components/LoadingState";

export default function CandidateProfile() {
  const { data: user, isLoading } = useGetProfileQuery();
  const [setJobPreference, { isLoading: isSaving }] = useSetJobPreferenceMutation();
  const [jobRole, setJobRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  if (isLoading) return <LoadingState label="Loading profile" />;

  const handleSavePreferences = async () => {
    if (!jobRole.trim()) return;
    await setJobPreference({ job_role: jobRole }).unwrap();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-ink-900 text-slate-800 dark:text-mist-100 font-sans relative overflow-hidden -m-4 sm:-m-8 p-4 sm:p-8 rounded-tl-3xl transition-colors duration-300">
      {/* Decorative blurred blobs to match the landing page vibe */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-300/30 dark:bg-signal-violet/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 dark:bg-signal-cyan/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <main className="relative z-10 max-w-5xl mx-auto py-4">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-mist-500 dark:hover:text-signal-cyan transition-colors mb-8">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to dashboard
        </Link>
        
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-mist-100 tracking-tight">Profile</h1>
        <p className="mt-2 text-slate-500 dark:text-mist-500 text-base font-medium">Manage your details and preferred job roles.</p>
        
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Basic Info Card */}
          <div className="bg-white dark:bg-ink-800 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-ink-700 flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 dark:text-mist-100 mb-8">Basic info</h2>
            
            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-mist-300 mb-2">Full name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-ink-900 border border-slate-200 dark:border-ink-600 text-slate-900 dark:text-mist-100 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-signal-cyan/20 focus:border-blue-500 dark:focus:border-signal-cyan transition-all placeholder:text-slate-400 dark:placeholder:text-mist-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-mist-300 mb-2">Email</label>
                <input 
                  type="email" 
                  value={email}
                  readOnly
                  className="w-full bg-slate-50/70 dark:bg-ink-900/70 border border-slate-200 dark:border-ink-600 text-slate-400 dark:text-mist-500 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>
            
            <button className="mt-10 bg-blue-600 dark:bg-signal-violet hover:bg-blue-700 dark:hover:bg-signal-violet/80 text-white font-bold py-3.5 px-7 rounded-2xl transition-all shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] dark:shadow-glow hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] active:scale-95 w-fit">
              Save changes
            </button>
          </div>
          
          {/* Preferred Job Roles Card */}
          <div className="bg-white dark:bg-ink-800 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-ink-700 flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 dark:text-mist-100 mb-8">Preferred job roles</h2>
            
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-8 min-h-[32px]">
                 {jobRole ? (
                   <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-signal-cyan/10 text-blue-700 dark:text-signal-cyan px-4 py-2 rounded-xl text-sm font-bold border border-blue-100 dark:border-signal-cyan/30">
                     {jobRole}
                     <button onClick={() => setJobRole("")} className="hover:text-blue-900 dark:hover:text-signal-cyan text-blue-400 dark:text-signal-cyan/60 transition-colors ml-1">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                   </div>
                 ) : (
                   <span className="text-sm text-slate-400 dark:text-mist-500 italic font-medium flex items-center h-full">No roles selected</span>
                 )}
              </div>
              
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="e.g. Backend Developer"
                  value={jobRole}
                  onChange={e => setJobRole(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-ink-900 border border-slate-200 dark:border-ink-600 text-slate-900 dark:text-mist-100 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-signal-cyan/20 focus:border-blue-500 dark:focus:border-signal-cyan transition-all placeholder:text-slate-400 dark:placeholder:text-mist-500"
                />
                <button 
                  onClick={handleSavePreferences}
                  className="bg-slate-900 dark:bg-ink-700 hover:bg-slate-800 dark:hover:bg-ink-600 text-white p-3.5 rounded-2xl transition-all flex-shrink-0 flex items-center justify-center w-[52px] shadow-sm active:scale-95"
                >
                  <svg className="w-5 h-5 text-white dark:text-mist-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>
            
            <button 
              onClick={handleSavePreferences}
              disabled={isSaving || !jobRole}
              className="mt-10 bg-[#2563eb] dark:bg-signal-cyan hover:bg-[#1d4ed8] dark:hover:bg-signal-cyan/80 text-white dark:text-ink-900 font-bold py-3.5 px-6 rounded-2xl transition-all shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] dark:shadow-glow hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] active:scale-95 w-full text-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isSaving ? "Saving..." : "Save preferences"}
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
}
