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
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="eyebrow mb-2">Dashboard</p>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Your resume signal</h1>
      <p className="mt-1 text-sm text-mist-500">
        Upload a resume so JobBridge can extract your skills and start matching career pages.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        className={`card mt-8 flex flex-col items-center gap-3 border-dashed px-6 py-12 text-center transition ${
          dragOver ? "border-signal-violet bg-signal-violet/5" : ""
        }`}
      >
        <UploadCloud className="h-8 w-8 text-signal-violet" />
        <p className="font-display text-sm font-semibold text-mist-100">
          {isUploading ? "Analyzing resume…" : "Drop your resume here"}
        </p>
        <p className="text-xs text-mist-500">PDF or DOCX, up to 10MB</p>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="btn-secondary mt-2"
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
        {error && <p className="text-sm text-bad">{error}</p>}
      </div>

      {resume && (
        <div className="card mt-6 p-6">
          <div className="flex items-center gap-2 text-mist-100">
            <FileText className="h-4 w-4 text-signal-cyan" />
            <span className="text-sm font-medium">{resume.original_filename}</span>
          </div>

          {extracted?.skills?.length > 0 && (
            <div className="mt-5">
              <p className="label">Extracted skills</p>
              <div className="flex flex-wrap gap-2">
                {extracted.skills.map((s) => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </div>
          )}

          {extracted?.suggested_roles?.length > 0 && (
            <div className="mt-5">
              <p className="label">Suggested roles</p>
              <div className="flex flex-wrap gap-2">
                {extracted.suggested_roles.map((r) => (
                  <span key={r} className="rounded-full border border-signal-violet/30 bg-signal-violet/10 px-2.5 py-1 font-mono text-[11px] text-signal-violet">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {typeof extracted?.total_experience_years === "number" && (
            <p className="mt-5 text-sm text-mist-500">
              Estimated experience: <span className="text-mist-100">{extracted.total_experience_years} years</span>
            </p>
          )}

          <div className="mt-5">
            <label className="label mb-1 block">Desired role</label>
            <div className="flex max-w-sm items-center gap-2">
              <input
                type="text"
                value={desiredRole}
                onChange={(e) => setDesiredRole(e.target.value)}
                placeholder="e.g. Frontend Engineer"
                className="input-field flex-1"
              />
              <button
                onClick={() => setJobPreference({ job_role: desiredRole })}
                disabled={!desiredRole || isSavingRole}
                className="btn-secondary !py-2 !px-4"
              >
                {isSavingRole ? "Saving..." : isRoleSaved ? <Check className="h-4 w-4 text-signal-cyan" /> : "Save"}
              </button>
            </div>
            <p className="mt-1 text-xs text-mist-500">Save your desired role to see matching jobs in your feed.</p>
          </div>

          <Link to="/feed" className="btn-primary mt-6">
            View my career feed <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </main>
  );
}
