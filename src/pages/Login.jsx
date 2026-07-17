import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { GoogleLogin } from "@react-oauth/google";
import { ShieldAlert, Mail, Lock } from "lucide-react";
import { setAuthSuccess } from "../store/authSlice.js";
import api from "../utils/api.js";
import { useState } from "react";

export default function Login() {
  const [formData, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      const response = await api.post("/api/auth/login", formData);
      const { access_token, user } = response.data.data;
      dispatch(
        setAuthSuccess({
          token: access_token,
          user: user,
        }),
      );

      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Email atau password salah.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError(null);

      const { credential } = credentialResponse;

      const response = await api.post(
        "api/auth/login-google",
        {},
        {
          headers: {
            "access-token-google": credential,
          },
        },
      );

      const { access_token, user } = response.data.data;

      dispatch(
        setAuthSuccess({
          token: access_token,
          user: user,
        }),
      );

      navigate("/home");
    } catch (error) {
      console.error("DETAIL ERROR JARINGAN FRONTEND:", error);
      setError("Autentikasi Google Gagal terhubung ke server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-cyber-neon filter blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-cyber-dark border-2 border-cyber-neon/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.15)]"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-cyber-neon tracking-wider flex items-center justify-center gap-2">
            <ShieldAlert className="w-8 h-8" /> WHALEWATCH AI
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Masuk ke ruang radar pengawas sentimen
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-cyber-rose/20 border border-cyber-rose text-cyber-rose text-sm rounded-lg text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleManualLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="email"
              placeholder="Email Akses"
              required
              className="w-full bg-cyber-bg border border-gray-700 focus:border-cyber-neon rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 outline-none transition-colors font-mono"
              onChange={(e) => setForm({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="password"
              placeholder="Password Keamanan"
              required
              className="w-full bg-cyber-bg border border-gray-700 focus:border-cyber-neon rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 outline-none transition-colors font-mono"
              onChange={(e) =>
                setForm({ ...formData, password: e.target.value })
              }
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px #8B5CF6" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-cyber-neon text-white font-bold py-3.5 rounded-xl tracking-widest transition-all font-mono"
          >
            AUTHORIZE ACCESS
          </motion.button>
        </form>

        {/* Separator Garis */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-gray-800"></div>
          <span className="absolute bg-cyber-dark px-3 text-xs text-gray-500 font-mono">
            OR SECURE METHOD
          </span>
        </div>

        {/* Tombol Integrasi Google OAuth SDK Resmi */}
        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google OAuth Login Error")}
            theme="filled_dark"
            shape="circle"
            width="100%"
          />
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          Belum terdaftar di jaringan?{" "}
          <Link
            to="/register"
            className="text-cyber-pink hover:underline font-bold"
          >
            Buat Akun Disini
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
