import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter"

export const meta =()=>([
  { title: "ResumeCrack | Auth" },
  { name: "description", content: "Log into your account" }
])
const auth = () => {
  const {isLoading, auth} = usePuterStore();
  const location = useLocation();
  const next = location.search.split('next=')[1];
  const navigate = useNavigate();
  
  useEffect(() => {
    if(auth.isAuthenticated) navigate(next)
  }, [auth.isAuthenticated, next]);

  return (
    <main className="bg-gradient flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00ff66] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#00ff66] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="gradient-border shadow-2xl relative z-10 animate-in fade-in duration-700">
        <section className="flex flex-col gap-10 bg-[#141414] rounded-2xl p-12 max-w-lg w-fit backdrop-blur-xl">
          {/* Logo or Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00ff66] to-[#00cc52] flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-5xl max-sm:text-4xl">Welcome Back</h1>
            <h2 className="text-xs max-sm:text-lg opacity-80">Log In to Continue Your Job Journey</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#00ff66] to-transparent rounded-full mt-2"></div>
          </div>

          {/* Auth Button */}
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <button className="auth-button animate-pulse relative overflow-hidden group" disabled>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <p className="relative z-10 flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing you in...
                </p>
              </button>
            ) : (
              <>
              {auth.isAuthenticated ? (
                <button className="auth-button relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]" onClick={auth.signOut}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
                  <p className="relative z-10 flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log Out
                  </p>
                </button>
              ) : (
                <button className="auth-button relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]" onClick={auth.signIn}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
                  <p className="relative z-10 flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Log In
                  </p>
                </button>
              )}
              </>
            )}
            
            {/* Additional Info */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                Secure authentication powered by Puter
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#2a2a2a]">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-[#2a2a2a]">
                <svg className="w-6 h-6 text-[#00ff66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-xs text-gray-400">Secure</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-[#2a2a2a]">
                <svg className="w-6 h-6 text-[#00ff66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-xs text-gray-400">Fast</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-[#2a2a2a]">
                <svg className="w-6 h-6 text-[#00ff66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-xs text-gray-400">Private</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default auth