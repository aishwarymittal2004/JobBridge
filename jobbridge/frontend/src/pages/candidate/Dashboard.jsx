import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UploadCloud, FileText, ArrowRight, Check } from "lucide-react";
import { useGetResumeQuery, useUploadResumeMutation, useSetJobPreferenceMutation } from "../../store/api/candidateApi";
import LoadingState from "../../components/LoadingState";

export default function CandidateDashboard() {
  const { data: resume, isLoading } = useGetResumeQuery();
  const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();
  const [setJobPreference, { isLoading: isSavingRole, isSuccess: isRoleSaved }] = useSetJobPreferenceMutation();
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [desiredRole, setDesiredRole] = useState("");
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx"].includes(ext)) {
      setError("Only PDF and DOCX files are supported.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      await uploadResume(formData).unwrap();
    } catch (err) {
      setError(err?.data?.detail || "Upload failed. Please try again.");
    }
  };

  if (isLoading) return <LoadingState label="Loading your dashboard" />;

  const extracted = resume?.extracted_data;

  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-ink-900 text-slate-800 dark:text-mist-100 font-sans relative overflow-hidden -m-4 sm:-m-8 p-4 sm:p-8 rounded-tl-3xl transition-colors duration-300">
      {/* Decorative blurred blobs to match the landing page vibe */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-300/30 dark:bg-signal-violet/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 dark:bg-signal-cyan/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <main className="relative z-10 max-w-4xl mx-auto py-8">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-mist-100 tracking-tight">Dashboard</h1>
        <p className="mt-2 text-slate-500 dark:text-mist-500 text-base font-medium">Upload a resume to extract your skills and start matching career pages.</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          className={`mt-10 flex flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed px-8 py-16 text-center transition-all bg-white dark:bg-ink-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none ${
            dragOver ? "border-blue-400 dark:border-signal-violet bg-blue-50/50 dark:bg-signal-violet/5 scale-[1.02]" : "border-slate-200 dark:border-ink-600"
          }`}
        >
          <div className={`p-4 rounded-full ${dragOver ? "bg-blue-100 text-blue-600 dark:bg-signal-violet/20 dark:text-signal-violet" : "bg-slate-100 text-slate-400 dark:bg-ink-700 dark:text-mist-500"} transition-colors`}>
            <UploadCloud className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-mist-100">
            {isUploading ? "Analyzing resume…" : "Drop your resume here"}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-mist-500">PDF or DOCX, up to 10MB</p>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="mt-4 bg-white dark:bg-ink-700 border border-slate-200 dark:border-ink-600 hover:border-blue-500 dark:hover:border-signal-cyan hover:text-blue-700 dark:hover:text-signal-cyan text-slate-700 dark:text-mist-300 font-bold py-3 px-8 rounded-xl transition-all shadow-sm hover:shadow"
          >
            {resume ? "Replace resume" : "Browse files"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            hidden
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {error && <p className="mt-4 text-sm font-medium text-red-500 dark:text-bad bg-red-50 dark:bg-bad/10 px-4 py-2 rounded-lg">{error}</p>}
        </div>

        {resume && (
          <div className="mt-8 bg-white dark:bg-ink-800 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-ink-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-mist-100 mb-6 flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-ink-700 text-blue-600 dark:text-signal-cyan p-2 rounded-lg">
                <FileText className="h-5 w-5" />
              </div>
              {resume.original_filename}
            </h2>

            {extracted?.skills?.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-semibold text-slate-700 dark:text-mist-300 mb-3">Extracted skills</p>
                <div className="flex flex-wrap gap-2">
                  {extracted.skills.map((s) => (
                    <span key={s} className="bg-slate-100 dark:bg-ink-700 text-slate-700 dark:text-mist-100 px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-200 dark:border-ink-600">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {extracted?.suggested_roles?.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-semibold text-slate-700 dark:text-mist-300 mb-3">Suggested roles</p>
                <div className="flex flex-wrap gap-2">
                  {extracted.suggested_roles.map((r) => (
                    <span key={r} className="bg-purple-50 dark:bg-signal-violet/10 text-purple-700 dark:text-signal-violet px-3 py-1.5 rounded-lg text-sm font-bold border border-purple-100 dark:border-signal-violet/30">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {typeof extracted?.total_experience_years === "number" && (
              <p className="mt-8 text-sm font-semibold text-slate-500 dark:text-mist-500">
                Estimated experience: <span className="text-slate-900 dark:text-mist-100 ml-2">{extracted.total_experience_years} years</span>
              </p>
            )}

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-ink-700">
              <label className="block text-sm font-semibold text-slate-700 dark:text-mist-300 mb-2">Desired role</label>
              <div className="flex flex-col sm:flex-row max-w-lg items-start sm:items-center gap-3">
                <input
                  type="text"
                  value={desiredRole}
                  onChange={(e) => setDesiredRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer"
                  className="flex-1 w-full bg-slate-50 dark:bg-ink-900 border border-slate-200 dark:border-ink-600 text-slate-900 dark:text-mist-100 rounded-xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-signal-cyan/20 focus:border-blue-500 dark:focus:border-signal-cyan transition-all placeholder:text-slate-400 dark:placeholder:text-mist-500"
                />
                <button
                  onClick={() => setJobPreference({ job_role: desiredRole })}
                  disabled={!desiredRole || isSavingRole}
                  className="bg-slate-900 dark:bg-ink-700 hover:bg-slate-800 dark:hover:bg-ink-600 text-white dark:text-mist-100 font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 shrink-0 w-full sm:w-auto"
                >
                  {isSavingRole ? "Saving..." : isRoleSaved ? <Check className="h-5 w-5 mx-auto text-white dark:text-signal-cyan" /> : "Save Role"}
                </button>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-mist-500">Save your desired role to see matching jobs in your feed.</p>
            </div>

            <Link to="/feed" className="inline-flex mt-10 items-center justify-center bg-blue-600 dark:bg-signal-violet hover:bg-blue-700 dark:hover:bg-signal-violet/80 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] dark:shadow-glow hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] active:scale-95">
              View my career feed <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
