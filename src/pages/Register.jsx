import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { UserPlus, Mail, Lock, Image as ImageIcon } from "lucide-react";
import api from "../utils/api.js";
import { useState } from "react";

export default function Register() {
  const [formData, setForm] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      await api.post("/api/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registrasi gagal, periksa data kamu.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-bg relative overflow-hidden">
      {/* Ornamen Grafis Latar Belakang Paus Neon */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-cyber-neon filter blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-cyber-dark border-2 border-cyber-pink/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(236,72,153,0.15)]"
      >
        <div className="text-center mb-8">
          <motion.h2
            animate={{ textShadow: "0 0 15px #EC4899" }}
            transition={{
              repeat: Infinity,
              duration: 2,
              repeatType: "reverse",
            }}
            className="text-3xl font-extrabold text-cyber-pink tracking-wider flex items-center justify-center gap-2"
          >
            <UserPlus className="w-8 h-8" /> JOIN TARGET WATCH
          </motion.h2>
          <p className="text-gray-400 text-sm mt-2">
            Daftarkan akun intelijen ritel kamu
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-cyber-rose/20 border border-cyber-rose text-cyber-rose text-sm rounded-lg text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <UserPlus className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Username"
              required
              className="w-full bg-cyber-bg border border-gray-700 focus:border-cyber-pink rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 outline-none transition-colors font-mono"
              onChange={(e) =>
                setForm({ ...formData, username: e.target.value })
              }
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="email"
              placeholder="Email Intelijen"
              required
              className="w-full bg-cyber-bg border border-gray-700 focus:border-cyber-pink rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 outline-none transition-colors font-mono"
              onChange={(e) => setForm({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="password"
              placeholder="Password (Min. 8 Karakter)"
              required
              className="w-full bg-cyber-bg border border-gray-700 focus:border-cyber-pink rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 outline-none transition-colors font-mono"
              onChange={(e) =>
                setForm({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="relative">
            <ImageIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="url"
              placeholder="URL Link Gambar Avatar (Opsional)"
              className="w-full bg-cyber-bg border border-gray-700 focus:border-cyber-pink rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 outline-none transition-colors font-mono"
              onChange={(e) => setForm({ ...formData, avatar: e.target.value })}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px #EC4899" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-cyber-pink text-white font-bold py-3.5 rounded-xl tracking-widest hover:bg-opacity-90 transition-all font-mono"
          >
            INITIALIZE REGISTRATION
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Sudah punya izin akses?{" "}
          <Link
            to="/login"
            className="text-cyber-cyan hover:underline font-bold"
          >
            Login Disini
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
