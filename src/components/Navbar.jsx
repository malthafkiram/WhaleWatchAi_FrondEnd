import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { LogOut, User, Sparkles } from "lucide-react";
import { setLogout } from "../store/authSlice.js";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const handleLogoutClick = () => {
    dispatch(setLogout()); // Bersihkan memori RAM Redux & LocalStorage
    navigate("/login"); // Kembalikan paksa ke gerbang masuk terluar
  };

  // Evaluasi status membership secara aman (mencegah logical error typo data type)
  const isPremiumUser =
    user && (user.isPremium === true || String(user.isPremium) === "true");

  return (
    <header className="h-20 bg-cyber-dark/80 backdrop-blur-md border-b border-gray-800/80 fixed top-0 right-0 left-64 flex items-center justify-between px-8 z-20 transition-all">
      {/* IDENTITAS ALAT MONITOR */}
      <div className="flex items-center gap-2 font-mono text-xs font-bold text-gray-400">
        <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-ping" />
        <span>RADAR TELEMETRY ACTIVE</span>
      </div>

      {/* BLOK PROFIL DAN LOGOUT  */}
      <div className="flex items-center gap-6 font-mono">
        {/* Tampilan Sesi Akun Pengguna */}
        <div className="flex items-center gap-3 border-r border-gray-800/80 pr-6">
          <div className="text-right">
            <span className="text-sm font-black text-white block tracking-wide">
              {user?.username || "OPERATOR_UNKNOWN"}
            </span>

            {/* BADGE MEMBERSHIP DINAMIS (Menjawab Kekurangan 1 kamu)[cite: 28] */}
            {isPremiumUser ? (
              <span className="text-[10px] font-black text-cyber-neon bg-cyber-neon/10 border border-cyber-neon/40 px-2 py-0.5 rounded flex items-center gap-1 mt-0.5 shadow-[0_0_10px_rgba(139,92,246,0.2)] animate-pulse">
                <Sparkles className="w-3 h-3 fill-cyber-neon" /> WHALE PRO
              </span>
            ) : (
              <span className="text-[10px] font-bold text-gray-500 bg-gray-800/40 border border-gray-700/60 px-2 py-0.5 rounded flex items-center gap-1 mt-0.5">
                <User className="w-3 h-3" /> FREE MEMBER
              </span>
            )}
          </div>

          {/* Avatar User */}
          <img
            src={
              user?.avatar ||
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80"
            }
            alt="avatar"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-xl object-cover border border-gray-700 bg-cyber-bg"
            onError={(e) => {
              // Jika link rusak/terpotong di tengah jalan, otomatis ganti ke gambar placeholder
              e.target.src =
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80";
            }}
          />
        </div>

        {/* BUTTON LOGOUT (Menjawab Kekurangan 1 kamu)[cite: 28] */}
        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest text-cyber-rose hover:text-white bg-cyber-rose/10 hover:bg-cyber-rose border border-cyber-rose/20 rounded-xl transition-all cursor-pointer"
          title="Disconnect Terminal Session"
        >
          <LogOut className="w-4 h-4" /> LOGOUT
        </button>
      </div>
    </header>
  );
}
