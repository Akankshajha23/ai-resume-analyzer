import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { usePuterStore } from "~/lib/puter";
import Navbar from "~/components/Navbar";

interface FSItem {
  id: string;
  name: string;
  path: string;
}

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [wiping, setWiping] = useState(false);
  const [done, setDone] = useState(false);

  const loadFiles = async () => {
    try {
      const files = (await fs.readDir("./")) as FSItem[];
      setFiles(files);
    } catch {
      setFiles([]);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    setWiping(true);
    try {
      for (const file of files) {
        await fs.delete(file.path);
      }
      await kv.flush();
      await loadFiles();
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } finally {
      setWiping(false);
      setConfirming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <>  
      <Navbar/>
      <main className="bg-gradient flex items-center justify-center min-h-screen relative overflow-hidden font-sans">
      {/* Glowing background blobs */}
      <motion.div
        className="absolute top-20 left-20 w-80 h-80 bg-[#6b8cff] rounded-full mix-blend-screen blur-[120px] opacity-20"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 bg-[#c77dff] rounded-full mix-blend-screen blur-[120px] opacity-20"
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Main panel */}
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-[#0f0f1a]/80 border border-[#1e1e2a] rounded-2xl p-10 md:p-12 max-w-2xl w-[90%] shadow-[0_0_30px_rgba(107,140,255,0.15)] backdrop-blur-2xl text-white flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <h1 className="text-gradient text-4xl font-semibold">
            Wipe App Data
          </h1>
          <p className="text-gray-400 text-sm">
            Authenticated as <span className="text-gradient">{auth.user?.username}</span>
          </p>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#6b8cff] to-transparent rounded-full mt-2" />
        </div>

        {/* File list */}
        <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[#6b8cff]/40 scrollbar-track-transparent">
          {files.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-3"
            >
              {files.map((file, i) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex justify-between items-center p-3 bg-[#14141f] border border-[#1e1e2a] rounded-xl"
                >
                  <p className="text-sm text-gray-300">{file.name}</p>
                  <span className="text-xs text-gray-500">{file.path}</span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-gray-500 text-center italic py-4">
              No files found in storage.
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {!confirming ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setConfirming(true)}
              className="auth-button relative overflow-hidden group !w-auto px-8 py-3"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
              <p className="relative z-10 flex items-center justify-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6v8H9zM10 9h4m1-3h-6a2 2 0 00-2 2v2h10V8a2 2 0 00-2-2z"
                  />
                </svg>
                Wipe Data
              </p>
            </motion.button>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  className="px-8 py-3 rounded-full bg-[#14141f] border border-[#6b8cff]/40 text-[#6b8cff] hover:bg-[#6b8cff]/10 transition-all"
                  onClick={() => setConfirming(false)}
                >
                  Cancel
                </button>
                <button
                  disabled={wiping}
                  onClick={handleDelete}
                  className={`px-8 py-3 rounded-full transition-all duration-300 ${
                    wiping
                      ? "bg-gradient-to-b from-[#6b8cff]/40 to-[#c77dff]/40 cursor-not-allowed"
                      : "bg-gradient-to-b from-[#6b8cff] to-[#c77dff] hover:scale-[1.03]"
                  }`}
                >
                  {wiping ? "Wiping..." : "Confirm Wipe"}
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Success message */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-green-400 font-medium mt-2"
            >
              ✅ All data successfully wiped!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </main>
    </>
  );
};

export default WipeApp;
