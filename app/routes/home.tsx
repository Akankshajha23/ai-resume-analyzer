import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { Trash2, AlertTriangle, X, Upload, Sparkles } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeCrack" },
    { name: "description", content: "Smart feedback for your job!" },
  ];
}

// Confirmation Modal Component
function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting,
  resumeName 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  resumeName?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#0f0f1a] border-2 border-[#2a2a3d] rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(107,140,255,0.3)] animate-in zoom-in-95 duration-300">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#ff6b9d] to-[#c77dff] rounded-2xl blur-xl opacity-20" />
        
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 p-2 bg-[#1a1a2e] border border-[#2a2a3d] rounded-full hover:bg-[#2a2a3d] transition-colors"
            disabled={isDeleting}
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b9d] to-[#c77dff] blur-2xl opacity-50 animate-pulse" />
              <div className="relative p-4 bg-gradient-to-br from-[#ff6b9d]/20 to-[#c77dff]/20 rounded-2xl border-2 border-[#ff6b9d]/30">
                <AlertTriangle className="w-12 h-12 text-[#ff6b9d]" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-4 mb-8">
            <h3 className="text-2xl font-bold text-white">Delete Resume?</h3>
            <p className="text-[#a0b4ec] text-sm leading-relaxed">
              Are you sure you want to delete this resume? This action cannot be undone and all associated feedback will be permanently removed.
            </p>
            {resumeName && (
              <div className="mt-4 p-3 bg-[#1a1a2e] border border-[#2a2a3d] rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Resume to delete:</p>
                <p className="text-white font-semibold truncate">{resumeName}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 bg-[#1a1a2e] border-2 border-[#2a2a3d] text-white rounded-xl font-semibold hover:bg-[#2a2a3d] hover:border-[#6b8cff]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#ff6b9d] to-[#c77dff] text-white rounded-xl font-semibold hover:from-[#ff7da9] hover:to-[#d88fff] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,107,157,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete Resume
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { auth, kv, fs } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);

  // 🔒 Redirect if not authenticated
  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  // 📄 Load resumes from KV store
  useEffect(() => {
    const loadResumes = async () => {
      if (!kv) return;
      
      setLoadingResumes(true);
      try {
        const resumes = (await kv.list("resume:*", true)) as KVItem[];
        const parsedResumes = resumes?.map((resume) => JSON.parse(resume.value) as Resume);
        setResumes(parsedResumes || []);
      } catch (err) {
        console.error("Error loading resumes:", err);
      } finally {
        setLoadingResumes(false);
      }
    };
    loadResumes();
  }, [kv]);

  // 🧹 Open delete confirmation modal
  const openDeleteModal = (resume: Resume) => {
    setResumeToDelete(resume);
    setDeleteModalOpen(true);
  };

  // 🧹 Handle delete single resume
  const handleDelete = async () => {
    if (!kv || !resumeToDelete || !fs) {
      console.error("KV store or FS not initialized or no resume selected");
      return;
    }

    setDeleting(resumeToDelete.id);
    try {
      // Delete the files first
      if (resumeToDelete.resumePath) {
        try {
          await fs.delete(resumeToDelete.resumePath);
        } catch (err) {
          console.warn("Error deleting resume file:", err);
        }
      }
      
      if (resumeToDelete.imagePath) {
        try {
          await fs.delete(resumeToDelete.imagePath);
        } catch (err) {
          console.warn("Error deleting image file:", err);
        }
      }

      // Since kv.delete doesn't exist, we'll reload the list and filter out this resume
      // Or set it to an empty/deleted marker
      try {
        await kv.set(`resume:${resumeToDelete.id}`, JSON.stringify({ ...resumeToDelete, deleted: true }));
      } catch (err) {
        console.warn("Error marking resume as deleted:", err);
      }
      
      setResumes((prev) => prev.filter((r) => r.id !== resumeToDelete.id));
      setDeleteModalOpen(false);
      setResumeToDelete(null);
    } catch (err) {
      console.error("Error deleting resume:", err);
      alert("Failed to delete resume. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <main className="bg-gradient min-h-screen">
      <Navbar />
      
      <section className="main-section">
        {/* Header */}
        <div className="page-heading py-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-[#6b8cff] animate-pulse" />
            <h1 className="animate-fadeIn">Track Your Applications and Resume Ratings</h1>
            <Sparkles className="w-8 h-8 text-[#8b5cf6] animate-pulse" />
          </div>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2 className="animate-fadeIn">No resumes found — upload your first resume to get started.</h2>
          ) : (
            <h2 className="animate-fadeIn">Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>

        {/* 🌀 Loading animation */}
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center gap-6 py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] blur-2xl opacity-30 animate-pulse" />
              <img src="/images/resume-scan-2.gif" className="relative w-[200px] rounded-xl" />
            </div>
            <p className="text-[#a0b4ec] text-lg animate-pulse">Loading your resumes...</p>
          </div>
        )}

        {/* 📄 Resumes grid */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="w-full max-w-[1850px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {resumes.map((resume, index) => (
                <div
                  key={resume.id}
                  className="group relative animate-in fade-in duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  
                  {/* Card */}
                  <div className="relative bg-[#0f0f1a] border border-[#2a2a3d] rounded-2xl p-6 transition-all duration-300 hover:border-[#6b8cff]/50 hover:shadow-[0_0_30px_rgba(107,140,255,0.15)]">
                    <ResumeCard resume={resume} />

                    {/* Delete Button */}
                    <button
                      onClick={() => openDeleteModal(resume)}
                      disabled={deleting === resume.id}
                      className="relative overflow-hidden w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#ff6b9d]/10 to-[#c77dff]/10 border-2 border-[#ff6b9d]/30 text-[#ff6b9d] font-semibold text-sm transition-all duration-300 hover:from-[#ff6b9d]/20 hover:to-[#c77dff]/20 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,107,157,0.3)] group/btn disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete Resume
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Wipe All Button */}
            <div className="flex flex-col items-center gap-4 py-8 border-t-2 border-[#2a2a3d]">
              <button
                onClick={() => navigate("/wipe")}
                className="relative overflow-hidden group px-8 py-4 rounded-xl bg-gradient-to-r from-[#6b8cff]/10 to-[#8b5cf6]/10 border-2 border-[#6b8cff]/30 text-white font-semibold text-lg transition-all duration-300 hover:from-[#6b8cff]/20 hover:to-[#8b5cf6]/20 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(107,140,255,0.3)]"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Trash2 className="w-5 h-5" />
                  Wipe All Resume Data
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 -translate-x-full group-hover:translate-x-full group-hover:opacity-100 transition-all duration-1000" />
              </button>
              <p className="text-sm text-gray-400 italic flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#ff6b9d]" />
                This will permanently delete all saved resumes and feedback
              </p>
            </div>
          </div>
        )}

        {/* ➕ Upload Prompt */}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-6 animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] rounded-full blur-2xl opacity-20 animate-pulse" />
              <Link
                to="/upload"
                className="relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] text-white rounded-full font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(107,140,255,0.5)] group"
              >
                <Upload className="w-6 h-6 group-hover:animate-bounce" />
                Upload Your First Resume
                <Sparkles className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-[#a0b4ec] text-center max-w-md">
              Get AI-powered feedback and improve your resume for better job opportunities
            </p>
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setResumeToDelete(null);
        }}
        onConfirm={handleDelete}
        isDeleting={deleting !== null}
        resumeName={resumeToDelete?.companyName || resumeToDelete?.jobTitle}
      />
    </main>
  );
}