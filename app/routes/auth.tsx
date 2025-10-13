import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { usePuterStore } from "~/lib/puter";
import Navbar from "~/components/Navbar";

export const meta = () => ([
  { title: "ResumeCrack | Auth" },
  { name: "description", content: "Log into your account" }
]);

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);

  return (
    <>
    <Navbar/>
    <main className="bg-gradient flex items-center justify-center relative overflow-hidden min-h-screen font-sans">
      {/* --- Floating Glow Blobs --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-[#6b8cff] rounded-full mix-blend-screen filter blur-[120px] opacity-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-20 w-80 h-80 bg-[#c77dff] rounded-full mix-blend-screen filter blur-[120px] opacity-20"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* --- Auth Container --- */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-[#0f0f1a]/80 rounded-2xl p-10 md:p-14 shadow-[0_0_40px_rgba(107,140,255,0.15)] border border-[#1e1e2a] backdrop-blur-2xl max-w-md w-[90%]"
      >
        {/* Logo Glow */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-[#6b8cff] via-[#8b5cf6] to-[#c77dff] opacity-10 blur-2xl"
        />

        {/* --- Header --- */}
        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6b8cff] to-[#c77dff] flex items-center justify-center shadow-lg"
          >
            <svg
              className="w-10 h-10 text-[#0f0f1a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </motion.div>

          <h1 className="text-gradient text-5xl font-semibold max-sm:text-4xl">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">
            Log in to continue your job journey
          </p>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#6b8cff] to-transparent rounded-full mt-2" />
        </div>

        {/* --- Auth Button --- */}
        <div className="flex flex-col gap-6">
          {isLoading ? (
            <motion.button
              className="auth-button animate-pulse relative overflow-hidden group"
              disabled
            >
              <p className="relative z-10 flex items-center justify-center gap-3">
                <svg
                  className="animate-spin h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing you in...
              </p>
            </motion.button>
          ) : auth.isAuthenticated ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="auth-button relative overflow-hidden group "
              onClick={auth.signOut}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
              <p className="relative z-10 flex items-center justify-center gap-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Log Out
              </p>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="auth-button relative overflow-hidden group"
              onClick={auth.signIn}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
              <p className="relative z-10 flex items-center justify-center gap-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Log In
              </p>
            </motion.button>
          )}

          {/* Small Info */}
          <p className="text-center text-sm text-gray-500">
            Secure authentication powered by{" "}
            <span className="text-gradient font-semibold">Puter</span>
          </p>
        </div>

        {/* --- Feature Badges --- */}
        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#2a2a3d] mt-6">
          {[
            { label: "Secure", icon: "lock" },
            { label: "Fast", icon: "zap" },
            { label: "Private", icon: "shield-check" },
          ].map((f, i) => (
            <motion.div
              key={f.label}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#14141f] flex items-center justify-center border border-[#2a2a3d] shadow-inner">
                <svg
                  className="w-6 h-6 text-[#6b8cff]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {f.icon === "lock" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  )}
                  {f.icon === "zap" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  )}
                  {f.icon === "shield-check" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  )}
                </svg>
              </div>
              <p className="text-xs text-gray-400">{f.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
    </>
  );
};

export default Auth;
