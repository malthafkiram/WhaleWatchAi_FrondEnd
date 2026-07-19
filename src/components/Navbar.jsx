import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { LogOut, User, Sparkles, Menu, Radio } from "lucide-react";
import { setLogout } from "../store/authSlice.js";

export default function Navbar({ onToggleSidebar, onOpenWhaleRadar }) {
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
    <header className="h-20 bg-cyber-dark/80 backdrop-blur-md border-b border-gray-800/80 fixed top-0 right-0 left-0 md:left-64 flex items-center justify-between px-4 md:px-8 z-20 transition-all">
      {/* IDENTITAS ALAT MONITOR & HAMBURGER */}
      <div className="flex items-center gap-3 font-mono text-xs font-bold text-gray-400">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/40 md:hidden transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-ping flex-shrink-0" />
        <button
          onClick={onOpenWhaleRadar}
          className="px-3 py-1.5 bg-cyber-cyan/10 border border-cyber-cyan/30 hover:bg-cyber-cyan/20 text-cyber-cyan rounded-xl transition-all flex items-center gap-1.5 font-bold"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" /> RADAR TRANSAKSI PAUS
        </button>
      </div>

      {/* BLOK PROFIL DAN LOGOUT (Hanya tampil di Desktop/Tablet besar, disembunyikan di Mobile Android) */}
      <div className="hidden md:flex items-center gap-4 md:gap-6 font-mono">

        {/* Tampilan Sesi Akun Pengguna */}
        <div className="flex items-center gap-2 md:gap-3 border-r border-gray-800/80 pr-4 md:pr-6">
          <div className="text-right">
            <span className="text-xs md:text-sm font-black text-white block tracking-wide truncate max-w-[85px] md:max-w-none">
              {user?.username || "PENGGUNA_ANONIM"}
            </span>

            {/* BADGE MEMBERSHIP DINAMIS */}
            {isPremiumUser ? (
              <span className="text-[9px] md:text-[10px] font-black text-cyber-neon bg-cyber-neon/10 border border-cyber-neon/40 px-1.5 py-0.5 rounded flex items-center gap-0.5 mt-0.5 shadow-[0_0_10px_rgba(139,92,246,0.2)] animate-pulse">
                <Sparkles className="w-2.5 h-2.5 fill-cyber-neon" /> <span className="hidden sm:inline">WHALE</span> PRO
              </span>
            ) : (
              <span className="text-[9px] md:text-[10px] font-bold text-gray-500 bg-gray-800/40 border border-gray-700/60 px-1.5 py-0.5 rounded flex items-center gap-0.5 mt-0.5">
                <User className="w-2.5 h-2.5" /> <span className="hidden sm:inline">GRATIS</span>
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
            className="w-8 h-8 md:w-10 md:h-10 rounded-xl object-cover border border-gray-700 bg-cyber-bg"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80";
            }}
          />
        </div>

        {/* BUTTON LOGOUT */}
        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 text-xs font-bold tracking-widest text-cyber-rose hover:text-white bg-cyber-rose/10 hover:bg-cyber-rose border border-cyber-rose/20 rounded-xl transition-all cursor-pointer"
          title="Keluar dari Sesi"
        >
          <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">KELUAR</span>
        </button>
      </div>

    </header>
  );
}
